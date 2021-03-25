from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
import pymongo
import json
from datetime import datetime
from threading import Thread


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


# Hello autistic comment here
# MongoDB
myclient = client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]

# Flask
app = Flask("rhapp")
CORS(app, resources={r"/*": {"origins": "*"}})
# resources allowed to be accessed explicitly
# response.headers.add("Access-Control-Allow-Origin", "*"), add this to all responses
# if the cors still now working
app.config['CORS_HEADERS'] = 'Content-Type'

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


@app.route('/facilities/all')
@cross_origin(supports_credentials=True)
def all_facilities():
    try:
        data = removeObjectID(list(db.Facilities.find()))
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/facility/<facilityID>')
@cross_origin(supports_credentials=True)
def get_facility_name(facilityID):
    try:
        data = removeObjectID(
            list(db.Facilities.find({"facilityID": int(facilityID)})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/bookings', methods=["GET"])
@cross_origin(supports_credentials=True)
def get_all_bookings():
    try:
        data = removeObjectID(list(db.Bookings.find({})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/booking/<bookingID>', methods=["GET"])
@cross_origin(supports_credentials=True)
def get_one_booking(bookingID):
    try:
        data = removeObjectID(
            list(db.Bookings.find({"bookingID": int(bookingID)})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(data, default=lambda o: str(o)), 200)


@app.route('/bookings/user/<userID>')
@cross_origin(supports_credentials=True)
def user_bookings(userID):
    try:
        data = removeObjectID(list(db.Bookings.find({"userID": userID})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)


@app.route('/bookings/facility/<facilityID>/')
@cross_origin(supports_credentials=True)
def check_bookings(facilityID):
    try:
        data = removeObjectID(list(db.Bookings.find({"facilityID": int(facilityID), "startTime": {"$gte": int(
            request.args.get('startDate'))}, "endTime": {"$lte": int(request.args.get('endDate'))}})))
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
@cross_origin(supports_credentials=True)
def add_booking():
    try:
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
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
@cross_origin(supports_credentials=True)
def get_booking(bookingID):
    try:
        data = listToIndexedDict(
            list(db.Bookings.find({"bookingID": int(bookingID)})))
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return data, 200


@app.route('/bookings/<bookingID>', methods=['PUT'])
@cross_origin(supports_credentials=True)
def edit_booking(bookingID):
    try:
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
        formData = request.get_json()
        if not formData.get("ccaID"):
            formData["ccaID"] = int(0)
        else:
            formData["ccaID"] = int(formData["ccaID"])
        db.Bookings.update_one({"bookingID": int(bookingID)}, {
                               "$set": request.get_json()})

        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

    return {"message": "Booking edited"}, 200


@app.route('/bookings/<bookingID>', methods=['DELETE'])
@cross_origin(supports_credentials=True)
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


@app.route('/supper', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def all_supper_group():
    try:
        if request.method == 'GET':
            all_supper_group = db.SupperGroup.find()

            return make_response(json.dumps(list(all_supper_group), default=lambda o: str(o)), 200)
        elif request.method == 'POST':
            data = request.get_json()
            db.SupperGroup.insert_one(data)

            response = {"message": "Successfully created supper group!"}

            return make_response(json.dumps(response, default=lambda o: str(o)), 200)
    except Exception as e:
        return make_response({"err": str(e)}, 400)


@app.route('/supper/<int:supperGroupId>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@cross_origin(supports_credentials=True)
def supper_group(supperGroupId):
    try:
        if request.method == "GET":
            data = listToIndexedDict(
                list(db.SupperGroup.find({"supperGroupId": supperGroupId})))
            return make_response(json.dumps(list(data), default=lambda o: str(o)), 200)

        elif request.method == "POST":  # Add new order into Order
            formData = request.get_json()
            db.Order.insert_one(formData)
            return {"message": "Order submitted!"}, 200

        elif request.method == "PUT":  # Edit supper group details
            formData = request.get_json()
            db.SupperGroup.update_one({"supperGroupId": supperGroupId}, {
                "$set": formData})
            return {"message": "Supper Group edited"}, 200
        elif request.method == "DELETE":
            db.SupperGroup.delete_one({"supperGroupId": supperGroupId})
            return {"message": "Supper Group Deleted"}, 200

    except Exception as e:
        print(e)
        return make_response({"err": str(e)}, 400)

###########################################################


def keep_alive():
    t = Thread(target=run)
    t.start()


def run():
    app.run(host='0.0.0.0', port=8080)


keep_alive()

if __name__ == '__main__':
    app.run(threaded=True, debug=True)
#   keep_alive();
#   app.run('0.0.0.0', port=8080)
