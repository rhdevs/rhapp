from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS, cross_origin
import pymongo
import json
import os
import time
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins" : "*"}})
# resources allowed to be accessed explicitly 
# response.headers.add("Access-Control-Allow-Origin", "*"), add this to all responses
# if the cors still now working
app.config['CORS_HEADERS'] = 'Content-Type'

DB_USERNAME = os.getenv('DB_USERNAME')
DB_PWD = os.getenv('DB_PWD')
# URL = "mongodb+srv://rhdevs-db-admin:{}@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority".format(DB_PWD)

# client = pymongo.MongoClient(URL)
client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = client["RHApp"]


@app.route("/")
@cross_origin()
def hello():
    return "Welcome the Raffles Hall Social server"


@app.route('/user/all')
@cross_origin()
def getAllUsers():
    try:
        data = db.User.find()
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400


@app.route("/user/<userID>")
@cross_origin()
def getUser(userID):
    try:
        data = db.User.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user", methods=['DELETE', 'POST'])
@cross_origin()
def addDeleteUser():
    try:
        if request.method == "POST":
            data = request.get_json()
            userID = str(data.get('userID'))
            passwordHash = str(data.get('passwordHash'))
            email = str(data.get('email'))

            body = {
                "userID": userID,
                "passwordHash": passwordHash,
                "email": email,
            }
            receipt = db.User.insert_one(body)
            body["_id"] = str(receipt.inserted_id)

            return {"message": body}, 200

        elif request.method == "DELETE":
            userID = request.args.get('userID')
            db.User.delete_one({"userID": userID})
            return Response(status=200)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400


@app.route("/user/edit", methods=['PUT'])
@cross_origin()
def editUser():
    try:
        data = request.get_json()
        userID = str(data.get('userID'))
        passwordHash = str(data.get('passwordHash'))
        email = str(data.get('email'))

        body = {
            "userID": userID,
            "passwordHash": passwordHash,
            "email": email,
        }

        result = db.User.update_one({"userID": userID}, {'$set': body})
        if int(result.matched_count) > 0:
            return {'message': "Event changed"}, 200
        else:
            return Response(status=204)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return {'message': "Event changed"}, 200


@app.route("/profile/<userID>")
@cross_origin()
def getUserProfile(userID):
    try:
        data = db.Profiles.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/profile", methods=['DELETE', 'POST'])
@cross_origin()
def addDeleteProfile():
    try:
        if request.method == "POST":
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
            receipt = db.Profiles.insert_one(body)
            db.UserCCA.insert_many(
                [{
                    "userID": userID,
                    "ccaID": 80 + block,
                    "ccaName": "Block " + str(block)
                },
                    {
                    "userID": userID,
                    "ccaID": 89,
                    "ccaName": "Raffles Hall"
                }])

            body["_id"] = str(receipt.inserted_id)

            return {"message": body}, 200

        elif request.method == "DELETE":
            userID = request.args.get('userID')
            db.Profiles.delete_one({"userID": userID})
            return Response(status=200)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400


@app.route("/profile/edit/", methods=['PUT'])
@cross_origin()
def editProfile():
    try:
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

        result = db.Profiles.update_one({"userID": userID}, {'$set': body})

        if int(result.matched_count) > 0:
            return {'message': "Event changed"}, 200
        else:
            return Response(status=204)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return {'message': "Event changed"}, 200


@app.route("/user/details/<userID>")
@cross_origin()
def getUserDetails(userID):
    try:
        data1 = db.User.find_one({"userID": userID})
        data2 = db.Profiles.find_one({"userID": userID})
        data1.update(data2)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    
    return json.dumps(data1, default=lambda o: str(o)), 200


@app.route("/post", methods=['GET', 'DELETE', 'POST'])
@cross_origin()
def addDeletePost():
    try:
        if request.method == "GET":
            # get last 5 most recent
            data = db.Posts.find()
            
            response = []
            for item in data :
                #add name into the every data using display name
                name = db.Profiles.find_one({"userID" : item.get('userID')}).get('displayName')
                item['name'] = name
                response.append(item)
                
            return json.dumps(response, default=lambda o: str(o)), 200
        
        elif request.method == "POST":
            data = request.get_json()
            userID = str(data.get('userID'))
            title = str(data.get('title'))
            description = str(data.get('description'))
            ccaID = int(data.get('ccaID')) if data.get('ccaID') else -1
            createdAt = int(datetime.now().timestamp())
            postPics = data.get('postPics') if data.get('postPics') else []
            isOfficial = bool(data.get('isOfficial'))
            lastPostID = db.Posts.find_one(
                sort=[('postID', pymongo.DESCENDING)])
            newPostID = 1 if lastPostID is None else int(
                lastPostID.get("postID")) + 1

            body = {
                "postID": newPostID,
                "userID": userID,
                "title": title,
                "description": description,
                "ccaID": ccaID,
                "createdAt": createdAt,
                "postPics": postPics,
                "isOfficial": isOfficial
            }
            
            receipt = db.Posts.insert_one(body)
            body["_id"] = str(receipt.inserted_id)

            return {"message": body}, 200

        elif request.method == "DELETE":
            postID = request.args.get('postID')
            db.Posts.delete_one({"postID": postID})
            return Response(status=200)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

