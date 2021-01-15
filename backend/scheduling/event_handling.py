
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import pymongo, json, os, time
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type';

DB_USERNAME = os.getenv('DB_USERNAME')
DB_PWD = os.getenv('DB_PWD')
# URL = "mongodb+srv://rhdevs-db-admin:{}@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority".format(DB_PWD)

# client = pymongo.MongoClient(URL)
client = pymongo.MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = client["RHApp"]

@app.route("/")
@cross_origin()
def hello():
  return "Welcome the Raffles Hall Events server" 


@app.route("/timetable/<userID>")
@cross_origin()
def getUserTimetable(userID):
    try:
        data = db.Lessons.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/user/all')
@cross_origin()
def getAllUsers():
    try:
        data = db.User.find()
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@app.route('/event/all')
@cross_origin()
def getAllEvents():
    try:
        data = db.Events.find()
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/private/all')
@cross_origin()
def getAllPrivateEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": True}})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/public/all')
@cross_origin()
def getAllPublicEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": False}})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/afterTime/<startTime>')
@cross_origin()
def getEventAfterTime(startTime):
    try:
        data = db.Events.find({"startDateTime": {"$gt": int(startTime)}})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/cca/all')
@cross_origin()
def getAllCCA():
    try:
        data = db.CCA.find()
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/<eventID>')
@cross_origin()
def getEventDetails(eventID):
    try:
        data = db.Events.find({"_id": eventID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/<int:ccaID>')
@cross_origin()
def getEventsCCA(ccaID):
    try:
        data = db.Events.find({"ccaID": ccaID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/cca/<int:ccaID>')
@cross_origin()
def getCCADetails(ccaID):
    try:
        data = db.CCA.find({"ccaID": ccaID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/<userID>")
@cross_origin()
def getUserCCAs(userID):
    try:
        data = db.UserCCA.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_event/<userID>")
@cross_origin()
def getUserAttendance(userID):
    try:
        data = db.Attendance.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_event/<eventID>")
@cross_origin()
def getEventAttendees(eventID):
    try:
        data = db.Attendance.find({"eventID": eventID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/<int:ccaID>")
@cross_origin()
def getCCAMembers(ccaID):
    try:
        data = db.UserCCA.find({"ccaID": ccaID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/add", methods=['POST'])
@cross_origin()
def addUserCCA(userID):
    try:
        data = request.get_json()
        userID = data.get('userID')
        ccaID = int(data.get('ccaID'))
        ccaName = data.get('ccaName')

        body = {
            "userID": userID,
            "ccaID": ccaID,
            "ccaName": ccaName,
        }

        receipt = db.UserCCA.insert_one(body)
        body["_id"] = str(receipt.inserted_id)

        return {"message": body}, 200

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@app.route("/permissions/<userID>")
@cross_origin()
def getUserPermissions(userID):
    try:
        data = db.UserPermissions.find({"recipient": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/permissions", methods=['DELETE', 'POST'])
@cross_origin()
def addDeletePermissions():
    try:
        userID1 = str(request.args.get('userID1'))
        userID2 = str(request.args.get('userID2'))
        if request.method == "POST":
            body = {
                "donor": userID1,
                "recipient": userID2
            }
            db.UserPermissions.insert_one(body)

        elif request.method == "DELETE":
            db.UserPermissions.delete_one({
                "donor": userID1,
                "recipient": userID2
            })
            return Response(status=200)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {"message": "Action successful"}, 200


@app.route("/event/add", methods=['POST'])
@cross_origin()
def createEvent():
    try:
        data = request.get_json()
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')
        isPrivate = data.get('isPrivate')

        body = {
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image,
            "isPrivate": isPrivate
        }

        receipt = db.Events.insert_one(body)
        body["_id"] = str(receipt.inserted_id)

        return {"message": body}, 200

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@app.route("/event/delete/<eventID>", methods=['DELETE'])
@cross_origin()
def deleteEvent(eventID):
    try:
        db.Events.delete_one({"_id": eventID})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {"message": "successful"}, 200


@app.route("/event/edit", methods=['PUT'])
@cross_origin()
def editEvent():
    try:
        data = request.get_json()
        eventID = data.get('eventID')
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')
        isPrivate = data.get('isPrivate')

        body = {
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image,
            "isPrivate": isPrivate
        }

        result = db.Events.update_one(
            {"_id": ObjectId(eventID)}, {'$set': body})
        if int(result.matched_count) > 0:
            return {'message': "Event changed"}, 200
        else:
            return Response(status=204)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Event changed"}, 200


@app.route("/user_event", methods=['POST'])
@cross_origin()
def editAttendance():
    try:
        eventID = request.args.get('eventID')
        userID = request.args.get('userID')

        body = {
            "eventID": eventID,
            "userID": userID,
        }
        db.Attendance.insert_one(body)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Attendance edited"}, 200


"""

END OF EVENT HANDLING, START OF SOCIAL

"""


@app.route("/user/<userID>")
@cross_origin()
def getUser(userID):
    try:
        data = db.User.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
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
        return {"err": "Action failed"}, 400


@app.route("/profile/edit", methods=['PUT'])
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
        return {"err": "Action failed"}, 400
    return {'message': "Event changed"}, 200


@app.route("/profile/<userID>")
@cross_origin()
def getUserProfile(userID):
    try:
        data = db.Profiles.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/profile", methods=['DELETE', 'POST'])
@cross_origin()
def addDeleteProfile():
    try:
        if request.method == "POST":
            data = request.get_json()
            userID = str(data.get('userID'))
            name = str(data.get('name'))
            bio = str(data.get('bio'))
            profilePicture = str(data.get('profilePicture'))
            block = int(data.get('block'))
            telegramHandle = str(data.get('telegramHandle'))
            modules = data.get('modules')

            body = {
                "userID": userID,
                "name": name,
                "bio": bio,
                "profilePicture": profilePicture,
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
        return {"err": "Action failed"}, 400


@app.route("/profile/edit/", methods=['PUT'])
@cross_origin()
def editProfile():
    try:
        data = request.get_json()
        userID = str(data.get('userID'))
        name = str(data.get('name'))
        bio = str(data.get('bio'))
        profilePicture = str(data.get('profilePicture'))
        block = int(data.get('block'))
        telegramHandle = str(data.get('telegramHandle'))
        modules = data.get('modules')

        body = {
            "userID": userID,
            "name": name,
            "bio": bio,
            "profilePicture": profilePicture,
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
        return {"err": "Action failed"}, 400
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
        return {"err": "Action failed"}, 400
    return json.dumps(data1, default=lambda o: str(o)), 200

    
@app.route("/post", methods=['GET', 'DELETE', 'POST'])
@cross_origin()
def addDeletePost():
    try:
        if request.method == "GET" : 
            #get last 5 most recent 
            data = db.Posts.find()
            return json.dumps(list(data), default=lambda o: str(o)), 200
        elif request.method == "POST":
            data = request.get_json()
            userID = str(data.get('userID'))
            title = str(data.get('title'))
            description = str(data.get('description'))
            ccaID = int(data.get('ccaID'))
            createdAt = int(data.get('createdAt'))
            postPics = list(data.get('description'))
            isOfficial = data.get('isOfficial')
            
            lastPostID = db.Posts.find_one(sort=[('postID', pymongo.DESCENDING )])
            newPostID = 1 if lastPostID is None else int(lastPostID.get("postID")) + 1
                
            body = {
                "postID" : newPostID,
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
        return {"err": "Action failed"}, 400

@app.route("/post/<int:last>", methods = ['GET'])
@cross_origin()
def getLastN(last):
    try : 
        data = db.Posts.find(sort=[('createdAt', pymongo.DESCENDING )]).limit(last)
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    
@app.route("/post/<userID>", methods = ['GET'])
@cross_origin()
def getPostById(userID):
    try :         
        data = db.Posts.find({"userID": str(userID)})
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    
@app.route("/post/official", methods = ['GET'])
@cross_origin()
def getOfficialPosts():
    try :         
        data = db.Posts.find({"isOfficial": True})
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
        

@app.route("/post/edit/", methods=['PUT'])
@cross_origin()
def editPost():
    try:
        data = request.get_json()
        postID = data.get('postID')
        userID = str(data.get('userID'))
        title = str(data.get('title'))
        description = str(data.get('description'))
        ccaID = int(data.get('ccaID'))
        createdAt = int(data.get('createdAt'))
        postPics = list(data.get('description'))
        isOfficial = data.get('isOfficial')

        body = {
            "userID": userID,
            "title": title,
            "description": description,
            "ccaID": ccaID,
            "createdAt": createdAt,
            "postPics": postPics,
            "isOfficial": isOfficial
        }

        result = db.Posts.update_one({"_id": ObjectId(postID)}, {'$set': body})
        if int(result.matched_count) > 0:
            return {'message': "Event changed"}, 200
        else:
            return Response(status=204)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Event changed"}, 200

if __name__ == "__main__":
    app.run(threaded = True, debug = True)
    # app.run('0.0.0.0', port=8080)