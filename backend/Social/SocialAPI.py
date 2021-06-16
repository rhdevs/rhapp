from db import *
from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS, cross_origin
import pymongo
import json
import os
import time
import jwt
import sys
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from flask import Blueprint
import sys
sys.path.append("../db")

social_api = Blueprint("social", __name__)

# When put/delete, run find first to make sure element is present


def renamePost(post):
    post['postID'] = post.pop('_id')
    return post


@social_api.route("/")
@cross_origin(supports_credentials=True)
def hello():
    return "Welcome the Raffles Hall Social server"


@social_api.route('/profiles', methods=['GET', 'PUT'])
@cross_origin(supports_credentials=True)
def profiles():
    try:
        if request.method == 'GET':
            data = db.Profiles.find()
            response = {
                "status": "success",
                "data": json.dumps(list(data), default=lambda o: str(o))
            }
            return make_response(response, 200)

        elif request.method == 'PUT':
            data = request.get_json()

            userID = str(data.get('userID'))
            displayName = str(data.get('displayName'))
            bio = str(data.get('bio'))
            profilePictureUrl = str(data.get('profilePictureUrl'))
            block = int(data.get('block'))
            telegramHandle = str(data.get('telegramHandle'))
            modules = data.get('modules')

            body = {
                "userID": userID,
                "displayName": displayName,
                "bio": bio,
                "profilePictureUrl": profilePictureUrl,
                "block": block,
                "telegramHandle": telegramHandle,
                "modules": modules
            }

            result = db.Profiles.update_one(
                {"userID": userID}, {'$set': body}, upsert=True)

            if int(result.matched_count) > 0:
                response = {
                    "status": "success",
                    "message": "Event changed"
                }
                return make_response(response, 200)
            else:
                response = {
                    "status": "failed",
                }
                return make_response(response, 204)
    except Exception as e:
        response = {
            "status": "failed",
            "err": str(e)
        }
        return make_response(response, 400)


@social_api.route("/profile")
@cross_origin(supports_credentials=True)
def users():
    userIdList = request.args.getlist('userID')
    try:
        data = db.Profiles.find({"userID": {'$in': userIdList}}, {"_id": 0})
        response = {
            "data": list(data),
            "status": "success"
        }
        return make_response(response, 400)
    except Exception as e:
        response = {
            "status": "failed",
            "err": str(e)
        }
        print(e)

    return make_response(response, 200)


@social_api.route("/profile/picture/<string:userID>", methods=['GET'])
@cross_origin(supports_credentials=True)
def getUserPicture(userID):
    response = {}
    defaultProfilePictureUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    try:
        image = db.Profiles.find_one(
            {"userID": userID}, {"profilePictureUrl": 1})
        response['status'] = "success"
        response['data'] = {
            'image': image.get('profilePictureUrl')
        }

        return make_response(response, 200)

    except Exception as e:
        # TODO don't catch all exceptions
        response = {
            "status": "failed",
            "error": str(e)
        }

        return make_response(response, 200)


@social_api.route("/profile/<string:userID>")
@cross_origin(supports_credentials=True)
def getUserProfile(userID):
    try:
        data = db.Profiles.find({"userID": userID}, {"_id": 0})
        response = {
            "data": list(data),
            "status": "success"
        }
    except Exception as e:
        response = {
            "status": "failed",
            "err": str(e)
        }
        print(e)
        return make_response(response, 400)

    return make_response(response, 200)


@social_api.route("/user", methods=['PUT', 'DELETE', 'POST'])
@cross_origin(supports_credentials=True)
def user():
    try:
        if request.method == 'PUT':
            data = request.get_json()

            userID = str(data.get('userID'))
            passwordHash = str(data.get('passwordHash'))
            email = str(data.get('email'))

            body = {
                "passwordHash": passwordHash,
                "email": email,
            }

            result = db.User.update_one(
                {"userID": userID}, {'$set': body}, upsert=True)

            if int(result.matched_count) > 0:
                response = {
                    "message": "Event changed",
                    "status": "success"
                }
                return make_response(response, 200)
            else:
                response = {
                    "status": "failed"
                }
                return make_response(response, 204)

        elif request.method == 'DELETE':
            userID = request.args.get('userID')
            result = db.User.delete_one({"userID": userID})
            if result.deleted_count == 0:
                response = {
                    "status": "failed",
                    "error": "User not found"
                }
                return make_response(response, 404)

            return make_response({"status": "success"}, 200)
        elif request.method == 'POST':
            data = request.get_json()
            userID = str(data.get('userID'))
            passwordHash = str(data.get('passwordHash'))
            email = str(data.get('email'))
            position = []  # default to be empty, will be added manually from BE

            body = {
                "userID": userID,
                "passwordHash": passwordHash,
                "email": email,
                "position": position
            }
            receipt = db.User.insert_one(body)
            body["_id"] = str(receipt.inserted_id)

            return make_response({"message": body, "status": "success"}, 200)

    except Exception as e:
        return {"err": str(e)}, 400


