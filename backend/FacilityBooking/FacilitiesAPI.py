from AuthFunction import authenticate
from db import *
from flask import jsonify, request, make_response
from AuthFunction import authenticate
from datetime import datetime
from flask_cors import cross_origin
from flask import Blueprint
import pymongo
import sys, copy

sys.path.append("../")

facilities_api = Blueprint("facilities", __name__)

# Used to convert CCA ID into CCA Name


def conversion(ccaID):
    return str(db.CCA.find_one({"ccaID": ccaID})["ccaName"])


@facilities_api.route('/')
@cross_origin()
def root_route():
    return 'What up losers'


@facilities_api.route('/facilities', methods=["GET"])
@cross_origin(supports_credentials=True)
def all_facilities():
    try:
        data = list(db.Facilities.find(
            {}, {"_id": 0}).sort("facilityID", 1))
        response = {"status": "success", "data": data}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)


@ facilities_api.route('/facilities/<facilityID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def get_facility_name(facilityID):
    try:
        data = list(db.Facilities.find(
            {"facilityID": int(facilityID)}, {"_id": 0}))
        if len(data) == 0:
            return {"err": "Facility not found", "status": "failed"}, 400
        response = {"status": "success", "data": data}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)


@ facilities_api.route('/bookings/<int:bookingID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def get_one_booking(bookingID):
    try:
        pipeline = [
            {'$match': {
                'bookingID': bookingID
            }},
            {'$lookup': {
                'from': 'User',
                        'localField': 'userID',
                        'foreignField': 'userID',
                        'as': 'profile'
            }},
            {'$unwind': {'path': '$profile', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'displayName': '$profile.displayName'
            }},
            {'$lookup': {
                'from': 'CCA',
                        'localField': 'ccaID',
                        'foreignField': 'ccaID',
                        'as': 'cca'
            }},
            {'$unwind': {'path': '$cca', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'ccaName': '$cca.ccaName'
            }},
            {'$lookup': {
                'from': 'Facilities',
                        'localField': 'facilityID',
                        'foreignField': 'facilityID',
                        'as': 'facility'
            }},
            {'$unwind': {'path': '$facility', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'facilityName': '$facility.facilityName'
            }},
            {'$project': {'profile': 0, 'cca': 0, 'facility': 0, '_id': 0}}
        ]

        data = list(db.Bookings.aggregate(pipeline))
        for booking in data:
            data = booking
        if len(data) == 0:
            return {"err": "Booking not found", "status": "failed"}, 400

        if data["ccaID"] != None:
            if data["ccaID"] != 0:
                data["ccaName"] = conversion(data["ccaID"])

        response = {"status": "success", "data": data}

    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)


@ facilities_api.route('/bookings/user/<userID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def user_bookings(userID):
    try:
        if (not request.args.get("token")):
            return {"err": "No token", "status": "failed"}, 401

        if (not authenticate(request.args.get("token"), userID)):
            return {"err": "Auth Failure", "status": "failed"}, 401

        pipeline = [
            {'$match':
                {'$and': [
                    {'userID': userID},
                    {"endTime": {"$gte": datetime.now().timestamp()}}
                ]}
             },
            {'$lookup': {
                'from': 'User',
                        'localField': 'userID',
                        'foreignField': 'userID',
                        'as': 'profile'
            }},
            {'$unwind': {'path': '$profile', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'displayName': '$profile.displayName'
            }},
            {'$lookup': {
                'from': 'CCA',
                        'localField': 'ccaID',
                        'foreignField': 'ccaID',
                        'as': 'cca'
            }},
            {'$unwind': {'path': '$cca', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'ccaName': '$cca.ccaName'
            }},
            {'$lookup': {
                'from': 'Facilities',
                        'localField': 'facilityID',
                        'foreignField': 'facilityID',
                        'as': 'facility'
            }},
            {'$unwind': {'path': '$facility', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'facilityName': '$facility.facilityName'
            }},
            {'$project': {'profile': 0, 'cca': 0, 'facility': 0, '_id': 0}}
        ]

        data = list(db.Bookings.aggregate(pipeline))
        data.sort(
            key=lambda x: x.get('startTime'), reverse=False)

        response = {"status": "success", "data": data}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)


