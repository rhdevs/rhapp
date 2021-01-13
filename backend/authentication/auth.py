from flask import Flask, jsonify, request, make_response
import jwt
import datetime

#MongoDB
myclient = client = pymongo.MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]

app = flask.Flask("rhapp")
app.config['AUTH_SECRET_KEY'] = 'secretkeyvalue'

CORS(app, origins=CROSS_ORIGINS_LIST, headers=['Content-Type'], 
         expose_headers=['Access-Control-Allow-Origin'], supports_credentials=True)


#for new registration, check if matric already exists
def userIDAlreadyExists(testID):
    if db.User.find({'userID': { "$in": testID}}).count() > 0:
        return True
    else:
        return False


"""
Register route:
Within POST request, obtain userID, password and email and add to User table in Mongo
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
    if db.User.find({'userID': { "$in": username}, 'passwordHash': { "$in": passwordHash}}).count() == 0:
        return jsonify({'message': 'Invalid credentials'}), 403
    #generate JWT
    token = jwt.encode({'user': req.username,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)}, app.config['AUTH_SECRET_KEY'])
    
    return jsonify({'token': token.decode('UTF-8')}), 200



# this route will only be seen if you are authenticated ie valid JWT 
@app.route('/auth/protected', methods=['POST'])
def protected():
    return {message: f'protected endpoint (allowed user {flask_praetorian.current_user().username})'}



# this will blacklist the JWT until its expiration
@app.route('/auth/logout')
def logout():
    pass


# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)