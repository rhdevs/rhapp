from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

import pymongo
import json
from datetime import datetime


def removeObjectID(xs):
    for i, item in enumerate(xs, start=0):
        del xs[i]["_id"]
    return xs


def listToIndexedDict(xs):
    output = {}
    for i, item in enumerate(xs, start=0):
        del xs[i]["_id"]
        output[i] = item
    return output


# MongoDB
myclient = client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]

CROSS_ORIGINS_LIST = "https://rhapp.cjunxiang.vercel.app"

# Flask
app = Flask("rhapp")
CORS(app, origins=CROSS_ORIGINS_LIST, headers=['Content-Type'],
     expose_headers=['Access-Control-Allow-Origin'], supports_credentials=True)

# Session
session = {}
# session format : {userID: {
#                           sessionID: VALUE
#                           startTime : VALUE
#                           expiry : VALUE
#                  }}


@app.route('/')
@cross_origin()
def root_route():
    return 'What up losers'


@app.route('/facilities/all/')
@cross_origin()
def all_facilities():
    try:
        data = removeObjectID(list(db.Facilities.find()))

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    response = make_response(json.dumps(
        list(data), default=lambda o: str(o)), 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


@app.route('/facility/<facilityID>')
@cross_origin()
def get_facility_name(facilityID):
    try:
        data = removeObjectID(
            list(db.Bookings.find({"facilityID": int(facilityID)})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/bookings/user/<userID>')
def user_bookings(userID):
    try:
        data = removeObjectID(list(db.Bookings.find({"userID": userID})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/bookings')
@cross_origin()
def get_all_bookings():
    try:
        data = removeObjectID(list(db.Bookings.find({})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/booking/<bookingID>')
@cross_origin()
def get_one_booking(bookingID):
    try:
        data = removeObjectID(
            list(db.Bookings.find({"bookingID": int(bookingID)})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/bookings/facility/<facilityID>/')
def check_bookings(facilityID):
    try:
        data = removeObjectID(list(db.Bookings.find({"facilityID": int(facilityID),
                                                     "startTime": {"$gte": int(request.args.get('startDate'))}, "endTime": {"$lte": int(request.args.get('endDate'))}})))
    except Exception as e:
        return {"err": str(e)}, 400

    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/users/telegramID/<userID>')
@cross_origin(supports_credentials=True)
def user_telegram(userID):
    try:
        profile = db.Profiles.find_one({"userID": userID})
        telegramHandle = profile.get(
            'telegramHandle') if profile else "No User Found"
        data = {"telegramHandle": telegramHandle}

        if (telegramHandle == "No User Found"):
            return {"err": "No User Found"}, 400
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return data, 200


@app.route('/bookings', methods=['POST'])
def add_booking():
    try:
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
        formData = request.get_json()
        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])

        formData["facilityID"] = int(formData["facilityID"])
        formData["ccaID"] = int(formData["ccaID"])

        if (formData["endTime"] < formData["startTime"]):
            raise Exception("End time eariler than start time")
        # else:
        #     return {"err": "Unauthorised Access"}, 401

        # Check for exisiting booking
        # x1 <= y2 && y1 <= x2 because ranges are well-formed
        conflict = removeObjectID(list(db.Bookings.find({"facilityID": formData.get("facilityID"),
                                                         "endTime": {
                                                             "$gte": formData.get('startTime')},
                                                         "startTime": {
                                                             "$lte": formData.get('endTime')}
                                                         })))

        if (len(conflict) != 0):
            raise Exception("Conflict Booking")

        lastbookingID = list(db.Bookings.find().sort(
            [('_id', pymongo.DESCENDING)]).limit(1))
        newBookingID = 1 if len(lastbookingID) == 0 else int(
            lastbookingID[0].get("bookingID")) + 1

        formData["bookingID"] = newBookingID
        db.Bookings.insert_one(formData)

    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

    return {"message": "Booking Confirmed"}, 200


@app.route('/bookings/<bookingID>', methods=['GET'])
def get_booking(bookingID):
    try:
        data = removeObjectID(
            list(db.Bookings.find({"bookingID": int(bookingID)})))
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/bookings/<bookingID>', methods=['PUT'])
def edit_booking(bookingID):
    try:
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
        db.Bookings.update_one({"bookingID": int(bookingID)}, {
                               "$set": request.get_json()})

        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

    return {"message": "Booking edited"}, 200


@app.route('/bookings/<bookingID>', methods=['DELETE'])
def delete_booking(bookingID):
    try:
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0].get('userID') :
        db.Bookings.delete_one({"bookingID": int(bookingID)})
        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

    return {"message": "Booking Deleted"}, 200


if __name__ == '__main__':
    # app.run(threaded=True, debug=True)
    app.run('0.0.0.0', port=8080)