@ facilities_api.route('/bookings/facility/<facilityID>/', methods=["GET"])
@ cross_origin(supports_credentials=True)
def check_bookings(facilityID):
    try:
        if (request.args.get('endTime') < request.args.get('startTime')):
            return {"err": "Invalid start and end time", "status": "failed"}, 400

        condition = {
            "$and": [
                {'facilityID': int(facilityID)},
            ]
        }

        if (request.args.get('endTime') != None):
            condition['$and'].append({'startTime': {'$lt': int(
                request.args.get('endTime'))}})

        if (request.args.get('startTime') != None):
            condition['$and'].append({'endTime': {'$gt': int(
                request.args.get('startTime'))}})

        # BUG 622 Fix: If startTime and endTime are provided, checks if endTime is valid.
        if (request.args.get("startTime") != None and request.args.get("endTime") != None):
            if (request.args.get("endTime") <= request.args.get("startTime")):
                return {"Err": "Invalid end time."}, 403

        pipeline = [
            {'$match':
                condition
             },
            {'$lookup': {
                'from': 'User',
                        'localField': 'userID',
                        'foreignField': 'userID',
                        'as': 'profile'
            }},
            {'$unwind': {'path': '$profile', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'displayName': '$profile.displayName'
            }},
            {'$lookup': {
                'from': 'CCA',
                        'localField': 'ccaID',
                        'foreignField': 'ccaID',
                        'as': 'cca'
            }},
            {'$unwind': {'path': '$cca', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'ccaName': '$cca.ccaName'
            }},
            {'$lookup': {
                'from': 'Facilities',
                        'localField': 'facilityID',
                        'foreignField': 'facilityID',
                        'as': 'facility'
            }},
            {'$unwind': {'path': '$facility', 'preserveNullAndEmptyArrays': True}},
            {'$addFields': {
                'facilityName': '$facility.facilityName'
            }},
            {'$project': {'profile': 0, 'cca': 0, 'facility': 0, '_id': 0}}
        ]

        data = list(db.Bookings.aggregate(pipeline))
        data.sort(
            key=lambda x: x.get('startTime'), reverse=False)

        response = {"status": "success", "data": data}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500

    return make_response(response)


