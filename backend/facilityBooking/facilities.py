from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
import pymongo
import json
from datetime import datetime
from threading import Thread
from bson.objectid import ObjectId


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


@app.route('/supper', methods=['GET'])
@cross_origin(supports_credentials=True)
def all_supper_group():
    try:
        all_supper_group = list(db.SupperGroup.find(
            {}, {'supperGroupId': 1, '_id': 0}).sort('createdAt', -1))

        print(all_supper_group)

        # I hate mongo

        data = []
        for supperGroup in all_supper_group:
            pipeline = [
                {'$match': {'supperGroupId': supperGroup['supperGroupId']}},
                {
                    '$lookup': {
                        'from': 'Order',
                        'localField': 'supperGroupId',
                        'foreignField': 'supperGroupId',
                        'as': 'orders'
                    }
                },
                {
                    '$addFields': {
                        'totalPrice': {'$sum': '$orders.orderPrice'}
                    }
                },
                {'$project': {'orders': 0, '_id': 0}}
            ]
            result = db.SupperGroup.aggregate(pipeline)
            info = None
            for suppergroup in result:
                info = suppergroup

            if info == None:
                raise Exception('Order group not found.')
            data.append(info)

        response = {"status": "success", "data": data}

        return make_response(response, 200)
    except Exception as e:
        return make_response({"status": "failed", "err": str(e)}, 400)

<<<<<<< HEAD
=======

