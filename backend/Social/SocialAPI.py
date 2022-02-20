from email.errors import InvalidBase64CharactersDefect
from http.client import InvalidURL
from db import *
from S3.app import *
from datauri import DataURI
import binascii
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


#@social_api.route('/profiles', methods=['GET', 'PUT'])
@social_api.route('/profiles', methods=['PUT'])
@cross_origin(supports_credentials=True)
def profiles():
    try:
        '''
        if request.method == 'GET':
            data = db.Profiles.find()
            response = {
                "status": "success",
                "data": json.dumps(list(data), default=lambda o: str(o))
            }
            return make_response(response, 200)
        '''
        if request.method == 'PUT':
            data = request.get_json()
            userID = data["userID"] # get userID from JSON request

            def imgGeneration(imgString):

                def isURI(imgString):
                    if imgString[:5] == "data:":
                        return True
                    else:
                        return False

                def isJPEG(imgString):
                    if imgString[:4] == "/9j/":
                        return True
                    else:
                        return False

                def isPNG(imgString):
                    if imgString[:6] == "iVBORw":
                        return True
                    else:
                        return False

                def isGIF(imgString):
                    if imgString[:6] == "R0lGOD":
                        return True
                    else:
                        return False

                def isWEBP(imgString):
                    if imgString[0] == "U":
                        return True
                    else:
                        return False

                def isTIFF(imgString):
                    if imgString[:4] == "SUkq":
                        return True
                    else:
                        return False

                if isURI(imgString) == True:           
                    imgType = DataURI(imgString).mimetype # get FILE_FORMAT from mimetype of image URI
                    imgBinary = DataURI(imgString).data
                    imgFileName = "profile_pic." + str(imgType)[str(imgType).find("/")+1:] # name image to be generated as "profile_pic.<FILE_FORMAT>"
                    imgKey = str(userID) + "/profile_pic." + str(imgType)[str(imgType).find("/")+1:] # image key for the generated image file
                    imgFileLocation = str(os.getcwd()) + "/profile_pic." + str(imgType)[str(imgType).find("/")+1:] # path/location of the generated image file (image is generated in the working directory of the local machine where the main API code is run)
                    if os.path.exists(imgFileName) == True: # check if there is another image file with the same name as the one to be generated
                        os.remove(imgFileName) # delete the existing file
                        fd = open(imgFileName, 'wb')
                        fd.write(imgBinary)
                        fd.close()  
                    else: # if file with same name does not exist
                        fd = open(imgFileName, 'wb')
                        fd.write(imgBinary)
                        fd.close()
                    return imgKey, imgFileLocation
                else:
                    imgBinary = binascii.a2b_base64(imgString)
                    if isJPEG(imgString) == True:
                        imgKey = str(userID) + "/profile_pic.jpeg"
                        imgFileLocation = str(os.getcwd()) + "/profile_pic.jpeg"
                        if os.path.exists('profile_pic.jpeg') == True:
                            os.remove('profile_pic.jpeg')
                            fd = open('profile_pic.jpeg', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        else:
                            fd = open('profile_pic.jpeg', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        return imgKey, imgFileLocation
                    elif isPNG(imgString) == True: 
                        imgKey = str(userID) + "/profile_pic.png"
                        imgFileLocation = str(os.getcwd()) + "/profile_pic.png"
                        if os.path.exists('profile_pic.png') == True:
                            os.remove('profile_pic.png')
                            fd = open('profile_pic.png', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        else:
                            fd = open('profile_pic.png', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        return imgKey, imgFileLocation
                    elif isGIF(imgString) == True: 
                        imgKey = str(userID) + "/profile_pic.gif"
                        imgFileLocation = str(os.getcwd()) + "/profile_pic.gif"
                        if os.path.exists('profile_pic.gif') == True:
                            os.remove('profile_pic.gif')
                            fd = open('profile_pic.gif', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        else:
                            fd = open('profile_pic.gif', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        return imgKey, imgFileLocation
                    elif isWEBP(imgString) == True: 
                        imgKey = str(userID) + "/profile_pic.webp"
                        imgFileLocation = str(os.getcwd()) + "/profile_pic.webp"
                        if os.path.exists('profile_pic.webp') == True:
                            os.remove('profile_pic.webp')
                            fd = open('profile_pic.webp', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        else:
                            fd = open('profile_pic.webp', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        return imgKey, imgFileLocation
                    elif isTIFF(imgString) == True: 
                        imgKey = str(userID) + "/profile_pic.tiff"
                        imgFileLocation = str(os.getcwd()) + "/profile_pic.tiff"
                        if os.path.exists('profile_pic.tiff') == True:
                            os.remove('profile_pic.tiff')
                            fd = open('profile_pic.tiff', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        else:
                            fd = open('profile_pic.tiff', 'wb')
                            fd.write(imgBinary)
                            fd.close()
                        return imgKey, imgFileLocation
                    else:
                        raise TypeError

            if not data.get("profilePictureUrl"):
                data["profilePictureUrl"] = ""
            else:
                data["profilePictureUrl"] = data["profilePictureUrl"]

            imgString = str(data["profilePictureUrl"]) # get image URI/base64 from JSON request
                    
            if imgString != "":
                imgKey, imgFileLocation = imgGeneration(str(imgString))
                oldImgKey = db.Profiles.find_one({"userID": userID}).get("imageKey")
                if None != oldImgKey != imgKey:
                    delete(oldImgKey)
                    create(imgKey, imgFileLocation)
                else:
                    create(imgKey, imgFileLocation)
            else:
                imgKey = "default/profile_pic.png" # profilePictureUrl not given, default profile pic will be loaded            
            
            del data["profilePictureUrl"]
            data["imageKey"] = imgKey
            result = db.Profiles.update_one({"userID": userID}, {'$set': data}, upsert=True)
            if int(result.matched_count) > 0:
                response = {
                    "status": "success",
                    "message": "Profile uploaded"
                }
                return make_response(response, 200)
            else:
                response = {
                    "status": "failed",
                }
                return make_response(response, 204)
            
    except TypeError and binascii.Error:
        return {"err": "Invalid data", "status": "failed"}, 400
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


@social_api.route("/profile")
@cross_origin(supports_credentials=True)
def users():
    userIdList = request.args.getlist('userID')
    body = []
    try:         
        data = db.Profiles.find({"userID": {'$in': userIdList}}, {"_id": 0})
        profileDict = {}
        for profile in data:
            profileDict[profile["userID"]] = profile 
        for profile in profileDict.values():
            imageKey = profile.get('imageKey') if profile != None else None
            if imageKey != None:
                imageKey = imageKey
            elif FileNotFoundError:
                imageKey = "default/profile_pic.png"
            profile['profilePicSignedUrl'] = read(imageKey)
            body.append(profile)
        
        response = {
                 "data": json.dumps(body, default=lambda o: str(o)),
                 "status": "success"
         }
        if len(userIdList) == 1 and userIdList[0] == "":
            return make_response({"err": " No userID specified", "status": "failed"}), 400 # throws error if userID is not specified in argument
        elif db.Profiles.count_documents({"userID": {'$in': userIdList}}) == 0:
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
        data = db.Profiles.find({"userID": userID}, {"_id": 0})
        body = []
        profileDict = {}
        for profile in data:
            profileDict[profile["userID"]] = profile
        for profile in profileDict.values():
            imageKey = profile.get('imageKey') if profile != None else None
            if imageKey != None:
                imageKey = imageKey
            elif FileNotFoundError:
                imageKey = "default/profile_pic.png"
            profile['profilePicSignedUrl'] = read(imageKey)
            body.append(profile)
        
        response = {
            "data": json.dumps(body, default=lambda o: str(o)),
            "status": "success"
        }
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    if db.Profiles.count_documents({"userID": userID}) == 0:
        return make_response({"err": "User does not exist", "status":"failed"}), 404
    else:
        return make_response(response, 200)
        

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
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


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
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


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
                    imageKey = db.Profiles.find_one(
                        {"userID": str(data.get("userID"))}).get('imageKey')
                    if imageKey != None:
                        imageKey = imageKey
                    elif FileNotFoundError:
                        imageKey = "default/profile_pic.png"
                    profilePicSignedUrl = read(imageKey)

                    if data != None:
                        data = renamePost(data)
                        data['name'] = name
                        data['profilePicSignedUrl'] = profilePicSignedUrl
                        response = {
                            "status": "success",
                            "data": json.dumps(data, default=lambda o: str(o))
                        }
                        return make_response(response, 200)
                    else:
                        return make_response({"message": "No Data Found", "status": "failed"}, 404)

                elif userID:
                    data = db.Posts.find({"userID": str(userID)})
                    imageKey = db.Profiles.find_one({"userID": userID}).get('imageKey')
                    if imageKey != None:
                        imageKey = imageKey
                    elif FileNotFoundError:
                        imageKey = "default/profile_pic.png"
                    profilePicSignedUrl = read(imageKey)
                    response = []
                    for item in data:
                        item['name'] = userIDtoName(item.get('userID'))
                        item['profilePicSignedUrl'] = profilePicSignedUrl                 
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

                data = list(db.Posts.find(
                    {}, sort=[('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5))

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
                #             'imageKey': "$profile.imageKey",
                #             'name': '$profile.displayName'
                #         }
                #     },
                #     {'$project': {'profile': 0}}
                # ]

                # data = db.Posts.aggregate(pipeline)

                response = []

                userIDList = [post["userID"] for post in data]
                profiles = list(db.Profiles.find({"userID": {"$in": userIDList}}, {"_id": 0}))
                profileDict = {}
                for profile in profiles:
                    profileDict[profile["userID"]] = profile

                # for item in data:
                #     response.append(item)
                for item in data:
                    profile = profileDict.get(item["userID"])
                    imageKey = profile.get('imageKey') if profile != None else None
                    item['name'] = profile.get(
                        'displayName') if profile != None else None
                    if imageKey != None:
                        imageKey = imageKey
                    elif FileNotFoundError:
                        imageKey = "default/profile_pic.png"
                    item['profilePicSignedUrl'] = read(imageKey)
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
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500


@social_api.route("/posts/<userID>", methods=['GET'])
@cross_origin(supports_credentials=True)
def getPostById(userID):
    try:
        N = int(request.args.get('N')) if request.args.get('N') else 0

        body = []

        data = db.Posts.find({"userID": str(userID)}, sort=[
                             ('createdAt', pymongo.DESCENDING)]).skip(N*5).limit(5)
        
        for item in data:
            item['name'] = userIDtoName(item.get('userID'))
            imageKey = db.Profiles.find_one({"userID": userID}).get('imageKey')
            if imageKey != None:
                imageKey = imageKey
            elif FileNotFoundError:
                imageKey = "default/profile_pic.png"
            profilePicSignedUrl = read(imageKey)
            item['profilePicSignedUrl'] = profilePicSignedUrl
            
            item = renamePost(item)
            body.append(item)
        response = {
            "status": "success",
            "data": json.dumps(body, default=lambda o: str(o))
        }
        
        if db.Profiles.find_one({"userID": userID}) == None:
            return make_response({"status": "failed", "message": "User does not exist"}), 404 
        else:
            return make_response(response, 200)
    except TypeError as e:
        print(e)
        return make_response({"status": "failed", "message": "Expected a string input"}), 400
    except Exception as e:
        print(e)
        return make_response({"err": "An error has occured", "status": "failed"}), 500

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
            imageKey = db.Profiles.find_one({"userID": userID}).get('imageKey')
            if imageKey != None:
                imageKey = imageKey
            elif FileNotFoundError:
                imageKey = "default/profile_pic.png"
            profilePicSignedUrl = read(imageKey)
            
            item['profilePicSignedUrl'] = profilePicSignedUrl

            
            item = renamePost(item)
            response.append(item)
        
        if userID == "":
            return make_response({"status": "failed", "message": "No userID specified"}), 400
        else:
            return make_response(
                {
                    "data": json.dumps(response, default=lambda o: str(o)),
                    "status": "success"
                },
                200)
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500



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
            imageKey = profile.get('imageKey')
            if imageKey != None:
                imageKey = imageKey
            elif FileNotFoundError:
                imageKey = "default/profile_pic.png"
            profilePicSignedUrl = read(imageKey)
            item['profilePicSignedUrl'] = profilePicSignedUrl
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
        return {"err": "An error has occured", "status": "failed"}, 500


'''
Friends API 
'''

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
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
