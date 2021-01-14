from flask import Flask, jsonify, request, make_response
import jwt
import datetime
import pymongo
from functools import wraps

#MongoDB
myclient = client = pymongo.MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]

app = flask.Flask("rhapp")
app.config['SECRET_KEY'] = 'secretkeyvalue' # will replace with flaskenv variable in the future

CORS(app, origins=CROSS_ORIGINS_LIST, headers=['Content-Type'], 
         expose_headers=['Access-Control-Allow-Origin'], supports_credentials=True)


#for new registration, check if matric already exists
def userIDAlreadyExists(testID):
    if db.User.find({'userID': { "$in": testID}}).count() > 0:
        return True
    else:
        return False

def tokenHasExpired(token):
    #if db.Blacklist.find({'token': token}).count():
    #   return True
    #else:
    #   return False
    pass


"""
Decorative function: 
checks for and verifies token. Used in /protected
"""
def check_for_token(func):
    @wraps(f)
    def decorated(*args, **kwargs):
        #extract token; for example here I assume it is passed as query parameter
        token = requests.args.get('token')

        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        #if tokenHasExpired(token):
        #    return jsonify({'message': 'Token is no longer valid'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            currentUser = db.User.find({'userID': { "$in": username}}).limit(1)
        except: 
            return jsonify({'message': 'Token is invalid'}), 403
        
        return f(currentUser, *args, **kwargs)

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
        if userIDAlreadyExists(userID):
            return jsonify({'message': 'User already exists'}), 401
        #add to User table
        db.User.insert_one(formData)
    except:
        return jsonify({'message': 'An error was encountered.'}), 500
    return jsonify({'message': 'User successfully created!'}), 200



"""
Register route:
Within POST request, verify userID and passwordHash are valid.
If true return JWT to client, else return 500.
"""
@app.route('/auth/login', methods=['POST'])
def login():
    req = request.get_json()
    username = req['userID']
    passwordHash = req['passwordHash']
    #authenticate the credentials
    if not db.User.find({'userID': { "$in": username}, 'passwordHash': { "$in": passwordHash}}).limit(1):
        return jsonify({'message': 'Invalid credentials'}), 403
    #generate JWT
    token = jwt.encode({'user': username,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=60) #to change timedelta to 15 minutes in production
                        }, app.config['SECRET_KEY']) 
    
    return jsonify({'token': token.decode('UTF-8')}), 200



# this route acts as gatekeeper: can only access requested resource if you are authenticated ie valid JWT 
@app.route('/auth/protected', methods=['POST'])
@check_for_token
def protected(currentUser):
    return jsonify({'message': 'You need to be logged in to view this'}), 403
    


# this will blacklist the JWT until its expiration
@app.route('/auth/logout')
def logout():
    pass
    #extract token, add to a new collection Blacklist (remember to include the TTL)
    #pass success message


# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)