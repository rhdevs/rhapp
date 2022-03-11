from db import *
from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS, cross_origin
from pymongo import *
import json
import os
import time
import jwt
import sys
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson.errors import *
from flask import Blueprint
import sys
from AuthFunction import authenticate
sys.path.append("../db")

social_api = Blueprint("social", __name__)

# When put/delete, run find first to make sure element is present


def renamePost(post):
    post['postID'] = str(post.pop('_id'))
    return post


@social_api.route("/")
@cross_origin(supports_credentials=True)
def hello():
    return "Welcome the Raffles Hall Social server"


@social_api.route('/profiles', methods=['PUT'])
@cross_origin(supports_credentials=True)
def profiles():
    try:
        data = request.get_json()

        # BUG 570 Fix: Added authentication to check token before updating profile
        if (not request.args.get("token")):
            return {"err": "No token", "status": "failed"}, 401

        if (not authenticate(request.args.get("token"), data.get("userID"))):
            return {"err": "Auth Failure", "status": "failed"}, 401

        if "profilePictureURI" in data:
            data["profilePictureUrl"] = data.pop("profilePictureURI")

        if not data.get("userID"):
            return {"status":" failed", "message": "Invalid request"}, 400

        if db.User.count_documents({"userID": data["userID"]}) == 0:
            return {"status":" failed", "message": "User not found"}, 404

        result = db.User.update_one(
            {"userID": data["userID"]}, {'$set': data}, upsert=True)


        if int(result.matched_count) > 0:
            response = {
                "status": "success",
                "message": "Profile changed"
            }
            return make_response(response, 200)
        else:
            response = {
                "status": "failed",
            }
            return make_response(response, 404)
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


@social_api.route("/profile")
@cross_origin(supports_credentials=True)
def users():
    userIdList = request.args.getlist('userID')
    try:
        data = list(db.User.find({"userID": {'$in': userIdList}}, {"_id": 0, "passwordHash": 0}))
        response = {
                 "data": data,
                 "status": "success"
             }
        print(userIdList)
        if len(userIdList) == 1 and userIdList[0] == "":
            return make_response({"err": "userID is not specified", "status": "failed"}), 400 # throws error if userID is not specified in argument
        elif len(data) == 0:
            return make_response({"err": "User does not exist", "status": "failed"}), 404 # throws error if all userID entries in argument do not exist 
        else:
            return make_response(response, 200)
    except Exception as e:
        print(e)
        return {"err": "An error has occurred", "status": "failed"}, 500

@social_api.route("/profile/<string:userID>")
@cross_origin(supports_credentials=True)
def getUserProfile(userID):
    try:
        if (not userID):
            return {"err": "Invalid request"}, 400
        data = list(db.User.find({"userID": userID}, {"_id": 0, "passwordHash": 0}))
        response = {
            "data": data,
            "status": "success"
        }

        if len(data) == 0:
            return make_response({"err": "User does not exist", "status":"failed"}), 404
        else:
            return make_response(response, 200)
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    
        

@social_api.route("/user", methods=['PUT', 'POST'])
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
                {"userID": userID}, {'$set': body})

            if int(result.matched_count) > 0:
                response = {
                    "message": "Profile changed",
                    "status": "success"
                }
                return make_response(response, 200)
            else:
                response = {
                    "err": "User does not exist",
                    "status": "failed"
                }
                return make_response(response, 404)

        elif request.method == 'POST':
            data = request.get_json()
            userID = data.get('userID')
            passwordHash = data.get('passwordHash')
            email = data.get('email')

            if (userID is None or passwordHash is None or email is None):
                return {"status": "failed", "message": "Invalid request"}, 400

            if db.User.count_documents({"userID": userID}) > 0:
                return {"status": "failed", "message": "Account already exist"}, 409

            body = {
                "userID": userID,
                "passwordHash": passwordHash,
                "email": email,
            }
            db.User.insert_one(body)

            return make_response({"message": body, "status": "success"}, 200)

    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


@social_api.route("/user/<userID>", methods=["GET"])
@cross_origin(supports_credentials=True)
def getUserDetails(userID):
    try:
        pipeline = [
            {'$match': {
                'userID': userID
            }
            },
            {'$lookup': {
                'from': 'User',
                        'localField': 'userID',
                        'foreignField': 'userID',
                        'as': 'profile'
            }
            },
            {
                '$replaceRoot': {'newRoot': {'$mergeObjects': [{'$arrayElemAt': ["$profile", 0]}, "$$ROOT"]}}
            },
            {'$project': {'profile': 0, "_id": 0}},
            {'$lookup': {
                'from': 'CCA',
                        'localField': 'position',
                        'foreignField': 'ccaID',
                        'as': 'positions'
            }
            },
            {'$project': {'positions.category': 0, 'positions._id': 0, 'position': 0, 'passwordHash': 0}}
        ]

        data = list(db.User.aggregate(pipeline))

        return make_response(
            {
                "data": data,
                "status": "success"
            }, 200)

    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


