from flask import Flask, request, jsonify
import pymongo
import json
from datetime import datetime
client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.RHApp

app = Flask("rhapp")


@app.route("/timetable/all/<userID>")
def getUserTimetable(userID):
    try:
        data = db.UserLesson.find({"userID": userID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/user/all')
def getAllUsers():
    try:
        data = db.User.find()
        return json.dumps(list(data), default=lambda o: str(o)), 200
    except Exception as e:
        return {"err": e}, 400


@ app.route('/event/all')
def getAllEvents():
    try:
        data = db.Event.find()
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/cca/all')
def getAllCCA():
    try:
        data = db.CCA.find()
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/event/<int:eventID>')
def getEventDetails(eventID):
    try:
        data = db.Event.find({"eventID": eventID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/cca/<int:ccaID>')
def getCCADetails(ccaID):
    try:
        data = db.CCA.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route('/lesson/<int:lessonID>')
def getLessonDetails(lessonID):
    try:
        data = db.Lessons.find({"lessonID": lessonID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_CCA/<userID>")
def getUserCCAs(userID):
    try:
        data = db.UserCCA.find({"userID": userID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_event/<userID>")
def getUserEvents(userID):
    try:
        data = db.UserEvent.find({"userID": userID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_lesson/<userID>")
def getUserLessons(userID):
    try:
        data = db.UserLesson.find({"userID": userID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_event/<int:eventID>")
def getEventAttendees(eventID):
    try:
        data = db.UserEvent.find({"eventID": eventID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/user_CCA/<int:ccaID>")
def getCcaMembers(ccaID):
    try:
        data = db.UserCCA.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/permissions/<userID>")
def getUserPermissions(userID):
    try:
        data = db.UserPermissions.find({"recipient": userID})
    except Exception as e:
        return {"err": e}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@ app.route("/permissions", methods=['DELETE', 'POST'])
def addDeletePermissions():
    try:
        userID1 = request.args.get('userID1')
        userID2 = request.args.get('userID2')
        if request.method == "POST":
            body = {
                "donor": userID1,
                "recipient": userID2,
            }
            db.UserPermissions.insertOne(body)

        elif request.method == "DELETE":
            db.UserPermissions.deleteOne({
                donor: userID1,
                recipient: userID2
            })

    except Exception as e:
        return {"err": e}, 400
    return {"message": "Action successful"}, 200


@ app.route("/event/add")
def createEvent():
    try:
        eventID = request.args.get('eventID')
        eventName = request.args.get('eventName')
        startDateTime = datetime.strptime(
            request.args.get('startDateTime'), "%Y-%m-%d").date()
        endDateTime = datetime.strptime(
            request.args.get('endDateTime'), "%Y-%m-%d").date()
        description = request.args.get('description')
        location = request.args.get('location')
        ccaID = request.args.get('ccaID')
        userID = request.args.get('userID')
        image = request.args.get('image')

        body = {
            eventID: eventID,
            eventName: eventName,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            description: description,
            location: location,
            ccaID: ccaID,
            userID: userID,
            image: image
        }

        db.Event.insertOne(body)

    except Exception as e:
        return {"err": e}, 400
    return {"message": "successful"}, 200


@ app.route("/event/delete/<int:eventID>", methods=['DELETE'])
def deleteEvent(eventID):
    try:
        db.Event.deleteOne({eventID: eventID})

    except Exception as e:
        return {"err": e}, 400
    return {"message": "successful"}, 200


@ app.route("/event/edit/", methods=['PUT'])
def editEvent():
    try:
        eventID = request.args.get('eventID')
        eventName = request.args.get('eventName')
        startDateTime = request.args.get('startDateTime')
        endDateTime = request.args.get('endDateTime')
        description = request.args.get('description')
        location = request.args.get('location')
        ccaID = request.args.get('ccaID')
        userID = request.args.get('userID')
        image = request.args.get('image')

        body = {
            eventID: eventID,
            eventName: eventName,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            description: description,
            location: location,
            ccaID: ccaID,
            userID: userID,
            image: image
        }

        db.Event.update_one({eventID: eventID}, {'$set': body})

    except Exception as e:
        return {"err": e}, 400
    return {'message': "Event added"}, 200


@ app.route("/user_event/", methods=['POST'])
def editAttendance():
    try:
        eventID = request.args.get('eventID')
        userID = request.args.get('userID')

        body = {
            eventID: eventID,
            userID: userID,
        }
        db.UserEvent.insertOne(body)

    except Exception as e:
        return {"err": e}, 400
    return {'message': "Attendance editted"}, 200


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
