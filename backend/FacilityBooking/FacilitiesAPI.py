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


@ facilities_api.route('/bookings/<bookingID>', methods=["GET"])
@ cross_origin(supports_credentials=True)
def get_one_booking(bookingID):
    try:
        data = list(db.Bookings.find(
            {"bookingID": int(bookingID)}, {"_id": 0}))
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
        data = list(db.Bookings.find({"userID": userID}, {
                    "_id": 0}).sort([("startTime", 1)]))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400
    return make_response(response)


@ facilities_api.route('/bookings/facility/<facilityID>/', methods=["GET"])
@ cross_origin(supports_credentials=True)
def check_bookings(facilityID):
    try:
        data = list(db.Bookings.find({"facilityID": int(facilityID), "startTime": {"$gte": int(
            request.args.get('startTime'))}, "endTime": {"$lte": int(request.args.get('endTime'))}}, {"_id": 0}).sort([("startTime", 1)]))
        response = {"status": "success", "data": data}
    except Exception as e:
        return {"err": str(e), "status": "failed"}, 400

    return make_response(response)


@ facilities_api.route('/bookings', methods=['POST'])
@ cross_origin(supports_credentials=True)
def add_booking():
    try:
        formData = request.get_json()
        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])

        formData["facilityID"] = int(formData["facilityID"])
        if not formData.get("ccaID"):
            formData["ccaID"] = int(0)
        else:
            formData["ccaID"] = int(formData["ccaID"])

        if (formData["endTime"] < formData["startTime"]):
            raise Exception("End time eariler than start time")

        conflict = list(db.Bookings.find({"facilityID": formData.get("facilityID"),
                                          "endTime": {
            "$gt": formData.get('startTime')},
            "startTime": {
            "$lt": formData.get('endTime')}
        }, {"_id": 0}))

        if (len(conflict) != 0):
            raise Exception("Conflict Booking")

        lastbookingID = list(db.Bookings.find().sort(
            [('_id', pymongo.DESCENDING)]).limit(1))
        newBookingID = 1 if len(lastbookingID) == 0 else int(
            lastbookingID[0].get("bookingID")) + 1

        formData["bookingID"] = newBookingID
        db.Bookings.insert_one(formData)
        response = {"status": "success"}

        # Logging
        formData["action"] = "Add Booking"
        formData["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        db.BookingLogs.insert_one(formData)

    except Exception as e:
        print(e)
        return {"err": str(e), "status": "failed"}, 400

    return make_response(response)


@ facilities_api.route('/bookings/<bookingID>', methods=['GET'])
@ cross_origin(supports_credentials=True)
def get_booking(bookingID):
    try:
        data = list(db.Bookings.find(
            {"bookingID": int(bookingID)}, {"_id": 0}))
        response = {"status": "success", "data": data}
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

        if (len(data) == 0):
            raise Exception("Booking not found")

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

        data = list(db.Bookings.find({"bookingID": int(bookingID)}))

        if (len(data) == 0):
            raise Exception("Booking not found")

        db.Bookings.delete_one({"bookingID": int(bookingID)})

        # Logging
        formData = {}
        formData["action"] = "Delete Booking"
        formData["timeStamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        formData["bookingID"] = bookingID
        db.BookingLogs.insert_one(formData)

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
