from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import json
import time
from datetime import datetime
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
        eventID = int(data.get('eventID'))
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')

        body = {
            "eventID": eventID,
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image
        }

        db.Events.insert_one(body)

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {"message": "successful"}, 200


@ app.route("/event/delete/<int:eventID>", methods=['DELETE'])
def deleteEvent(eventID):
    try:
        db.Events.delete_one({eventID: eventID})

    except Exception as e:
        print(e)
        return {"err": "Action failed"}, 400
    return {"message": "successful"}, 200


@ app.route("/event/edit/", methods=['PUT'])
def editEvent():
    try:
        data = request.get_json()
        eventID = int(data.get('eventID'))
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')

        body = {
            "eventID": eventID,
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image
        }

        db.Events.update_one({"eventID": eventID}, {'$set': body})

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


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