@app.route("/post/search", methods = ['GET'])
@cross_origin()
def getPostSpecific():
    try : 
        userID = request.args.get("userID")
        postID = request.args.get("postID")
        
        if postID : 
            data = db.Posts.find_one({"postID": int(postID)})
            name = db.User.find_one({"userID" : str(data.get("userID"))})
            
            if data != None :
              del data['_id'] # this causes error without str conversion
              data['name'] = name
              return make_response(data, 200)
            else :
              return make_response("No Data Found", 404)
          
        elif userID : 
            data = db.Posts.find({"userID": str(userID)})
            response = []
            for item in data :
                name = db.Profiles.find_one({"userID" : item.get('userID')}).get('displayName')
                item['name'] = name
                response.append(item)
            
            return json.dumps(response, default=lambda o: str(o)), 200
        
    except Exception as e:
        return {"err": str(e)}, 400

@app.route("/post/last/<int:last>", methods=['GET'])
@cross_origin()
def getLastN(last):
    #get all post regardless whether its official or not 
    try:
        data = db.Posts.find(
            sort=[('createdAt', pymongo.DESCENDING)]).limit(last)
        
        response = []
        for item in data : 
            name = db.Profiles.find_one({"userID" : item.get('userID')}).get('displayName')
            item['name'] = name
            response.append(item)
            
        return json.dumps(response, default=lambda o: str(o)), 200
    
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    
@app.route("/post/<userID>", methods=['GET'])
@cross_origin()
def getPostById(userID):
    try:
        data = db.Posts.find({"userID": str(userID)})
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400


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


@app.route("/post/friend", methods=['GET'])
@cross_origin()
def getFriendsPostById():
    try:
        userID = str(request.args.get("userID"))
        N = int(request.args.get("N"))

        friends = FriendsHelper(userID).get('friendList')

        query = {
            "userID": {"$in": friends}
        }

        response = []
        
        result = db.Posts.find(
            query, sort=[('createdAt', pymongo.DESCENDING)]).limit(N)

        for item in result :
            name = db.Profiles.find_one({"userID" : item.get('userID')})
            item['name'] = name
            response.append(item)
            
        return make_response(json.dumps(response, default=lambda o: str(o)), 200)

    except Exception as e:
        return {"err": str(e)}, 400


@app.route("/post/official", methods=['GET'])
@cross_origin()
def getOfficialPosts():
    try:
        N = int(request.args.get('N')) if request.args.get('N') else 10
        
        response = []
        data = db.Posts.find({"isOfficial": True}, 
                             sort=[('createdAt', pymongo.DESCENDING)]).limit(N)
        
        for item in data : 
            name = db.Profiles.find_one({"userID" : item.get('userID')}).get('displayName')
            
            ccaID = int(item.get('ccaID'))            
            item['ccaName'] = db.CCA.find_one({'ccaID' : ccaID}).get('ccaName') if ccaID != -1 else None
            item['name'] = name
            response.append(item)
            
        return json.dumps(response, default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400


@app.route("/post/edit/", methods=['PUT'])
@cross_origin()
def editPost():
    try:
        data = request.get_json()
        postID = data.get('postID')
        oldPost = db.Posts.find_one({"postID": int(postID)})
        
        if oldPost == None:
            return make_response("data non existent", 404)
        
        userID = str(data.get('userID')) if data.get('userID') else oldPost.get('userID')
        title = str(data.get('title')) if data.get('title') else oldPost.get('title')
        description = str(data.get('description')) if data.get('description') else oldPost.get('description')
        ccaID = int(data.get('ccaID')) if data.get('ccaID') else oldPost.get('ccaID')
        postPics = data.get('description') if data.get('description') else oldPost.get('description')
        isOfficial = data.get('isOfficial') if data.get('isOfficial') else oldPost.get('isOfficial')

        body = {
            "userID": userID,
            "title": title,
            "description": description,
            "ccaID": ccaID,
            "postPics": postPics,
            "isOfficial": isOfficial
        }

        result = db.Posts.update_one({"postID": int(postID)}, {'$set': body})
        if int(result.matched_count) > 0:
            return {'message': "Event changed"}, 200
        else:
            return Response(status=204)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return {'message': "Event changed"}, 200


'''
Friends API 
'''


@app.route("/friend", methods=['DELETE', 'POST'])
@cross_origin()
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

                return make_response({"Insert Succesful"}, 200)
            else:
                return make_response("Friendship exists", 400)

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

            return make_response("Delete Successful", 200)

    except Exception as e:
        return make_response({"err": str(e)}, 400)


@app.route("/friend/<userID>", methods=["GET"])
@cross_origin()
def getAllFriends(userID):
    try:
        response = FriendsHelper(userID)
        friends = response["friendList"]
        result = []

        for friendID in friends:
            entry = db.Profiles.find_one({"userID": friendID})
            if entry != None:
                result.append(entry)

        return make_response(json.dumps(result, default=lambda o: str(o)), 200)

    except Exception as e:
        return make_response({"err": str(e)}, 400)


@app.route("/friend/check", methods=["GET"])
@cross_origin()
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
            "status": True
        }
        return make_response(response, 200)
    else:
        response = {
            "message": "friendship doesnt exist",
            "status": False
        }
        return make_response(response, 200)


@app.route("/user_CCA/<userID>")
@cross_origin()
def getUserCCAs(userID):
    try:
        data = db.UserCCA.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


if __name__ == "__main__":
    app.run(threaded=True, debug=True)
    # app.run('0.0.0.0', port=8080)
