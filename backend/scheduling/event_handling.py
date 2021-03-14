
from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS, cross_origin
import pymongo
import json
import os
import time
from bson.objectid import ObjectId
import re
import requests

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

DB_USERNAME = os.getenv('DB_USERNAME')
DB_PWD = os.getenv('DB_PWD')
# URL = "mongodb+srv://rhdevs-db-admin:{}@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority".format(DB_PWD)

# client = pymongo.MongoClient(URL)
# I understand that you do not to expose the implementation when using API when you return the error
# but i think this causing a lot of confusion because the message is just failed without any proper further messages
# I think for now its better to refactor the code to use default exception

client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = client["RHApp"]


def renameEvent(event):
    event['eventID'] = event.pop('_id')
    return event


@app.route("/")
@cross_origin()
def hello():
    return "Welcome the Raffles Hall Events server"


@app.route("/timetable/<userID>", methods=["GET"])
@cross_origin()
def getUserTimetable(userID):
    try:
        data = db.Lessons.find({"userID": userID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/all', methods=["GET"])
@cross_origin()
def getAllEvents():
    try:
        data = db.Events.find()
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/private/all', methods=["GET"])
@cross_origin()
def getAllPrivateEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": True}})
        response = []
        for item in data:
            item['eventID'] = item.pop('_id')
            response.append(item)
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/event/private/<userID>/<startTime>', methods=["GET"])
@cross_origin()
def getPrivateEventOfUserAfterTime(userID, startTime):
    try:
        data = db.Events.find({"isPrivate": {
                              "$eq": True}, "userID": userID, "startDateTime": {"$gte": int(startTime)}})
        response = []
        for item in data:
            item['eventID'] = item.pop('_id')
            response.append(item)
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/event/public/<pagination>/<startTime>', methods=["GET"])
@cross_origin()
def getPublicEventsPagination(pagination, startTime=0):
    try:
        data = db.Events.find({"isPrivate": {"$eq": False}, "startDateTime": {"$gte": int(startTime)}}, sort=[
                              ("startDateTime", pymongo.ASCENDING)]).skip(int(pagination) * 10).limit(10)
        response = []
        for item in data:
            item['eventID'] = item.pop('_id')
            response.append(item)
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/event/public/all', methods=["GET"])
@cross_origin()
def getAllPublicEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": False}})
        response = []
        for item in data:
            item['eventID'] = item.pop('_id')
            response.append(item)
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/event/afterTime/<startTime>', methods=["GET"])
@cross_origin()
def getEventAfterTime(startTime):
    try:
        data = db.Events.find({"startDateTime": {"$gt": int(startTime)}})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/public/afterTime/<startTime>', methods=["GET"])
@cross_origin()
def getPublicEventAfterTime(startTime):
    try:
        data = db.Events.find(
            {"startDateTime": {"$gt": int(startTime)}, "isPrivate": False})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/cca/all', methods=["GET"])
@cross_origin()
def getAllCCA():
    try:
        response = db.CCA.find()
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route('/event/ccaID/<int:ccaID>', methods=["GET"])
@app.route('/event/ccaID/<int:ccaID>/<referenceTime>', methods=["GET"])
@cross_origin()
def getEventsCCA(ccaID, referenceTime=0):
    try:
        referenceTime = int(referenceTime)
        startOfWeek = referenceTime - ((referenceTime - 345600) % 604800)
        endOfWeek = startOfWeek + 604800
        if referenceTime != 0:
            response = db.Events.find({"ccaID": ccaID, "startDateTime": {
                                      "$gte": int(startOfWeek), "$lte": int(endOfWeek)}})
        else:
            response = db.Events.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route('/event/eventID/<string:eventID>', methods=["GET"])
@cross_origin()
def getEventsDetails(eventID):
    try:
        response = db.Events.find_one({"_id": ObjectId(eventID)})
        response = renameEvent(response)

    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/cca/<int:ccaID>', methods=["GET"])
@cross_origin()
def getCCADetails(ccaID):
    try:
        data = db.CCA.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/<string:userID>", methods=['GET'])
@cross_origin()
def getUserCCAs(userID):
    try:
        data = db.UserCCA.find({"userID": userID})
        entries = [w["ccaID"] for w in data]
        response = db.CCA.find({"ccaID": {"$in": entries}})

        return json.dumps(list(response), default=lambda o: str(o)), 200

    except Exception as e:
        return {"err": str(e)}, 400


@app.route("/user_event/<string:userID>/all", methods=['GET'])
@cross_origin()
def getUserAttendanceAll(userID):
    try:
        data = list(db.Attendance.find({"userID": userID}))

        entries = [ObjectId(w['eventID']) for w in data]
        data = db.Events.find({"_id": {"$in": entries}})
        response = map(renameEvent, data)

        return json.dumps(list(response), default=lambda o: str(o)), 200

    except Exception as e:
        return {"err": str(e)}, 400


@app.route("/user_event/<userID>/<int:referenceTime>", methods=["GET"])
@cross_origin()
def getUserAttendance(userID, referenceTime):
    try:
        data = list(db.Attendance.find({"userID": userID}))
        # Gets the the week that contains the given time
        startOfWeek = referenceTime - ((referenceTime - 345600) % 604800)
        endOfWeek = startOfWeek + 604800

        entries = [ObjectId(w['eventID']) for w in data]
        data = db.Events.find({"_id": {"$in": entries}})

        def correctWeek(event):
            startTime = event['startDateTime']
            return startTime < endOfWeek and startTime >= startOfWeek

        response = filter(correctWeek, data)
        response = map(renameEvent, response)

    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route("/user_event/<eventID>", methods=["GET"])
@cross_origin()
def getEventAttendees(eventID):
    try:
        response = db.Attendance.find({"eventID": eventID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route("/user_CCA/<int:ccaID>", methods=["GET"])
@cross_origin()
def getCCAMembers(ccaID):
    try:
        response = db.UserCCA.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route("/user_CCA", methods=["GET"])
@cross_origin()
def getCCAMembersName():
    try:
        ccaName = str(request.args.get('ccaName'))
        response = db.UserCCA.find({"ccaName": ccaName})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route("/user_CCA/add", methods=['POST'])
@cross_origin()
def addUserCCA():
    try:
        data = request.get_json()
        userID = data.get('userID')
        ccaID = data.get('ccaID')  # list of integers

        deleteQuery = {"userID": userID}
        db.UserCCA.delete_many(deleteQuery)

        body = []
        for cca in ccaID:
            item = {
                "userID": userID,
                "ccaID": cca
            }

            body.append(item)
        if len(body) != 0:
            receipt = db.UserCCA.insert_many(body)

            response = {}
            response["_id"] = str(receipt.inserted_ids)
        else:
            response = "User has no more CCAs"

        return {"message": response}, 200
    except Exception as e:
        return {"err": str(e)}, 400


@ app.route("/permissions/<userID>", methods=["GET"])
@ cross_origin()
def getUserPermissions(userID):
    try:
        data = db.UserPermissions.find({"recipient": userID})
        donors = [pair["donor"] for pair in data]
        results = db.Profiles.find({"userID": {"$in": donors}})
        response = [{info: profile[info] for info in profile.keys()
                     & {'userID', 'displayName'}} for profile in results]

    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@ app.route("/permissions", methods=['DELETE', 'POST'])
@ cross_origin()
def addDeletePermissions():
    try:
        data = request.get_json()
        donor = data.get('donor')
        recipient = data.get('recipient')

        if request.method == "POST":
            body = {
                "donor": donor,
                "recipient": recipient
            }
            db.UserPermissions.update_one(body, {'$set': body}, upsert=True)

        elif request.method == "DELETE":
            db.UserPermissions.delete_one({
                "donor": donor,
                "recipient": recipient
            })

    except Exception as e:
        return {"err": str(e)}, 400
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
        ccaID = int(data.get('ccaID')) if data.get('ccaID') else None
        userID = data.get('userID')
        image = data.get('image')
        isPrivate = data.get('isPrivate')
        ownerIsAttending = data.get('ownerIsAttending')

        if endDateTime - startDateTime < 1800:
            return {"error": "Event must end at least 30 minutes after it begins!"}, 400

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
        del body["_id"]
        body["eventID"] = str(receipt.inserted_id)

        if ownerIsAttending:
            attendance = {
                "userID": body["userID"],
                "eventID": body["eventID"]
            }
            db.Attendance.update(attendance, {'$set': attendance}, upsert=True)

        return json.dumps(body, default=lambda o: str(o)), 200

    except Exception as e:
        return {"err": str(e)}, 400


@app.route("/event/delete/<eventID>", methods=['DELETE'])
@cross_origin()
def deleteEvent(eventID):
    try:
        db.Events.delete_one({"_id": ObjectId(eventID)})

    except Exception as e:
        return {"err": str(e)}, 400
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

        if endDateTime - startDateTime < 1800:
            return {"error": "Event must end at least 30 minutes after it begins!"}, 400

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
            receipt = db.Events.insert_one(body)
            body["eventID"] = str(receipt.inserted_id)

            return {"message": body}, 200

    except Exception as e:
        return {"err": str(e)}, 400
    return {'message': "Event changed"}, 200


@app.route("/user_event", methods=['POST', 'DELETE'])
@cross_origin()
def editAttendance():
    try:
        data = request.get_json()
        eventID = data.get('eventID')
        userID = data.get('userID')
        body = {
            "userID": userID,
            "eventID": eventID
        }
        if request.method == "POST":
            db.Attendance.update_one(body, {'$set': body}, upsert=True)

        elif request.method == "DELETE":
            db.Attendance.delete_many(body)

    except Exception as e:
        return {"err": str(e)}, 400
    return {'message': "Attendance edited"}, 200


@app.route("/nusmods/<userID>", methods=["GET"])
@cross_origin()
def getMods(userID):
    try:
        data = db.NUSMods.find({"userID": userID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/nusmods/delete/<userID>", methods=['DELETE'])
@cross_origin()
def deleteMods(userID):
    try:
        db.NUSMods.delete_one({"userID": userID})

    except Exception as e:
        return {"err": str(e)}, 400
    return {"message": "successful"}, 200


@app.route("/nusmods/deleteMod", methods=['PUT'])
@cross_origin()
def deleteOneMod():
    try:
        data = request.get_json()
        userID = data.get('userID')
        eventID = str(data.get('eventID'))
        week = data.get('weekNumber')

        NUSModsProfile = db.NUSMods.find({"userID": userID})
        currentMods = next(NUSModsProfile)["mods"]

        def removeWeek(lesson):
            lesson["weeks"] = [x for x in lesson["weeks"] if x != week]
            return lesson

        body = {
            'userID': userID,
            "mods": [mod if mod["eventID"] != eventID else removeWeek(mod) for mod in currentMods]
        }

        db.NUSMods.update_one(
            {"userID": userID}, {'$set': body})
        return {'message': "successful"}, 200

    except Exception as e:

        return {"err": str(e)}, 400
    return {"message": "successful"}, 200


@app.route("/nusmods", methods=['PUT'])
@cross_origin()
def addMods():
    try:
        data = request.get_json()
        userID = data.get('userID')
        mods = data.get('mods')

        body = {
            "userID": userID,
            "mods": mods,
        }

        db.NUSMods.update_one(
            {"userID": userID}, {'$set': body}, upsert=True)
        return {'message': "successful"}, 200

    except Exception as e:

        return {"err": str(e)}, 400
    return {"message": "successful"}, 200


@app.route("/nusmods/addNUSMods", methods=['PUT'])
@cross_origin()
def addNUSModsEvents():

    ABBREV_TO_LESSON = {
        "DLEC": 'Design Lecture',
        "LAB": 'Laboratory',
        "LEC": 'Lecture',
        "PLEC": 'Packaged Lecture',
        "PTUT": 'Packaged Tutorial',
        "REC": 'Recitation',
        "SEC": 'Sectional Teaching',
        "SEM": 'Seminar-Style Module Class',
        "TUT": 'Tutorial',
        "TUT2": 'Tutorial Type 2',
        "TUT3": 'Tutorial Type 3',
        "WS": 'Workshop',
    }

    def extractDataFromLink(nusModURL):
        k = re.findall(r"(\w+)=(.*?(?=\&|$))", nusModURL)
        return [[value[0], value[1].split(",")] for value in k]

    def fetchDataFromNusMods(academicYear, currentSemester, moduleArray):
        NUSModsApiURL = "https://api.nusmods.com/v2/{year}/modules/{moduleCode}.json".format(
            year=academicYear, moduleCode=moduleArray[0])
        moduleData = next(x for x in requests.get(NUSModsApiURL).json()[
                          "semesterData"] if x["semester"] == currentSemester)["timetable"]
        out = []
        for lesson in moduleArray[1]:
            if lesson == "":
                break
            abbrev, classNo = lesson.split(":")
            lessonType = ABBREV_TO_LESSON[abbrev]
            lesson = next(
                moduleClass for moduleClass in moduleData if moduleClass["classNo"] == classNo and moduleClass["lessonType"] == lessonType)
            lesson["abbrev"] = abbrev
            out.append(lesson)

        out = [{"eventName": moduleArray[0] + " " + classInformation["abbrev"],
                "location": classInformation["venue"],
                "day": classInformation["day"],
                "endTime": classInformation["endTime"],
                "startTime": classInformation["startTime"],
                "hasOverlap": False,
                "eventType": "mods",
                "weeks": classInformation["weeks"]} for classInformation in out]
        return out

    try:
        data = request.get_json()
        url = data.get('url')
        userID = data.get('userID')
        academicYear = data.get('academicYear')
        currentSemester = data.get('currentSemester')

        oneModuleArray = extractDataFromLink(url)

        output = [lesson for module in oneModuleArray for lesson in fetchDataFromNusMods(
            academicYear, currentSemester, module)]

        # adds a index for the timetable event. In a seperate line for readability
        indexed_output = [dict(eventID=str(index), **lesson)
                          for index, lesson in enumerate(output)]

        body = {"userID": userID,
                "mods": indexed_output}

        db.NUSMods.update_one({"userID": userID}, {"$set": body}, upsert=True)

        return json.dumps(db.NUSMods.find_one({"userID": userID}), default=lambda o: str(o)), 200

    except Exception as e:

        return {"err": str(e)}, 400


if __name__ == "__main__":
    # app.run(threaded=True, debug=True)
    app.run('0.0.0.0', port=8080)