@app.route('/supper/supperGroup', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_supper_group():
    try:
        data = request.get_json()
        data["createdAt"] = int(datetime.now().timestamp())
        db.SupperGroup.insert_one(data)

        response = {"status": "success",
                    "message": "Successfully created supper group!"}

        return make_response(response, 200)
    except Exception as e:
        return make_response({"status": "failed", "err": str(e)}, 400)

>>>>>>> 6025c470d (Add restaurant routes)

@app.route('/supper/supperGroup/<int:supperGroupId>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin(supports_credentials=True)
def supper_group(supperGroupId):
    try:
        if request.method == "GET":
            pipeline = [
                {'$match': {'supperGroupId': supperGroupId}},
                {
                    '$lookup': {
                        'from': 'Order',
                        'localField': 'supperGroupId',
                        'foreignField': 'supperGroupId',
                        'as': 'orders'
                    }
                },
                {
                    '$addFields': {
                        'totalPrice': {'$sum': '$orders.orderPrice'}
                    }
                },
                {'$project': {'orders': 0, '_id': 0}}
            ]

            result = db.SupperGroup.aggregate(pipeline)

            data = None
            for suppergroup in result:
                data = suppergroup

            if data == None:
                raise Exception('Order group not found.')

            response = {"status": "success", "data": data}

        elif request.method == "PUT":  # Edit supper group details
            formData = request.get_json()

            db.SupperGroup.update_one({"supperGroupId": supperGroupId}, {
                "$set": formData})

            response = {"status": "success", "message": "Supper Group edited"}
        elif request.method == "DELETE":
            data = db.SupperGroup.find({'supperGroupId': supperGroupId})

            if (len(data) == 0):
                raise Exception("Supper group not found")

            db.SupperGroup.delete_one({"supperGroupId": supperGroupId})
            db.Order.delete_many({'supperGroupId': supperGroupId})
            response = {"status": "success", "message": "Supper Group Deleted"}

        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/order', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_order():
    try:
        data = request.get_json()
        db.Order.insert_one(data)
        response = {"status": "success",
                    "message": "Order created successfully."}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/order/<orderId>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin(supports_credentials=True)
def getorder(orderId):
    try:
        if request.method == 'GET':
            pipeline = [
                {'$match': {"_id": ObjectId(orderId)}},
                {
                    '$lookup': {
                        'from': 'FoodOrder',
                        'localField': 'foodIds',
                        'foreignField': '_id',
                        'as': 'foodList'
                    }
                },
                {'$project': {'foodIds': 0}}
            ]

            temp = db.Order.aggregate(pipeline)

            # Only 1 item in temp, can only access it like this otherwise its a mongo array object
            for item in temp:
                data = item

            data['orderId'] = str(data.pop('_id'))

            for food in data["foodList"]:
                # rename _id field to foodId and unbox mongo object
                food["foodId"] = str(food.pop('_id'))

            response = {"status": "success", "data": data}
        elif request.method == 'PUT':
            data = request.get_json()
            db.Order.update_one({"_id": ObjectId(orderId)},
                                {"$set": data})

            response = {"status": "success",
                        "message": "Successfully edited order!"}

        elif request.method == 'DELETE':

            result = db.Order.delete_one({"_id": ObjectId(orderId)})
            if result.deleted_count == 0:
                raise Exception("Order not found")

            response = {"status": "success",
                        "message": "Successfully deleted order!"}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/order/<orderId>/food', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_food(orderId):
    try:
        data = request.get_json()
        # Add food into FoodOrder
        newFood = db.FoodOrder.insert_one(data).inserted_id

        # Add new food's id into Order
        result = db.Order.update_one({'_id': ObjectId(orderId)},
                                     {'$push': {'foodIds': ObjectId(newFood)},
                                     '$inc': {'orderPrice': data['foodPrice']}})
        if result.matched_count != 1:
            raise Exception('Order not found.')
        if result.modified_count != 1:
            raise Exception('Update failed.')

        response = {"status": "success",
                    "message": "Food added successfully."}

        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/order/<orderId>/food/<foodId>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin(supports_credentials=True)
def foodorder(orderId, foodId):
    try:
        if request.method == 'GET':
            # Route doesn't seem necessary
            data = {}
            response = {"status": "success", "data": data}
        elif request.method == 'PUT':
            data = request.get_json()
            result = db.FoodOrder.update_one({"_id": ObjectId(foodId)},
                                             {"$set": data})

            if result.matched_count == 0:
                raise Exception('Food not found')

            response = {"status": "success",
                        "message": "Successfully edited food!"}

        elif request.method == 'DELETE':
            data = db.Order.find_one({'_id': ObjectId(orderId)})
            if data == None:
                raise Exception("Order not found")

            result = db.FoodOrder.delete_one({"_id": ObjectId(foodId)})
            if result.deleted_count == 0:
                raise Exception("Food not found")

            data["foodIds"].remove(ObjectId(foodId))

            db.Order.update_one({'_id': ObjectId(orderId)}, {'$set': data})

            response = {"status": "success",
                        "message": "Successfully deleted food!"}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant', methods=['GET'])
@cross_origin(supports_credentials=True)
def all_restaurants():
    try:
        restaurants = db.Restaurants.find({}, {'_id': 0})
        response = {"status": "success", "data": list(
            restaurants)}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant/<int:restaurantId>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_restaurant(restaurantId):
    try:
        restaurant = db.Restaurants.find_one(
            {'restaurantId': restaurantId}, {'_id': 0})
        response = {"status": "success", "data": restaurant}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant/<int:restaurantId>/menu', methods=['GET'])
@cross_origin(supports_credentials=True)
def restaurant(restaurantId):
    try:
        pipeline = [
            {'$match': {'restaurantId': restaurantId}},
            {
                '$lookup': {
                    'from': 'FoodMenu',
                    'localField': 'restaurantId',
                    'foreignField': 'restaurantId',
                    'as': 'menu'
                }
            },
            {'$project': {'_id': 0, 'menu._id': 0}}
        ]

        data = db.Restaurants.aggregate(pipeline)

        restaurant = None
        for item in data:
            restaurant = item

        response = {"status": "success", "data": restaurant}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant/food/<int:foodMenuId>', methods=['GET'])
@cross_origin(supports_credentials=True)
def foodItem(foodMenuId):
    try:
        data = db.FoodMenu.find_one({"foodMenuId": foodMenuId}, {'_id': 0})
        response = {"status": "success", "data": data}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/user/<userID>/orderHistory', methods=['GET'])
@cross_origin(supports_credentials=True)
def user_order_history(userID):
    try:
        pipeline = [
            {'$match': {"userID": userID}},
            {
                '$lookup': {
                    'from': 'FoodOrder',
                    'localField': 'foodIds',
                    'foreignField': '_id',
                    'as': 'foodList'
                }
            },
            {'$project': {'foodIds': 0}}
        ]

        orders = db.Order.aggregate(pipeline)

        data = []
        for order in orders:
            order['orderId'] = str(order.pop('_id'))
            for food in order["foodList"]:
                food["foodId"] = str(food.pop('_id'))
            data.append(order)

        response = {"status": "success", "data": data}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


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
