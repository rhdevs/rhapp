from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import json
import time
from datetime import datetime
from bson.objectid import ObjectId
client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.RHApp

app = Flask("rhapp")
CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"
# app.config.from_object(os.environ['APP_SETTINGS'])


@app.route("/timetable/<userID>")
def getUserTimetable(userID):
    try:
        data = db.Lessons.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/user/all')
def getAllUsers():
    try:
        data = db.User.find()
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@ app.route('/event/all')
def getAllEvents():
    try:
        data = db.Events.find()
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/cca/all')
def getAllCCA():
    try:
        data = db.CCA.find()
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/event/<int:eventID>')
def getEventDetails(eventID):
    try:
        data = db.Events.find({"eventID": eventID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/cca/<int:ccaID>')
def getCCADetails(ccaID):
    try:
        data = db.CCA.find({"ccaID": ccaID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_CCA/<userID>")
def getUserCCAs(userID):
    try:
        data = db.UserCCA.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_event/<userID>")
def getUserEvents(userID):
    try:
        data = db.UserEvent.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_event/<int:eventID>")
def getEventAttendees(eventID):
    try:
        data = db.UserEvent.find({"eventID": eventID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_CCA/<int:ccaID>")
def getCCAMembers(ccaID):
    try:
        data = db.UserCCA.find({"ccaID": ccaID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/permissions/<userID>")
def getUserPermissions(userID):
    try:
        data = db.UserPermissions.find({"recipient": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/permissions", methods=['DELETE', 'POST'])
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

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {"message": "Action successful"}, 200


@ app.route("/event/add", methods=['POST'])
def createEvent():
    try:
        data = request.get_json()
        # eventID = int(data.get('eventID'))
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')

        body = {
            # "eventID": eventID,
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image
        }

        receipt = db.Events.insert_one(body)
        body["_id"] = str(receipt.inserted_id)

        return {"message": body}, 200

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@ app.route("/event/delete/<int:eventID>", methods=['DELETE'])
def deleteEvent(eventID):
    try:
        db.Events.delete_one({eventID: eventID})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {"message": "successful"}, 200


@ app.route("/event/edit", methods=['PUT'])
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

        body = {
            # "eventID": eventID,
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image
        }

        db.Events.update_one({"_id": ObjectId(eventID)}, {'$set': body})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Event changed"}, 200


@ app.route("/user_event/", methods=['POST'])
def editAttendance():
    try:
        eventID = request.args.get('eventID')
        userID = request.args.get('userID')

        body = {
            "eventID": eventID,
            "userID": userID,
        }
        db.UserEvent.insert_one(body)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Attendance edited"}, 200


"""

END OF EVENT HANDLING, START OF SOCIAL

"""


@app.route("/user/<userID>")
def getUser(userID):
    try:
        data = db.User.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user", methods=['DELETE', 'POST'])
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

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@ app.route("/profile/edit/", methods=['PUT'])
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

        db.User.update_one({"userID": userID}, {'$set': body})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Event changed"}, 200


@app.route("/profile/<userID>")
def getUserProfile(userID):
    try:
        data = db.Profiles.find({"userID": userID})
    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/profile", methods=['DELETE', 'POST'])
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
            body["_id"] = str(receipt.inserted_id)

            return {"message": body}, 200

        elif request.method == "DELETE":
            userID = request.args.get('userID')
            db.Profiles.delete_one({"userID": userID})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400


@ app.route("/profile/edit/", methods=['PUT'])
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

        db.Profiles.update_one({"userID": userID}, {'$set': body})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {'message': "Event changed"}, 200


@app.route("/user/details/<userID>")
def getUserDetails(userID):
    try:
        data1 = db.User.find_one({"userID": userID})
        data2 = db.Profiles.find_one({"userID": userID})
        data1.update(data2)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return json.dumps(data1, default=lambda o: str(o)), 200


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