@social_api.route("/user/<userID>")
@cross_origin(supports_credentials=True)
def getUserDetails(userID):
    try:
        pipeline = [
            {'$match': {
                'userID': userID
            }
            },
            {'$lookup': {
                'from': 'Profiles',
                        'localField': 'userID',
                        'foreignField': 'userID',
                        'as': 'profile'
            }
            },
            {
                '$replaceRoot': {'newRoot': {'$mergeObjects': [{'$arrayElemAt': ["$profile", 0]}, "$$ROOT"]}}
            },
            {'$project': {'profile': 0}},
            {'$lookup': {
                'from': 'CCA',
                        'localField': 'position',
                        'foreignField': 'ccaID',
                        'as': 'positions'
            }
            },
            {'$project': {'positions.category': 0, 'positions._id': 0, 'position': 0}}
        ]

        data = db.User.aggregate(pipeline)
        response = None
        for item in data:
            response = item

        return make_response(
            {
                "data": json.dumps(response, default=lambda o: str(o)),
                "status": "success"
            }, 200)

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400

    return make_response(
        {
            "data": json.dumps(response, default=lambda o: str(o)),
            "status": "success"
        },
        200)


def userIDtoName(userID):
    # TODO use mongoDB lookup instead of this disgusting code
    # helper function
    profile = db.Profiles.find_one({"userID": userID})
    name = profile.get('displayName') if profile else None
    return name


