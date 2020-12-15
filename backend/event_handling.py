from flask import Flask, request, jsonify
import pymongo
import json
from datetime import datetime
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
db = myclient["mydatabase"]

app = Flask("rhapp")


@app.route("timetable/all/<userID>")
def getUserTimetable(userID):
    try:
        data = db.userLesson.find({"userID": userID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route('/user/all')
def getAllUsers():
    try:
        data = db.user.find().pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route('/event/all')
def getAllEvents():
    try:
        data = db.event.find().pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route('/cca/all')
def getAllCCA():
    try:
        data = db.cca.find().pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route('/event/<int:eventID>')
def getEventDetails(eventID):
    try:
        data = db.event.find({"eventID": eventID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route('/cca/<int:ccaID>')
def getCCADetails(ccaID):
    try:
        data = db.cca.find({"ccaID": ccaID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route('/lesson/<int:lessonID>')
def getLessonDetails(lessonID):
    try:
        data = db.lesson.find({"lessonID": lessonID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/user_CCA/<userID>")
def getUserCCAs(userID):
    try:
        data = db.userCCA.find({"userID": userID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/user_event/<userID>")
def getUserEvents(userID):
    try:
        data = db.userEvent.find({"userID": userID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/user_lesson/<userID>")
def getUserLessons(userID):
    try:
        data = db.userLesson.find({"userID": userID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/user_event/<int:eventID>")
def getEventAttendees(eventID):
    try:
        data = db.userEvent.find({"eventID": eventID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/user_CCA/<int:ccaID>")
def getCcaMembers(ccaID):
    try:
        data = db.userCCA.find({"ccaID": ccaID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/user_lesson/<userID>")
def getUserLessons(userID):
    try:
        data = db.userLesson.find({"userID": userID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@ app.route("/permissions/<userID>")
def getUserPermissions(userID):
    try:
        data = db.permissions.find({"recipient": userID}).pretty()
    except Exception as e:
        return {"err": e}, 400
    return data, 200


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
            db.permissions.insertOne(body)

        elif request.method == "DELETE":
            db.permissions.deleteOne({
                donor: userID1,
                recipient: userID2
            })

    except Exception as e:
        return {"err": e}, 400
    return {"message": "Action successful"}, 200


@ app.route("event/add")
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

        db.event.insertOne(body)

    except Exception as e:
        return {"err": e}, 400
    return {"message": "successful"}, 200


@ app.route("event/delete/<int:eventID>", methods=['DELETE'])
def deleteEvent(eventID):
    try:
        db.event.deleteOne({eventID: eventID})

    except Exception as e:
        return {"err": e}, 400
    return {"message": "successful"}, 200


@ app.route("event/edit/", methods=['PUT'])
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

        db.event.update_one({eventID: eventID}, {'$set': body})

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
        db.userEvent.insertOne(body)

    except Exception as e:
        return {"err": e}, 400
    return {'message': "Attendance editted"}, 200


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
