from db import *
from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, make_response
import os
from datetime import datetime
import time
from flask_cors import cross_origin
from flask import Blueprint
import pymongo
import sys
sys.path.append("../db")

scheduling_api = Blueprint("scheduling", __name__)


def renameEvent(event):
    event['eventID'] = event.pop('_id')
    return event


@scheduling_api.route("/")
@cross_origin()
def hello():
    return "Welcome the Raffles Hall Events server"


@scheduling_api.route("/timetable/<userID>", methods=["GET"])
@cross_origin()
def getUserTimetable(userID):
    try:
        data = list(db.Lessons.find({"userID": userID}))
        if len(data) == 0:
            raise Exception("No data found.")
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event', methods=["GET"])
@cross_origin()
def getAllEvents():
    try:
        data = list(db.Events.find())
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/private', methods=["GET"])
@cross_origin()
def getAllPrivateEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": True}})
        response = {"status": "success", "data": []}
        for item in data:
            item['eventID'] = str(item.pop('_id'))
            response["data"].append(item)
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/private/<userID>/<startTime>', methods=["GET"])
@cross_origin()
def getPrivateEventOfUserAfterTime(userID, startTime):
    try:
        data = db.Events.find({"isPrivate": {
                              "$eq": True}, "userID": userID, "startDateTime": {"$gte": int(startTime)}})
        response = {"status": "success", "data": []}
        for item in data:
            item['eventID'] = str(item.pop('_id'))
            response["data"].append(item)
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/public/<pagination>/<startTime>', methods=["GET"])
@cross_origin()
def getPublicEventsPagination(pagination, startTime=0):
    try:
        data = db.Events.find({"isPrivate": {"$eq": False}, "startDateTime": {"$gte": int(startTime)}}, sort=[
                              ("startDateTime", pymongo.ASCENDING)]).skip(int(pagination) * 10).limit(10)
        response = {"status": "success", "data": []}
        for item in data:
            item['eventID'] = str(item.pop('_id'))
            response["data"].append(item)
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/public', methods=["GET"])
@cross_origin()
def getAllPublicEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": False}})
        response = {"status": "success", "data": []}
        for item in data:
            item['eventID'] = str(item.pop('_id'))
            response["data"].append(item)
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/public/afterTime/<startTime>', methods=["GET"])
@cross_origin()
def getPublicEventAfterTime(startTime):
    try:
        data = list(db.Events.find(
            {"startDateTime": {"$gt": int(startTime)}, "isPrivate": False}))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/cca', methods=["GET"])
@cross_origin()
def getAllCCA():
    try:
        data = list(db.CCA.find({}, {'_id': 0}))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/ccaID/<int:ccaID>', methods=["GET"])
@scheduling_api.route('/event/ccaID/<int:ccaID>/<referenceTime>', methods=["GET"])
@cross_origin()
def getEventsCCA(ccaID, referenceTime=0):
    try:
        referenceTime = int(referenceTime)
        startOfWeek = referenceTime - ((referenceTime - 345600) % 604800)
        endOfWeek = startOfWeek + 604800
        if referenceTime != 0:
            data = list(db.Events.find({"ccaID": ccaID, "startDateTime": {
                "$gte": int(startOfWeek), "$lte": int(endOfWeek)}}))
        else:
            data = list(db.Events.find({"ccaID": ccaID}))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/event/eventID/<string:eventID>', methods=["GET"])
@cross_origin()
def getEventsDetails(eventID):
    try:
        data = list(db.Events.find_one({"_id": ObjectId(eventID)}))
        response = {"status": "success", "data": []}
        for item in data:
            item['eventID'] = str(item.pop('_id'))
            response["data"].append(item)
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route('/cca/<int:ccaID>', methods=["GET"])
@cross_origin()
def getCCADetails(ccaID):
    try:
        data = list(db.CCA.find({"ccaID": ccaID}, {'_id': 0}))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@scheduling_api.route("/user_CCA/<string:userID>", methods=['GET'])
@cross_origin()
def getUserCCAs(userID):
    try:
        CCAofUserID = db.UserCCA.find({"userID": userID})
        entries = [w["ccaID"] for w in CCAofUserID]
        data = list(db.CCA.find({"ccaID": {"$in": entries}}))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route("/user_event/<string:userID>/", methods=['GET'])
