import jwt
from flask import Blueprint
from flask import current_app
import datetime
from db import *


def authenticate(token, username):
    # if request does not have a token
    if not token:
        return False

    # verify the user
    try:
        print(token, username)
        data = jwt.decode(
            token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        print(data)
        currentUser = db.User.find_one(
            {'userID': data['userID'], 'passwordHash': data['passwordHash']})
        currentUsername = currentUser['userID']

        # If username supplied,
        if username and username != currentUsername and currentUsername != "RH_JCRC":
            raise Exception("Wrong UserID")
    except Exception as e:
        print(e)
        return False

    # check if token has expired (compare time now with createdAt field in document + timedelta)
    originalToken = db.Session.find_one(
        {'userID': data['userID'], 'passwordHash': data['passwordHash']})
    oldTime = originalToken['createdAt']
    # print(datetime.datetime.now())
    # print(oldTime)
    if datetime.datetime.now() > oldTime + datetime.timedelta(minutes=2):
        return False

    # recreate session (with createdAt updated to now)
    #db.Session.remove({'userID': { "$in": data['username']}, 'passwordHash': {"$in": data['passwordHash']}})
    #db.Session.insert_one({'userID': data['username'], 'passwordHash': data['passwordHash'], 'createdAt': datetime.datetime.now()})
    db.Session.update({'userID': data['userID'], 'passwordHash': data['passwordHash']}, {
        '$set': {'createdAt': datetime.datetime.now()}}, upsert=True)
    return True
