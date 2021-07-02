from flask_mail import Mail, Message
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from db import *
from flask import Flask, jsonify, request, make_response, url_for
from flask_cors import CORS, cross_origin
import os
import sys
import jwt
import datetime
import pymongo
from functools import wraps
from flask import Blueprint
from flask import current_app
sys.path.append("../")

authentication_api = Blueprint("authentication", __name__)

#### FORGOT PASSWORD STUFF ####


def load_mail():
    current_app.config['MAIL_SERVER'] = 'smtp.office365.com'
    current_app.config['MAIL_PORT'] = 587
    current_app.config['MAIL_USERNAME'] = 'example@u.nus.edu' #input your own NUS acc email
    current_app.config['MAIL_PASSWORD'] = 'examplepassword'   #input your own NUS acc password
    current_app.config['MAIL_USE_TLS'] = True
    current_app.config['MAIL_USE_SSL'] = False
    return Mail(current_app)

# Uncomment the create_index command if you need to recreate the expiration index for Session collection
# https://stackoverflow.com/questions/54750273/pymongo-and-ttl-wrong-expiration-time
# db.Session.create_index("createdAt", expireAfterSeconds = 120)

# Uncomment the below create_index command if you need to recreate the expiration index for PasswordResetSession collection
#db.PasswordResetSession.create_index("resetTokenCreatedAt", expireAfterSeconds=300)

"""
Decorative function: 
checks for and verifies token. Used in /protected
"""