def userIDtoName(userID):
    # TODO use mongoDB lookup instead of this disgusting code
    # helper function
    profile = db.User.find_one({"userID": userID}, {'displayName': 1})
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
                    try:
                        ObjectId(postID)
                    except TypeError:
                        return make_response({"message": "Invalid Post ID", "status": "failed"}, 400)

                    data = db.Posts.find_one({"_id": ObjectId(postID)})
                    name = db.User.find_one(
                        {"userID": str(data.get("userID"))}, {'passwordHash': 0, "_id": 0}).get('displayName')

                    if data != None:
                        data = renamePost(data)
                        data['name'] = name
                        response = {
                            "status": "success",
                            "data": data
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
                            "data": response,
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

                data = list(db.Posts.find(
                    {}, sort=[('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5))

                # Pipeline is good, but OUR ATLAS FREE TIER DOES NOT ALLOW SORTING, SKIPPING AND LIMITING IN PIPELINE

                # pipeline = [
                #     {'sort': {'createdAt': -1}},
                #     {'skip': N*5},
                #     {'limit': 5},
                #     {
                #         '$lookup': {
                #             'from': 'User',
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
                #     {'$project': {'profile': 0} }
                # ]

                # data = db.Posts.aggregate(pipeline)

                response = []

                userIDList = [x["userID"] for x in data]
                profiles = list(db.User.find({"userID": {"$in": userIDList}}, {'passwordHash': 0}))
                profileDict = {}
                for x in profiles:
                    profileDict[x["userID"]] = x

                # for item in data:
                #     response.append(item)
                for item in data:
                    profile = profileDict.get(item["userID"])
                    item['name'] = profile.get(
                        'displayName') if profile != None else None
                    item['profilePictureURI'] = profile.get(
                        'profilePictureUrl') if profile != None else None
                    item = renamePost(item)
                    response.append(item)

                return make_response(
                    {
                        "data": response,
                        "status": "success"
                    }, 200)

        elif request.method == 'DELETE':
            try:
                postID = request.args.get('postID')
                if db.Posts.count_documents({"_id": ObjectId(postID)}) == 0:
                    response = {
                        "status": "failed",
                        "message": "The post you are trying to delete does not exist."
                    }
                    return make_response(response, 404)
                else:
                    db.Posts.delete_one({"_id": ObjectId(postID)})
                    response = {
                        "status": "success",
                        "message": "Post deleted successfully"
                    }
                    return make_response(response, 200)
            except InvalidId as e:
                return make_response({"status": "failed", "message": "Invalid postID"}), 400

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

            if (not userID or userID == ""):
                return {"status":" failed", "message": "Invalid request"}, 400

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
            if (data.get('postID') is None):
                return {"status":" failed", "message": "Invalid request"}, 400

            try:
                ObjectId(postID)
            except (InvalidId):
                return {"status":" failed", "message": "Invalid request"}, 400

            if db.Posts.count_documents({"_id": ObjectId(postID)}) == 0:
                return make_response({"status":" failed", "message": "Post does not exist"}, 404)

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
                return make_response({'message': "Post changed", "status": "success"}, 200)
            else:
                return Response(status=200)
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


@social_api.route("/posts/<userID>", methods=['GET'])
@cross_origin(supports_credentials=True)
def getPostById(userID):
    try:
        N = int(request.args.get('N')) if request.args.get('N') else 0

        data = list(db.Posts.find({"userID": str(userID)}, sort=[
                             ('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5))
        for i in data:
            renamePost(i)
            
        response = {
            "status": "success",
            "data": data
        }
        
        if db.User.find_one({"userID": userID}) == None:
            return make_response({"status": "failed", "message": "User does not exist"}), 404 
        else:
            return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"err": "An error has occured", "status": "failed"}), 500


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
            profile = db.User.find_one({'userID': item.get('userID')}, {'passwordHash': 0, '_id': 0})
            item['profilePictureURI'] = profile.get(
                'profilePictureUrl') if profile != None else None
            item['ccaName'] = db.CCA.find_one({'ccaID': ccaID}).get(
                'ccaName') if ccaID != -1 else None
            response.append(item)
            item['postID'] = str(item.get('_id'))
            del item['_id']

        print(response)
        return make_response(
            {
                "data": response,
                "status": "success"
            },
            200)
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


@social_api.route('/cca/<int:ccaID>', methods=["GET"])
@cross_origin()
def getCCADetails(ccaID):
    try:
        data = list(db.CCA.find({"ccaID": ccaID}, {'_id': 0}))
        response = {"status": "success", "data": data}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)


@social_api.route("/user_CCA/<string:userID>", methods=['GET'])
@cross_origin()
def getUserCCAs(userID):
    try:
        CCAofUserID = db.UserCCA.find({"userID": userID})
        entries = [w["ccaID"] for w in CCAofUserID]
        data = list(db.CCA.find({"ccaID": {"$in": entries}}, {"_id": 0}))
        response = {"status": "success", "data": data}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response, 200)

@social_api.route("/user_CCA", methods=['POST', 'DELETE'])
@cross_origin()
def editUserCCA():
    try:
        data = request.get_json()
        ccaID = data.get('ccaID')
        userID = data.get('userID')

        if request.method == "POST":
            db.UserCCA.delete_many({"userID": userID})
            if len(ccaID) > 0:
                documents = [{"userID": userID, "ccaID": cca} for cca in ccaID]
                upserts = [pymongo.UpdateOne(
                    doc, {'$setOnInsert': doc}, upsert=True) for doc in documents]
                db.UserCCA.bulk_write(upserts)

        elif request.method == "DELETE":
            db.UserCCA.delete_many(body)

    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return {"status": "success"}, 200


@social_api.route("/user_CCA/", methods=["GET"])
@cross_origin()
def getCCAMembersName():
    try:
        ccaName = str(request.args.get('ccaName'))
        response = db.UserCCA.find({"ccaName": ccaName})
        response = {"status": "success", "data": list(response)}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)