@cross_origin()
def getUserAttendanceAll(userID):
    try:
        data = list(db.Attendance.find({"userID": userID}))

        entries = [ObjectId(w['eventID']) for w in data]
        data = db.Events.find({"_id": {"$in": entries}})
        response = list(map(renameEvent, data))
        response = {"status": "success", "data": response}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route("/user_event/<userID>/<int:referenceTime>", methods=["GET"])
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
        response = {"status": "success", "data": list(response)}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route("/user_event/<eventID>", methods=["GET"])
@cross_origin()
def getEventAttendees(eventID):
    try:
        response = db.Attendance.find({"eventID": eventID})
        response = {"status": "success", "data": list(response)}

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@scheduling_api.route("/user_CCA/<int:ccaID>", methods=["GET"])
@cross_origin()
def getCCAMembers(ccaID):
    try:
        response = db.UserCCA.find({"ccaID": ccaID})
        response = {"status": "success", "data": list(response)}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route("/user_CCA/", methods=["GET"])
@cross_origin()
def getCCAMembersName():
    try:
        ccaName = str(request.args.get('ccaName'))
        response = db.UserCCA.find({"ccaName": ccaName})
        response = {"status": "success", "data": list(response)}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@ scheduling_api.route("/permissions/<userID>", methods=["GET"])
@ cross_origin()
def getUserPermissions(userID):
    try:
        data = db.UserPermissions.find({"recipient": userID})
        donors = [pair["donor"] for pair in data]
        results = db.Profiles.find({"userID": {"$in": donors}})
        response = [{info: profile[info] for info in profile.keys()
                     & {'userID', 'displayName'}} for profile in results]
        response = {"status": "success", "data": list(response)}

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@ scheduling_api.route("/permissions", methods=['DELETE', 'POST'])
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
        return {"err": str(e), "status": "failed"}, 400
    return {"status": "success"}, 200


@scheduling_api.route("/event/", methods=['POST'])
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

        response = {"status": "success", "data": body}

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route("/event/<eventID>", methods=['DELETE'])
@cross_origin()
def deleteEvent(eventID):
    try:
        db.Events.delete_one({"_id": ObjectId(eventID)})

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return {"status": "success"}, 200


@scheduling_api.route("/event/", methods=['PUT'])
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
            return {"status": "success"}, 200
        else:
            receipt = db.Events.insert_one(body)
            body["eventID"] = str(receipt.inserted_id)
            response = {"status": "success", "data": body}

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


@scheduling_api.route("/user_event/", methods=['POST', 'DELETE'])
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
        return {"err": str(e), "status": "failed"}, 400
    return {"status": "success"}, 200


@scheduling_api.route("/nusmods/<userID>", methods=["GET"])
@cross_origin()
def getMods(userID):
    try:
        data = db.NUSMods.find({"userID": userID})
        response = {"status": "success", "data": list(data)}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)


# @scheduling_api.route("/nusmods/<userID>", methods=['DELETE'])
# @cross_origin()
# def deleteMods(userID):
#     try:
#         db.NUSMods.delete_one({"userID": userID})

#     except Exception as e:
#         return {"err": str(e), "status": "failed"}, 400
#     return {"status": "success"}, 200


@scheduling_api.route("/nusmods/", methods=['DELETE'])
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
        return {"status": "success"}, 200

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400


@scheduling_api.route("/nusmods", methods=['POST'])
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
        return {"status": "success"}, 200

    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400


@scheduling_api.route("/nusmods/addNUSMods", methods=['POST'])
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
            lesson = [
                moduleClass for moduleClass in moduleData if moduleClass["classNo"] == classNo and moduleClass["lessonType"] == lessonType]
            for les in lesson:
                les["abbrev"] = abbrev
                out.append(les)

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
        print(oneModuleArray)
        data = list(db.NUSMods.find_one({"userID": userID}))
        response = {"status": "success", "data": data}
    except Exception as e:

        return {"err": str(e), "status": "failed"}, 400
    return make_response(response, 200)