def check_for_token(func):
    def decorated(*args, **kwargs):
        # extract token; for example here I assume it is passed as query parameter
        token = request.args.get('token')

        # if request does not have a token
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        # verify the user
        try:
            data = jwt.decode(
                token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            currentUser = db.User.find_one(
                {'userID': data['userID'], 'passwordHash': data['passwordHash']})
            currentUsername = currentUser['userID']
        except Exception as e:
            # print(e)
            return jsonify({'message': 'Token is invalid'}), 403

        # check if token has expired (compare time now with createdAt field in document + timedelta)
        originalToken = db.Session.find_one(
            {'userID': data['userID'], 'passwordHash': data['passwordHash']})
        oldTime = originalToken['createdAt']
        # print(datetime.datetime.now())
        # print(oldTime)
        if datetime.datetime.now() > oldTime + datetime.timedelta(weeks=2):
            return jsonify({'message': 'Token has expired'}), 403
        else:
            # recreate session (with createdAt updated to now)
            #db.Session.remove({'userID': { "$in": data['username']}, 'passwordHash': {"$in": data['passwordHash']}})
            #db.Session.insert_one({'userID': data['username'], 'passwordHash': data['passwordHash'], 'createdAt': datetime.datetime.now()})
            db.Session.update({'userID': data['userID'], 'passwordHash': data['passwordHash']}, {
                              '$set': {'createdAt': datetime.datetime.now()}}, upsert=True)

        return func(currentUser, *args, **kwargs)

    return decorated


"""
Register route:
Within POST request, obtain userID, password and email and add to User table in Mongo, if userID has not been registered previously
If successful return 200, else return 500
"""


@authentication_api.route('/register', methods=['POST'])
def register():
    try:
        # extract userID, password and email
        formData = request.get_json()
        userID = formData["userID"]
        passwordHash = formData["passwordHash"]
        email = formData["email"]
        position = formData["position"]
        displayName = formData["displayName"]
        bio = formData["bio"]
        block = formData["block"]
        telegramHandle = formData["telegramHandle"]
        if db.User.find({'userID': userID}).count():  # entry exists
            return jsonify({'message': 'User already exists'}), 401
        # add to User table
        # note: if the user data does not adhere to defined validation standards, an error will be thrown here
        db.User.insert_one({"userID": userID,
                            "passwordHash": passwordHash,
                            "email": email,
                            "position": position
                            })
        db.Profiles.insert_one({"userID": userID,
                                "displayName": displayName,
                                "bio": bio,
                                "block": block,
                                "telegramHandle": telegramHandle,
                                "profilePictureURI": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon"
                                })
    except Exception as e:
        return jsonify({'message': 'An error was encountered.'}), 500
    return jsonify({'message': 'User successfully created!'}), 200


"""
Login route:
Within POST request, verify userID and passwordHash are valid.
If true, create session, return JWT to client, else return 500.
"""


@authentication_api.route('/login', methods=['POST'])
def login():
    req = request.get_json()
    userID = req['userID']
    passwordHash = req['passwordHash']
    # authenticate the credentials
    if not db.User.find({'userID': userID, 'passwordHash': passwordHash}).limit(1):
        return jsonify({'message': 'Invalid credentials'}), 403
    # insert new session into Session table
    #db.Session.createIndex({'createdAt': 1}, { expireAfterSeconds: 120 })
    db.Session.update({'userID': userID, 'passwordHash': passwordHash}, {'$set': {
                      'userID': userID, 'passwordHash': passwordHash, 'createdAt': datetime.datetime.now()}}, upsert=True)
    #db.Session.update({'userID': username, 'passwordHash': passwordHash}, {'$set': {'createdAt': datetime.datetime.now()}}, upsert=True)
    # generate JWT (note need to install PyJWT https://stackoverflow.com/questions/33198428/jwt-module-object-has-no-attribute-encode)
    token = jwt.encode({'userID': userID,
                        'passwordHash': passwordHash  # to change timedelta to 15 minutes in production
                        }, current_app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({'token': token}), 200


"""
Protected route:
Acts as gatekeeper; can only access requested resource if you are authenticated ie valid session
Successful authentication will return the 200 status code below. Any other errors will be as reflected in the wrapper function.
"""


@authentication_api.route('/protected', methods=['GET'])
@check_for_token
def protected(currentUser):
    return jsonify({'message': 'Successfully logged in. Redirecting.'}), 200


"""
Logout route:
Delete the session entry
"""


@authentication_api.route('/logout', methods=['GET'])
def logout():
    userID = request.args.get('userID')
    try:
        db.Session.remove({"userID": userID})
    except:
        return jsonify({'message': 'An error occurred'}), 500
    return jsonify({'message': 'You have been successfully logged out'}), 200


"""
https://stackoverflow.com/questions/23039734/flask-login-password-reset
https://www.youtube.com/watch?v=zYWpEJAHvaI

Forgot route:
Asks the user for email to send password reset token.
Check if email exists in database of users.
If so, create reset token (valid for fixed period eg 15 mins?), send link with /auth/reset?token=<token> to user email
"""
# @authentication_api.route('/forgot', methods=['GET'])
# def renderForgotPage():
#    pass #render form template to submit email here

ser = Serializer("secret", expires_in=300)

@authentication_api.route('/forgot', methods=['POST'])
def submitEmail():
    formData = request.get_json()
    email = formData["email"]
    # search email in DB
    associatedUser = db.User.find_one({
        "email": email
        })
    # if there is a user associated with the email, create password reset token (using JWS) then send email with reset token
    if associatedUser:
        mail = load_mail()
        newResetToken = ser.dumps(associatedUser['userID']).decode('utf-8')
        db.PasswordResetSession.insert_one(
            {'userID': associatedUser['userID'], 
            'email': email
            })
        msg = Message('Password Reset for RHApp',
                      sender=current_app.config.get("MAIL_USERNAME"),
                      recipients=[email])
        msg.body = f'''To reset your password, please visit this URL:\n 
        
        {url_for('authentication.reset_token', token=newResetToken,_external=True)}\n

        If you didn't request for a password reset, please ignore this message.
        
        '''
        mail.send(msg)
    # print message regardless of whether email is valid or not
    return jsonify({'message': 'You will receive an email if there is an account associated with the email address'}), 200


"""
Reset route:
Check if the token is valid.
If valid, ask for their password, hash on client-side, update relevant DB User entry
"""

@authentication_api.route('/reset/<token>', methods=['GET'])
def reset_token(token):
    try:
        associatedUser = ser.loads(token)
    except:
        associatedUser = None
    if associatedUser is None:
        return jsonify({'message': "Token is invalid or expired. Please try again."}), 403
    userRequestingReset = db.PasswordResetSession.find_one({
        'userID': associatedUser
        })
    if userRequestingReset is None:
        return jsonify({'message': "An error was encountered. Please try again."}), 405
    return jsonify({'message': "Redirecting to password reset page"}), 200

@authentication_api.route('/reset/<token>', methods=['POST'])
def update_token(token):
    formData = request.get_json()
    associatedUserID = ser.loads(token)
    newPasswordHash = formData['newPasswordHash']
    # update DB User entry with password
    if not db.User.find_one({'userID': associatedUserID}):
        return jsonify({'message': 'Invalid credentials'}), 403
    else:
        db.User.update(
            {
                'userID': associatedUserID
            }, 
            {
                '$set': {'passwordHash': newPasswordHash}
            }
        )
        return jsonify({'message': "Password updated successfully"}), 200
