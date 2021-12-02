from AuthFunction import authenticate
from db import *
from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, make_response
from AuthFunction import authenticate
import os
from datetime import datetime
import time
from flask_cors import cross_origin
from flask import Blueprint
import pymongo
import sys
sys.path.append("../")

facilities_api = Blueprint("facilities", __name__)


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
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@ facilities_api.route('/facilities/<facilityID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def get_facility_name(facilityID):
    try:
        data = list(db.Facilities.find(
            {"facilityID": int(facilityID)}, {"_id": 0}))
        if len(data) == 0:
            raise Exception("Facility not found")
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
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
                'from': 'Profiles',
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

        bookingInfo = db.Bookings.aggregate(pipeline)
        for booking in bookingInfo:
            data = booking
        response = {"status": "success", "data": data}
        if len(data) == 0:
            raise Exception("Booking not found")
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@ facilities_api.route('/bookings/user/<userID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def user_bookings(userID):
    try:
        if (not request.args.get("token")):
            raise Exception("No token")

        if (not authenticate(request.args.get("token"), userID)):
            raise Exception("Auth Failure")

        pipeline = [
            {'$match':
                {'$and': [
                    {'userID': userID},
                    {"endTime": {"$gte": datetime.now().timestamp()}}
                ]}
             },
            {'$lookup': {
                'from': 'Profiles',
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
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@ facilities_api.route('/bookings/facility/<facilityID>/', methods=["GET"])
@ cross_origin(supports_credentials=True)
def check_bookings(facilityID):
    try:
        condition = {
            "$and": [
                {'facilityID': int(facilityID)},
            ]
        }
        if (request.args.get('endTime') != None):
            condition['$and'].append({'startTime': {'$lte': int(
                request.args.get('endTime'))}})

        if (request.args.get('startTime') != None):
            condition['$and'].append({'endTime': {'$gt': int(
                request.args.get('startTime'))}})

        pipeline = [
            {'$match':
                condition
             },
            {'$lookup': {
                'from': 'Profiles',
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
        return {"err": str(e), "status": "failed"}, 400

    return make_response(response)


@ facilities_api.route('/bookings', methods=['POST'])
@ cross_origin(supports_credentials=True)
def add_booking():
    try:
        formData = request.get_json()

        if (not request.args.get("token")):
            raise Exception("No token")

        if (not authenticate(request.args.get("token"), formData["userID"])):
            raise Exception("Authentication Failure")

        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])

        formData["facilityID"] = int(formData["facilityID"])
        if not formData.get("ccaID"):
            formData["ccaID"] = int(0)
        else:
            formData["ccaID"] = int(formData["ccaID"])

        if (formData["endTime"] <= formData["startTime"]):
            raise Exception("End time earlier than start time")

        if (not formData.get("repeat")):
            formData["repeat"] = 1

        # Handle repeats
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

        conflict = db.Bookings.find(
            {
                "facilityID": formData.get("facilityID"),
                "$or": condition
            }
        )

        if (len(conflict) > 0):
            return make_response({"err": "Conflicted booking with previous bookings.", "conflict_bookings": conflict, "status": "failed"}, 409)

        if formData['facilityID'] == 15 and not db.UserCCA.find_one({'userID': formData['userID'], 'ccaID': 3}):
            return make_response({"err": "You must be in RH Dance to make this booking", "status": "failed"}, 403)

        lastbookingID = list(db.Bookings.find().sort(
            [('_id', pymongo.DESCENDING)]).limit(1))
        newBookingID = 1 if len(lastbookingID) == 0 else int(
            lastbookingID[0].get("bookingID")) + 1

        formData["bookingID"] = newBookingID

        insertData = []
        for i in range(formData["repeat"]):
            insertData.append(formData.copy())
            formData["bookingID"] += 1
            formData["startTime"] += 7 * 24 * 60 * 60
            formData["endTime"] += 7 * 24 * 60 * 60

        db.Bookings.insert(insertData)

        response = {"status": "success"}

        # Logging
        formData["action"] = "Add Booking"
        formData["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        db.BookingLogs.insert_one(formData)

    except Exception as e:
        print(e)
        return {"err": str(e), "status": "failed"}, 400

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

        data = list(db.Bookings.find({"bookingID": int(bookingID)}))

        conflict = db.Bookings.find(
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
            }
        )

        if (len(conflict) > 0):
            return make_response({"err": "Conflicted booking with previous bookings.", "conflict_bookings": conflict, "status": "failed"}, 409)

        if (len(data) == 0):
            raise Exception("Booking not found")

        if (not request.args.get("token")):
            raise Exception("No token")

        if (not authenticate(request.args.get("token"), data[0]['userID'])):
            raise Exception("Auth Failure")

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
        return {"err": str(e), "status": "failed"}, 400

    return make_response(response)


@ facilities_api.route('/bookings/<bookingID>', methods=['DELETE'])
@ cross_origin(supports_credentials=True)
def delete_booking(bookingID):
    try:

        data = db.Bookings.find_one({"bookingID": int(bookingID)})
        del data['_id']
        if (not request.args.get("token")):
            raise Exception("No token")

        if (not authenticate(request.args.get("token"), data['userID'])):
            raise Exception("Auth Failure")

        if (len(data) == 0):
            raise Exception("Booking not found")

        db.Bookings.delete_one(
            {"bookingID": int(bookingID)})
        # Logging
        data["action"] = "Delete Booking"
        data["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        db.BookingLogs.insert_one(data)
        response = {"status": "success"}
    except Exception as e:
        print(e)
        return {"err": str(e), "status": "failed"}, 400

    return make_response(response)


@ facilities_api.route('/users/telegramID/<userID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def user_telegram(userID):
    try:
        profile = db.Profiles.find_one({"userID": userID})
        telegramHandle = profile.get(
            'telegramHandle') if profile else "No User Found"

        if (telegramHandle == "No User Found"):
            raise Exception("User not found")
        response = {"status": "success", "data": telegramHandle}
    except Exception as e:
        print(e)
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@ facilities_api.route('/bookings/blockout', methods=["POST"])
@ cross_origin(supports_credentials=True)
def blockout():
    try:
        if (not request.args.get("token")):
            raise Exception("No token")

        if (not authenticate(request.args.get("token"), "RH_JCRC")):
            raise Exception("Auth Failure")
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
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)