@ facilities_api.route('/bookings', methods=['POST'])
@ cross_origin(supports_credentials=True)
def add_booking():
    try:
        formData = request.get_json()

        if (formData == None):
            return {"err": "Error reading form"}, 400

        if (not request.args.get("token")):
            return {"err": "No token", "status": "failed"}, 401
        if (not authenticate(request.args.get("token"), formData.get("userID"))):
            return {"err": "Auth Failure", "status": "failed"}, 401

        if (formData["endTime"] <= formData["startTime"]):
            return {"err": "End time earlier than start time", "status": "failed"}, 400
        if formData.get("bookUntil") != None and (int(formData.get("bookUntil")) < int(formData.get("endTime"))):
            return {"err": "Terminating time of recurring booking earlier than end time of first booking", "status": "failed"}, 400

        if formData['facilityID'] == 15 and not db.UserCCA.find_one({'userID': formData['userID'], 'ccaID': 3}):
            return make_response({"err": "You must be in RH Dance to make this booking", "status": "failed"}, 403)

        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])
        formData["facilityID"] = int(formData["facilityID"])

        if not formData.get("ccaID"):
            formData["ccaID"] = int(0)
        else:
            formData["ccaID"] = int(formData["ccaID"])

        if not (formData.get("bookUntil") or formData.get("repeat")):
            formData["repeat"] = 1
        elif formData.get("bookUntil") and not formData.get("repeat"):
            formData["repeat"] = int(((int(formData["bookUntil"]) - int(formData["startTime"])) / (7 * 24 * 60 * 60)) + 1)
        elif not formData.get("bookUntil") and formData.get("repeat"):
            formData["repeat"] = int(formData.get("repeat"))
        else:
            del formData["bookUntil"]
            formData["repeat"] = int(formData.get("repeat"))

        if not formData.get("forceBook"):
            formData["forceBook"] = False

        def SpaceOneWeekApart():
            booking["startTime"] += 7 * 24 * 60 * 60
            booking["endTime"] += 7 * 24 * 60 * 60

        condition = []

        for i in range(formData["repeat"]):
            condition.append({'$and': [
                {
                    "endTime": {
                        "$gt": formData.get('startTime') + i * 7 * 24 * 60 * 60
                    }
                },
                {
                    "startTime": {
                        "$lt": formData.get('endTime') + i * 7 * 24 * 60 * 60
                    }
                }
            ]})

        conflictedBookings = list(db.Bookings.find(
            {
                "facilityID": formData.get("facilityID"),
                "$or": condition
            }, {
                "_id": 0
            }
        ))

        lastbookingID = list(db.Bookings.find().sort(
            [('_id', pymongo.DESCENDING)]).limit(1))
        newBookingID = 1 if len(lastbookingID) == 0 else int(
            lastbookingID[0].get("bookingID")) + 1

        if (len(conflictedBookings) == 0):
            formData["bookingID"] = newBookingID

            insertData = []
            for i in range(formData["repeat"]):
                insertData.append(formData.copy())
                formData["bookingID"] += 1
                SpaceOneWeekApart(formData)
            
            bookings_made_list = copy.deepcopy(insertData) # See: https://docs.python.org/3/library/copy.html (insertData.copy() does not work)
            db.Bookings.insert_many(insertData)
            response = {"status": "success", "bookings_made": bookings_made_list, "number_of_bookings_made": str(len(insertData))}, 200

        elif (len(conflictedBookings) > 0):
            if formData["forceBook"] == False:
                return make_response({"err": "Conflicted booking with previous bookings.", "conflict_bookings": conflictedBookings, "status": "failed"}), 409
            elif formData["forceBook"] == True:
                insertData = []
                blocking_bookings = {}
                successful_bookings = {}
                startTimeArray = []

                for i in range(formData["repeat"]):
                    insertData.append(formData.copy())
                    SpaceOneWeekApart(formData)

                for booking in conflictedBookings:
                    for newBooking in insertData:
                        if ((newBooking["endTime"] > dict(booking)["startTime"]) and (newBooking["startTime"] < dict(booking)["endTime"])):
                            insertData.remove(newBooking)

                for editedBooking in insertData:
                    editedBooking["bookingID"] = newBookingID
                    newBookingID += 1

                for conflict_bookings in conflictedBookings:
                    startTimeArray.append(
                        int(dict(conflict_bookings)["startTime"]))
                for pending_bookings in insertData:
                    startTimeArray.append(
                        int(dict(pending_bookings)["startTime"]))
                
                startTimeArray = sorted((set(startTimeArray)), key=int)

                for timestamp in startTimeArray:
                    for conflict_bookings in conflictedBookings:
                        if int(timestamp) == int(dict(conflict_bookings)["startTime"]):
                            blocking_bookings[str(timestamp)] = []
                            blocking_bookings[str(timestamp)].append(dict(conflict_bookings))
                    for pending_bookings in insertData:
                        if int(timestamp) == int(dict(pending_bookings)["startTime"]):
                            successful_bookings[str(timestamp)] = []
                            successful_bookings[str(timestamp)].append(dict(pending_bookings))

                if len(insertData) != 0:
                    db.Bookings.insert_many(insertData)
                    response = {"message": "Unblocked slots booked", "blocking_bookings": blocking_bookings, "successful_bookings": successful_bookings,
                                        "number_of_bookings_made": str(len(insertData)), "status": "success"}, 200
                else:
                    return make_response({"message": "All slots have been blocked.", "blocking_bookings": blocking_bookings, "status": "failed"}), 409

        # Logging
        formData["action"] = "Add Booking"
        formData["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        db.BookingLogs.insert_one(formData)

    except Exception as e:
        print(e)
        return {"err": "An error occurred", "status": "failed"}, 500

    return make_response(response)


@ facilities_api.route('/bookings/<bookingID>', methods=['PUT'])
@ cross_origin(supports_credentials=True)
def edit_booking(bookingID):
    try:
        formData = request.get_json()

        if not formData.get("ccaID"):
            formData["ccaID"] = int(0)
        else:
            formData["ccaID"] = int(formData["ccaID"])

        if (formData["endTime"] <= formData["startTime"]):
            return {"err": "End time earlier than start time", "status": "failed"}, 400

        data = list(db.Bookings.find({"bookingID": int(bookingID)}))

        conflict = list(db.Bookings.find(
            {
                "facilityID": formData.get("facilityID"),
                '$and': [
                    {
                        "endTime": {
                            "$gt": formData.get('startTime')
                        }
                    },
                    {
                        "startTime": {
                            "$lt": formData.get('endTime')
                        }
                    },
                    {
                        "bookingID": {
                            "$ne": int(bookingID)
                        }
                    }
                ]
            }, {
                "_id": 0
            }
        ))

        if (len(conflict) > 0):
            return make_response({"err": "Conflicted booking with previous bookings.", "conflict_bookings": conflict, "status": "failed"}, 409)

        if (len(data) == 0):
            return {"err": "Booking not found", "status": "failed"}, 404

        if (not request.args.get("token")):
            return {"err": "No token", "status": "failed"}, 401

        if (not data[0] or not data[0]['userID'] or not authenticate(request.args.get("token"), data[0]['userID'])):
            return {"err": "Auth Failure", "status": "failed"}, 401

        db.Bookings.update_one({"bookingID": int(bookingID)}, {
            "$set": request.get_json()})

        # Logging
        formData["action"] = "Edit Booking"
        formData["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        formData["bookingID"] = bookingID
        db.BookingLogs.insert_one(formData)

        response = {"status": "success"}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500

    return make_response(response)


@ facilities_api.route('/bookings/<bookingID>', methods=['DELETE'])
@ cross_origin(supports_credentials=True)
def delete_booking(bookingID):
    try:

        data = db.Bookings.find_one({"bookingID": int(bookingID)})
        del data['_id']

        if (not request.args.get("token")):
            return {"err": "No token", "status": "failed"}, 401

        if (not authenticate(request.args.get("token"), data.get("userID"))):
            return {"err": "Auth Failure", "status": "failed"}, 401

        if (len(data) == 0):
            return {"err": "Booking not found", "status": "failed"}, 404

        db.Bookings.delete_one(
            {"bookingID": int(bookingID)})
        # Logging
        data["action"] = "Delete Booking"
        data["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        db.BookingLogs.insert_one(data)
        response = {"status": "success"}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500

    return make_response(response)


@ facilities_api.route('/users/telegramID/<userID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def user_telegram(userID):
    try:
        profile = db.User.find_one({"userID": userID}, {"passwordHash": 0})
        telegramHandle = profile.get(
            'telegramHandle') if profile else "No User Found"

        if (telegramHandle == "No User Found"):
            return {"err": "User not found", "status": "failed"}, 404
        response = {"status": "success", "data": telegramHandle}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)


@ facilities_api.route('/bookings/blockout', methods=["POST"])
@ cross_origin(supports_credentials=True)
def blockout():
    try:
        if (not request.args.get("token")):
            return {"err": "No token", "status": "failed"}, 401

        if (not authenticate(request.args.get("token"), "RH_JCRC")):
            return {"err": "Auth Failure", "status": "failed"}, 401

        formData = request.get_json()

        print(formData)

        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])

        if (len(formData["facilities"]) == 1) and (formData["facilities"][0] == 0):
            formData["facilities"] = list(
                map(lambda x: x["facilityID"],
                    list(db.Facilities.find({}))
                    )
            )

        for facilityID in formData["facilities"]:
            db.Bookings.delete_many({
                "facilityID": facilityID,
                "endTime": {
                    "$gt": formData.get('startTime')
                },
                "startTime": {
                    "$lt": formData.get('endTime')
                }
            })

            lastbookingID = list(db.Bookings.find().sort(
                [('_id', pymongo.DESCENDING)]).limit(1))
            newBookingID = 1 if len(lastbookingID) == 0 else int(
                lastbookingID[0].get("bookingID")) + 1

            db.Bookings.insert_one({
                "bookingID": newBookingID,
                "facilityID": facilityID,
                "eventName": "JCRC Blockout",
                "description": "JCRC Blockout",
                "userID": "RH_JCRC",
                "ccaID": 80,
                "startTime": formData["startTime"],
                "endTime": formData["endTime"],
            })

        formData["action"] = "Blockout"
        db.BookingLogs.insert_one(formData)

        response = {"status": "success"}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)