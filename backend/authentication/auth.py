from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import jwt
import datetime
import pymongo
from functools import wraps

#MongoDB
myclient = client = pymongo.MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]

app = Flask("rhapp")
app.config['SECRET_KEY'] = 'secretkeyvalue' # will replace with flaskenv variable in the future

#CORS(app, origins=CROSS_ORIGINS_LIST, headers=['Content-Type'], 
#         expose_headers=['Access-Control-Allow-Origin'], supports_credentials=True)

# https://stackoverflow.com/questions/54750273/pymongo-and-ttl-wrong-expiration-time
db.Session.create_index("createdAt", expireAfterSeconds = 120)

"""
Decorative function: 
checks for and verifies token. Used in /protected
"""
def check_for_token(func):
    def decorated(*args, **kwargs):
        #extract token; for example here I assume it is passed as query parameter
        token = requests.args.get('token')
        
        #if request does not have a token
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        #verify the user
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            currentUser = db.User.find({'userID': { "$in": data['username']}, 'passwordHash': {"$in": data['passwordHash']}}).limit(1)
            currentUsername = currentUser['userID']
        except: 
            return jsonify({'message': 'Token is invalid'}), 401
        
        #check if token has expired (compare time now with createdAt field in document + timedelta)
        oldTime = db.Session.find({'userID': { "$in": data['username']}, 'passwordHash': {"$in": data['passwordHash']}}, {'_id': 0, 'createdAt': 1})['createdAt']
        if datetime.datetime.now() > oldTime + timedelta(minutes=2):
            return jsonify({'message': 'Token has expired'}), 403
        else:
            #recreate session (with createdAt updated to now)
            #db.Session.remove({'userID': { "$in": data['username']}, 'passwordHash': {"$in": data['passwordHash']}})
            #db.Session.insert_one({'userID': data['username'], 'passwordHash': data['passwordHash'], 'createdAt': datetime.datetime.now()})
            db.Session.update({'userID': data['username'], 'passwordHash': data['passwordHash']}, {'$set': {"createdAt": datetime.datetime.now()}}, {upsert: true})

        return func(currentUser, *args, **kwargs)

    return decorated


"""
Register route:
Within POST request, obtain userID, password and email and add to User table in Mongo, if userID has not been registered previously
If successful return 200, else return 500
"""
@app.route('/auth/register', methods=['POST'])
def register():
    try:
    #extract userID, password and email
        formData = request.get_json()
        userID = formData["userID"]
        passwordHash = formData["passwordHash"]
        email = formData["email"]
        if db.User.find({'userID': userID}).count(): # entry exists
            return jsonify({'message': 'User already exists'}), 401
        #add to User table
        #note: if the user data does not adhere to defined validation standards, an error will be thrown here
        db.User.insert_one(formData)
    except:
        return jsonify({'message': 'An error was encountered.'}), 500
    return jsonify({'message': 'User successfully created!'}), 200



"""
Login route:
Within POST request, verify userID and passwordHash are valid.
If true, create session, return JWT to client, else return 500.
"""
@app.route('/auth/login', methods=['POST'])
def login():
    req = request.get_json()
    username = req['userID']
    passwordHash = req['passwordHash']
    #authenticate the credentials
    if not db.User.find({'userID': { "$in": username}, 'passwordHash': { "$in": passwordHash}}).limit(1):
        return jsonify({'message': 'Invalid credentials'}), 403
    #insert new session into Session table
    #db.Session.createIndex({'createdAt': 1}, { expireAfterSeconds: 120 })
    db.Session.update({'userID': username, 'passwordHash': passwordHash}, {'$set': {'createdAt': datetime.datetime.now()}}, upsert=True)
    #generate JWT (note need to install PyJWT https://stackoverflow.com/questions/33198428/jwt-module-object-has-no-attribute-encode)
    token = jwt.encode({'userID': username,
                        'passwordHash': passwordHash #to change timedelta to 15 minutes in production
                        }, app.config['SECRET_KEY'])
    
    return jsonify({'token': token}), 200



"""
Protected route:
Acts as gatekeeper; can only access requested resource if you are authenticated ie valid session
"""
@app.route('/auth/protected', methods=['POST'])
@check_for_token
def protected(currentUser):
    return jsonify({'message': 'You need to be logged in to view this'}), 403
    


"""
Logout route:
Delete the session entry
"""
@app.route('/auth/logout', methods=['GET'])
def logout():
    userID = request.args.get('userID')
    try:
        db.Session.remove({"userID": userID})
    except:
        return jsonify({'message': 'An error occurred'}), 500
    return jsonify({'message': 'You have been successfully logged out'}), 200



# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)