@ social_api.route("/posts", methods=['DELETE', 'POST', 'GET', 'PUT'])
@ cross_origin(supports_credentials=True)
def posts():
    try:
        if request.method == 'GET':
            if request.args.get('postID') or request.args.get('userID'):
                userID = request.args.get("userID")
                postID = request.args.get("postID")

                if postID:
                    # TODO use mongoDB lookup to join the data instead
                    data = db.Posts.find_one({"_id": ObjectId(postID)})
                    name = db.Profiles.find_one(
                        {"userID": str(data.get("userID"))}).get('displayName')

                    if data != None:
                        data = renamePost(data)
                        data['name'] = name
                        response = {
                            "status": "success",
                            "data": json.dumps(data, default=lambda o: str(o))
                        }
                        return make_response(response, 200)
                    else:
                        return make_response({"message": "No Data Found", "status": "failed"}, 404)

                elif userID:
                    data = db.Posts.find({"userID": str(userID)})
                    response = []
                    for item in data:
                        item['name'] = userIDtoName(item.get('userID'))
                        item = renamePost(item)
                        response.append(item)

                    return make_response(
                        {
                            "data": json.dumps(response, default=lambda o: str(o)),
                            "status": "success"
                        },
                        200)

            else:
                # get all post that a user can view regardless of whether its official or not
                # userID = str(request.args.get("userID"))
                N = int(request.args.get('N')) if request.args.get('N') else 0

                # friends = FriendsHelper(userID).get('friendList')

                # TODO once we have enough users, use the query below instead so we do not see the whole universe's posts
                # query = {"$or": [{"userID": {"$in": friends}}, {"isOfficial": True}, {"userID": userID}]}

                data = db.Posts.find(
                    {}, sort=[('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5)

                # Pipeline is good, but OUR ATLAS FREE TIER DOES NOT ALLOW SORTING, SKIPPING AND LIMITING IN PIPELINE

                # pipeline = [
                #     {'sort': {'createdAt': -1}},
                #     {'skip': N*5},
                #     {'limit': 5},
                #     {
                #         '$lookup': {
                #             'from': 'Profiles',
                #             'localField': 'userID',
                #             'foreignField': 'userID',
                #             'as': 'profile'
                #         }
                #     },
                #     {
                #         '$unwind': {'path': '$profile', 'preserveNullAndEmptyArrays': True}
                #     },
                #     {
                #         '$addFields': {
                #             'profilePictureURI': "$profile.profilePictureUrl",
                #             'name': '$profile.displayName'
                #         }
                #     },
                #     {'$project': {'profile': 0}}
                # ]

                # data = db.Posts.aggregate(pipeline)

                response = []

                # for item in data:
                #     response.append(item)
                for item in data:
                    profile = db.Profiles.find_one(
                        {'userID': item.get('userID')})
                    item['name'] = profile.get(
                        'displayName') if profile != None else None
                    item['profilePictureURI'] = profile.get(
                        'profilePictureUrl') if profile != None else None
                    item = renamePost(item)
                    response.append(item)

                return make_response(
                    {
                        "data": json.dumps(response, default=lambda o: str(o)),
                        "status": "success"
                    }, 200)

        elif request.method == 'DELETE':
            postID = request.args.get('postID')
            db.Posts.delete_one({"_id": ObjectId(postID)})
            response = {
                "status": "success"
            }
            return make_response(response, 200)

        elif request.method == 'POST':
            data = request.get_json()
            userID = str(data.get('userID'))
            title = str(data.get('title'))
            description = str(data.get('description'))
            ccaID = int(data.get('ccaID')) if data.get('ccaID') else -1
            createdAt = int(datetime.now().timestamp())
            postPics = data.get('postPics') if data.get('postPics') else []
            isOfficial = bool(data.get('isOfficial'))
            tags = data.get('tags')

            body = {
                "userID": userID,
                "title": title,
                "description": description,
                "ccaID": ccaID,
                "createdAt": createdAt,
                "postPics": postPics,
                "isOfficial": isOfficial,
                "tags": tags
            }

            receipt = db.Posts.insert_one(body)
            body["_id"] = str(receipt.inserted_id)

            return make_response({"message": body}, 200)

        elif request.method == 'PUT':
            data = request.get_json()
            postID = data.get('postID')
            oldPost = db.Posts.find_one({"_id": ObjectId(postID)})

            if oldPost == None:
                return make_response("data non existent", 404)

            userID = str(data.get('userID')) if data.get(
                'userID') else oldPost.get('userID')
            title = str(data.get('title')) if data.get(
                'title') else oldPost.get('title')
            description = str(data.get('description')) if data.get(
                'description') else oldPost.get('description')
            ccaID = int(data.get('ccaID')) if data.get(
                'ccaID') else oldPost.get('ccaID')
            postPics = data.get('postPics') if data.get(
                'postPics') else oldPost.get('postPics')
            isOfficial = data.get('isOfficial') if data.get(
                'isOfficial') else oldPost.get('isOfficial')

            body = {
                "userID": userID,
                "title": title,
                "description": description,
                "ccaID": ccaID,
                "postPics": postPics,
                "isOfficial": isOfficial
            }

            result = db.Posts.update_one(
                {"_id": ObjectId(postID)}, {'$set': body})
            if int(result.matched_count) > 0:
                return make_response({'message': "Event changed"}, 200)
            else:
                return Response(status=204)
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400


@social_api.route("/posts/<userID>", methods=['GET'])
@cross_origin(supports_credentials=True)
def getPostById(userID):
    try:
        N = int(request.args.get('N')) if request.args.get('N') else 0

        data = db.Posts.find({"userID": str(userID)}, sort=[
                             ('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5)
        response = {
            "status": "success",
            "data": json.dumps(list(data), default=lambda o: str(o))
        }
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"err": str(e), "status": "failed"}, 400)


def FriendsHelper(userID):
    query = {
        "$or": [{"userIDOne": userID}, {"userIDTwo": userID}]
    }

    result = db.Friends.find(query)

    response = {'friendList': []}

    for friend in result:
        userOne = friend.get("userIDOne")
        userTwo = friend.get("userIDTwo")

        if(userID == userOne):
            response['friendList'].append(userTwo)
        else:
            response['friendList'].append(userOne)

    return response


@social_api.route("/posts/friend", methods=['GET'])
@cross_origin(supports_credentials=True)
def getFriendsPostById():
    try:
        userID = str(request.args.get("userID"))
        N = int(request.args.get('N')) if request.args.get('N') else 0

        friends = FriendsHelper(userID).get('friendList')

        query = {
            "userID": {"$in": friends}
        }

        response = []

        result = db.Posts.find(query, sort=[
            ('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5)

        for item in result:
            item['name'] = userIDtoName(item.get('userID'))
            item = renamePost(item)
            response.append(item)

        return make_response(
            {
                "data": json.dumps(response, default=lambda o: str(o)),
                "status": "success"
            },
            200)

    except Exception as e:
        return make_response({"err": str(e), "status": "failed"}, 400)


@social_api.route("/posts/official", methods=['GET'])
@cross_origin(supports_credentials=True)
def getOfficialPosts():
    try:
        N = int(request.args.get('N')) if request.args.get('N') else 0

        response = []
        data = db.Posts.find({"isOfficial": True}).sort(
            'createdAt', pymongo.DESCENDING).skip(N * 5).limit(5)

        for item in data:
            item['name'] = userIDtoName(item.get('userID'))
            ccaID = int(item.get('ccaID'))
            profile = db.Profiles.find_one({'userID': item.get('userID')})
            item['profilePictureURI'] = profile.get(
                'profilePictureUrl') if profile != None else None
            item['ccaName'] = db.CCA.find_one({'ccaID': ccaID}).get(
                'ccaName') if ccaID != -1 else None
            response.append(item)
            item['postID'] = item.get('_id')
            del item['_id']

        return make_response(
            {
                "data": json.dumps(response, default=lambda o: str(o)),
                "status": "success"
            },
            200)
    except Exception as e:
        print(e)
        return {"err": str(e), "status": "failed"}, 400


'''
Friends API 
'''


@social_api.route("/friend", methods=['DELETE', 'POST'])
@cross_origin(supports_credentials=True)
def createDeleteFriend():
    try:
        data = request.get_json()
        # we store the data as a bidirectional edge
        userOne = str(data.get('userIDOne'))
        userTwo = str(data.get('userIDTwo'))
        if request.method == "POST":
            body = {
                "userIDOne": userOne,
                "userIDTwo": userTwo
            }

            query = {
                "$or": [
                    {"userIDOne": userOne,
                     "userIDTwo": userTwo
                     },
                    {"userIDOne": userTwo,
                     "userIDTwo": userOne
                     }
                ]
            }

            result = db.Friends.find_one(query)

            if(result == None):
                db.Friends.insert_one(body)

                return make_response({"message": "Insert Succesful", "status": "success"}, 200)
            else:
                return make_response({"message": "Friendship exists", "status": "failed"}, 400)

        elif request.method == "DELETE":
            data = request.get_json()
            userOne = str(data.get)

            query = {
                "$or": [
                    {
                        "userIDOne": userOne,
                        "userIDTwo": userTwo
                    },
                    {
                        "userIDOne": userTwo,
                        "userIDTwo": userOne
                    }]
            }

            db.Friends.delete_one(query)

            return make_response({"message": "Delete Successful", "status": "success"}, 200)

    except Exception as e:
        return make_response({"err": str(e), "status": "failed"}, 400)


@social_api.route("/friend/<userID>", methods=["GET"])
@cross_origin(supports_credentials=True)
def getAllFriends(userID):
    try:
        response = FriendsHelper(userID)
        friends = response["friendList"]
        result = []

        for friendID in friends:
            entry = db.Profiles.find_one({"userID": friendID})
            if entry != None:
                result.append(entry)

        return make_response(
            {
                "data": json.dumps(result, default=lambda o: str(o)),
                "status": "success"
            },
            200)

    except Exception as e:
        return make_response({"err": str(e), "status": "failed"}, 400)


# Unused route
# TODO verb here think of what might be better
@social_api.route("/friend/check", methods=["GET"])
@cross_origin(supports_credentials=True)
def checkFriend():
    userOne = request.args.get('userIDOne')
    userTwo = request.args.get('userIDTwo')

    query = {
        "$or": [{
            "userIDOne": userOne,
            "userIDTwo": userTwo
        },
            {
            "userIDOne": userTwo,
            "userIDTwo": userOne
        }]
    }

    result = db.Friends.find_one(query)

    if(result != None):
        response = {
            "message": "friendship exists",
            "status": "success"
        }
        return make_response(response, 200)
    else:
        response = {
            "message": "friendship doesnt exist",
            "status": "success"
        }
        return make_response(response, 200)


@social_api.route("/search", methods=["GET"])
@cross_origin(supports_credentials=True)
def search():
    # a function to search all events, facilities and profiles
    try:
        term = str(request.args.get('term'))
        regex = {
            '$regex': '^.*[-!$%^&*()_+|~=`\[\]:";<>?,.\'\/]*(?i){}[-!$%^&*()_+|~=`\[\]:";<>?,.\'\/]*.*$'.format(term)}

        # should have done this earlier
        profiles = db.Profiles.find({"displayName": regex}, {'_id': False})
        events = db.Events.find({"eventName": regex}, {'_id': False})
        facilities = db.Facilities.find(
            {"facilityName": regex}, {'_id': False})

        response = {
            "profiles": list(profiles),
            "events": list(events),
            "facilities": list(facilities),
            "status": "success"
        }

        return make_response(response, 200)

    except Exception as e:
        response = {
            "err": e,
            "status": "failed"
        }
        return make_response(response, 400)


# Unused route
@social_api.route("/image/<string:imageName>", methods=['GET', 'PUT', 'DELETE', 'POST'])
@cross_origin(supports_credentials=True)
def images(imageName):
    try:
        if request.method == "GET":
            # get last 5 most recent
            response = db.Images.find({'imageName': imageName})
            return make_response(json.dumps(response, default=lambda o: str(o)), 200)

        elif request.method == "POST":
            data = request.get_json()
            imageUrl = str(data.get('imageUrl'))
            imageName = str(data.get('imageName'))

            body = {
                "imageName": imageName,
                "imageUrl": imageUrl,
            }

            receipt = db.Images.insert_one(body)
            body["_id"] = str(receipt.inserted_id)

            return make_response({"message": body, "status": "success"}, 200)

        elif request.method == "PUT":
            data = request.get_json()
            imageUrl = str(data.get('imageUrl'))
            imageName = str(data.get('imageName'))

            body = {
                "imageName": imageName,
                "imageUrl": imageUrl,
            }

            db.Images.update_one({"imageName": imageName}, {
                '$set': body}, upsert=True)

            return make_response({'message': "Event changed", "status": "success"}, 200)

        elif request.method == "DELETE":
            imageName = request.args.get('imageName')
            db.Images.delete_one({"imageName": imageName})
            return make_response(
                {
                    "message": "deleted sucessfully",
                    "status": "success"
                },
                200)

    except Exception as e:
        print(e)
        return make_response({"err": str(e), "status": "failed"}, 400)


# https://stackoverflow.com/questions/54750273/pymongo-and-ttl-wrong-expiration-time
db.Session.create_index("createdAt", expireAfterSeconds=1210000)

"""
Register route:
Within POST request, obtain userID, password and email and add to User table in Mongo, if userID has not been registered previously
If successful return 200, else return 500
"""


@social_api.route('/auth/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    try:
        # extract userID, password and email
        formData = request.get_json()
        userID = formData["userID"]
        passwordHash = formData["passwordHash"]
        email = formData["email"]
        position = []
        displayName = formData["displayName"]
        bio = formData["bio"]
        block = formData["block"]
        telegramHandle = formData["telegramHandle"]
        modules = []

        if list(db.User.find({'userID': userID, 'passwordHash': passwordHash})):  # entry exists
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
                                "profilePictureUrl": "",
                                "modules": modules
                                })
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error was encountered.'}), 500
    return jsonify({'message': 'User successfully created!'}), 200


"""
Login route:
Within POST request, verify userID and passwordHash are valid.
If true, create session, return JWT to client, else return 500.
"""


@social_api.route('/auth/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    req = request.get_json()
    userID = req['userID']
    passwordHash = req['passwordHash']
    # authenticate the credentials

    if not list(db.User.find({'userID': userID, 'passwordHash': passwordHash})):
        return jsonify({'message': 'Invalid credentials'}), 403

    creationDate = datetime.now()
    db.Session.update_one({'userID': userID, 'passwordHash': passwordHash}, {'$set': {
        'userID': userID, 'passwordHash': passwordHash, 'createdAt': creationDate}}, upsert=True)
    # Not sure if this still works, need to check (the .app)
    token = jwt.encode({'userID': userID,
                        'passwordHash': passwordHash
                        }, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({'token': token}), 200


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
                token, app.config['SECRET_KEY'], algorithms=["HS256"])
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
        if datetime.now() > oldTime + timedelta(weeks=2):
            return jsonify({'message': 'Token has expired'}), 403
        else:
            # recreate session (with createdAt updated to now)
            db.Session.update_one({'userID': data['userID'], 'passwordHash': data['passwordHash']}, {
                '$set': {'createdAt': datetime.now()}}, upsert=True)

        return func(currentUser, *args, **kwargs)

    return decorated


"""
Protected route:
Acts as gatekeeper; can only access requested resource if you are authenticated ie valid session
Successful authentication will return the 200 status code below. Any other errors will be as reflected in the wrapper function.
"""


@social_api.route('/auth/protected', methods=['GET'])
@cross_origin(supports_credentials=True)
@check_for_token
def protected(currentUser):
    return jsonify({'message': 'Successfully logged in. Redirecting.'}), 200


"""
Logout route:
Delete the session entry
"""


# Unused route
@social_api.route('/auth/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    userID = request.args.get('userID')
    try:
        db.Session.remove({"userID": userID})
    except:
        return jsonify({'message': 'An error occurred'}), 500
    return jsonify({'message': 'You have been successfully logged out'}), 200
