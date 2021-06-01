from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
import pymongo
import json
from bson.json_util import dumps
from datetime import datetime
from threading import Thread
from bson.objectid import ObjectId
import copy


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


def make_hash(o):
    """
    Makes a hash from a dictionary, list, tuple or set to any level, that contains
    only other hashable types (including any lists, tuples, sets, and
    dictionaries).
    """

    if isinstance(o, (set, tuple, list)):

        return tuple([make_hash(e) for e in o])

    elif not isinstance(o, dict):

        return hash(o)

    new_o = copy.deepcopy(o)
    for k, v in new_o.items():
        new_o[k] = make_hash(v)

    return hash(tuple(frozenset(sorted(new_o.items()))))


# MongoDB\
myclient = client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")

# for leewah
# import ssl
# myclient = client = pymongo.MongoClient(
#     "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority",
#     ssl_cert_reqs=ssl.CERT_NONE)

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


###########################################################


@app.route('/supper/supperGroup', methods=['GET'])
@cross_origin(supports_credentials=True)
def all_supper_group():
    try:
        pipeline = [
            {
                '$lookup': {
                    'from': 'Order',
                    'localField': 'supperGroupId',
                    'foreignField': 'supperGroupId',
                    'as': 'orderList'
                }
            },
            {
                '$lookup': {
                    'from': 'Restaurants',
                    'localField': 'restaurantName',
                    'foreignField': 'name',
                    'as': 'restaurant'
                }
            },
            {
                '$unwind': {'path': '$restaurant'}
            },
            {
                '$addFields': {
                    'totalPrice': {'$sum': '$orderList.totalCost'},
                    'numOrders': {'$size': '$orderList'},
                    'restaurantLogo': '$restaurant.restaurantLogo',
                    'restaurantId': '$restaurant._id'
                }
            },
            {'$project': {'orderList': 0, '_id': 0, 'restaurant': 0}}
        ]

        result = db.SupperGroup.aggregate(pipeline)

        data = []
        currentTime = int(datetime.now().timestamp())
        for supperGroup in result:
            if supperGroup.get('status') == 'open' and supperGroup.get('closingTime') <= currentTime:
                # Checks if closingTime has passed. If so, set status to closed.
                supperGroup['status'] = 'closed'
                query = {'supperGroupId': supperGroup.get('supperGroupId')}
                changes = {'$set': {'status': 'closed'}}
                db.SupperGroup.update_one(query, changes)
            data.append(supperGroup)
            supperGroup['restaurantId'] = str(supperGroup.pop('restaurantId'))

        data.sort(key=lambda x: x.get('createdAt'), reverse=True)

        response = {"status": "success", "data": data}
        return make_response(response, 200)
    except Exception as e:
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/supperGroup', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_supper_group():
    try:
        data = request.get_json()

        # auto-increment supperGroupId
        lastsupperGroupID = list(db.SupperGroup.find().sort(
            [('supperGroupId', pymongo.DESCENDING)]).limit(1))
        newsupperGroupID = 1 if len(lastsupperGroupID) == 0 else int(
            lastsupperGroupID[0].get("supperGroupId")) + 1

        data["supperGroupId"] = newsupperGroupID
        data["createdAt"] = int(datetime.now().timestamp())
        db.SupperGroup.insert_one(data)
        data['_id'] = str(data.pop('_id'))
        response = {"status": "success",
                    "message": "Successfully created supper group!",
                    "data": data}

        return make_response(response, 200)
    except Exception as e:
        return make_response({"status": "failed", "err": str(e)}, 400)


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
                        'as': 'orderList'
                    }
                },
                {
                    '$lookup': {
                        'from': 'Restaurants',
                        'localField': 'restaurantName',
                        'foreignField': 'name',
                        'as': 'restaurant'
                    }
                },
                {
                    '$unwind': {'path': '$restaurant'}
                },
                {
                    '$lookup': {
                        'from': 'FoodOrder',
                        'localField': 'orderList.foodIds',
                        'foreignField': '_id',
                        'as': 'foodList'
                    }
                },
                {
                    '$addFields': {
                        'totalPrice': {'$sum': '$orderList.totalCost'},
                        'numOrders': {'$size': '$orderList'},
                        'restaurantLogo': '$restaurant.restaurantLogo',
                        'restaurantId': '$restaurant._id',
                        'orderList.foodList': [],
                        'userIdList': {'$concatArrays': '$orderList.userID'}
                    }
                },
                {
                    '$lookup': {
                        'from': 'Profiles',
                        'localField': 'userIdList',
                        'foreignField': 'userID',
                        'as': 'userList'
                    }
                },
                {'$project': {'_id': 0, 'restaurant': 0, 'orderList._id': 0,
                              'foodList.foodMenuId': 0, 'foodList.restaurantId': 0
                              }
                 }
            ]

            result = db.SupperGroup.aggregate(pipeline)

            data = None
            for suppergroup in result:
                data = suppergroup
                suppergroup['restaurantId'] = str(suppergroup.pop('restaurantId'))

                for order in data['orderList']:
                    order['foodIds'] = list(
                        map(lambda x: str(x), order['foodIds']))

                for food in data['foodList']:
                    food['_id'] = str(food['_id'])
                    for order in data['orderList']:
                        if food['_id'] in order['foodIds']:
                            order['foodList'].append(food)
                            order['foodIds'].remove(food['_id'])

                for user in data['userList']:
                    user['_id'] = str(user['_id'])
                    for order in data['orderList']:
                        if user['userID'] == order['userID']:
                            order['user'] = user

                data.pop('userList')

                data.pop('foodList')
                for order in data['orderList']:
                    order.pop('foodIds')

            currentTime = int(datetime.now().timestamp())
            if data == None:
                raise Exception('Order group not found.')

            elif data.get('status') == 'open' and data.get('closingTime') <= currentTime:
                # Checks if closingTime has passed. If so, set status to closed.
                data['status'] = 'closed'
                query = {'supperGroupId': data.get('supperGroupId')}
                changes = {'$set': {'status': 'closed'}}
                db.SupperGroup.update_one(query, changes)

            response = {"status": "success", "data": data}

        elif request.method == "PUT":  # Edit supper group details
            data = request.get_json()

            db.SupperGroup.update_one({"supperGroupId": supperGroupId},
                                      {"$set": data})

            response = {"status": "success",
                        "message": "Supper Group edited",
                        "data": data}

        elif request.method == "DELETE":

            foodIdList = list(db.Order.find(
                {'supperGroupId': supperGroupId}, {'foodIds': 1, '_id': 0}))
            foods = [food.get('foodIds') for food in foodIdList]

            remove = db.SupperGroup.delete_one(
                {"supperGroupId": supperGroupId}).deleted_count
            if remove == 0:
                raise Exception("Supper group not found")
            db.Order.delete_many({'supperGroupId': supperGroupId})
            db.FoodOrder.delete_many({'_id': {'$in': foods}})
            response = {"status": "success",
                        "message": "Supper Group Deleted"}

        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/order', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_order():
    try:
        data = request.get_json()
        data["createdAt"] = int(datetime.now().timestamp())
        data['hasPaid'] = False
        data['hasReceived'] = False
        db.Order.insert_one(data)
        data['orderId'] = str(data.pop('_id'))

        response = {"status": "success",
                    "message": "Order created successfully.",
                    "data": data}

        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/order/<orderId>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin(supports_credentials=True)
def get_order(orderId):
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
                {
                    '$lookup': {
                        'from': 'Profiles',
                        'localField': 'userID',
                        'foreignField': 'userID',
                        'as': 'user'
                    }
                },
                {'$project': {'foodIds': 0}}
            ]

            temp = db.Order.aggregate(pipeline)

            # Only 1 item in temp, can only access it like this otherwise its a mongo array object
            for item in temp:
                data = item
            data['orderId'] = str(data.pop('_id'))
            for user in data["user"]:
                user['_id'] = str(user.pop('_id'))
            for food in data["foodList"]:
                # rename _id field to foodId and unbox mongo object
                food["foodId"] = str(food.pop('_id'))
                food['restaurantId'] = str(food.pop('restaurantId'))
                food['foodMenuId'] = str(food.pop('foodMenuId'))

            response = {"status": "success", "data": data}
        elif request.method == 'PUT':
            data = request.get_json()
            db.Order.update_one({"_id": ObjectId(orderId)},
                                {"$set": data})

            response = {"status": "success",
                        "message": "Successfully edited order!",
                        "data": data}

        elif request.method == 'DELETE':
            foodIdList = list(db.Order.find(
                {'_id': ObjectId(orderId)}, {'foodIds': 1, '_id': 0}))
            foods = [food.get('foodIds') for food in foodIdList]

            result = db.Order.delete_one({"_id": ObjectId(orderId)})
            if result.deleted_count == 0:
                raise Exception("Order not found")

            db.FoodOrder.delete_many({'_id': {'$in': foods}})

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

        # Calculating foodPrice of new food
        data['foodPrice'] = data['price']
        for custom in data['custom']:
            for option in custom['options']:
                if option['isSelected']:
                    data['foodPrice'] += option['price']
                    break
                else:
                    continue
        data['foodPrice'] = data['foodPrice'] * data['quantity']

        # Wrapping IDs for Mongo
        data['restaurantId'] = ObjectId(data['restaurantId'])
        data['foodMenuId'] = ObjectId(data['foodMenuId'])

        # Add food into FoodOrder
        db.FoodOrder.insert_one(data)

        # Unwrapping IDs for JSON
        newFood = data['foodId'] = str(data.pop('_id'))
        data['restaurantId'] = str(data['restaurantId'])
        data['foodMenuId'] = str(data['foodMenuId'])
        
        # Add new food's id into Order
        result = db.Order.update_one({'_id': ObjectId(orderId)},
                                     {'$push': {'foodIds': ObjectId(newFood)},
                                      '$inc': {'totalCost': data['foodPrice']}})

        if result.matched_count == 0:
            raise Exception('Order not found.')
        if result.modified_count == 0:
            raise Exception('Update failed.')



        response = {"status": "success",
                    "message": "Food added successfully.",
                    "data": data}

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
            response = {"status": "success",
                        "data": data}
        elif request.method == 'PUT':
            data = request.get_json()
            food_result = db.FoodOrder.find_one_and_update({"_id": ObjectId(foodId)},
                                                           {"$set": data})

            if food_result is None:
                raise Exception('Food not found')

            order_result = db.Order.find_one_and_update({"_id": ObjectId(orderId)},
                                                        {"$inc": {"totalCost": data['foodPrice'] -
                                                                                food_result['foodPrice']}})
            if order_result is None:
                raise Exception('Failed to update order')

            response = {"status": "success",
                        "message": "Successfully edited food!",
                        "data": data}

        elif request.method == 'DELETE':
            # Delete food from collection
            deleted_food = db.FoodOrder.find_one_and_delete(
                {"_id": ObjectId(foodId)})

            if deleted_food is None:
                raise Exception("Food not found")

            # Delete food id from Order, update totalCost
            data = db.Order.find_one_and_update({'_id': ObjectId(orderId)},
                                                {'$pull': {'foodIds': deleted_food['_id']},
                                                 '$inc': {'totalCost': -deleted_food['foodPrice']}})

            if data is None:
                raise Exception("Failed to update order")

            data['orderId'] = str(data.pop('_id'))
            data['foodIds'] = [str(foodId) for foodId in data['foodIds']]
            # find_one_and_update returns document before updating
            # removing the deleted foodId here to keep consistent
            data['foodIds'].remove(str(deleted_food['_id']))

            response = {"status": "success",
                        "message": "Successfully deleted food!",
                        "data": data}

        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def all_restaurants():
    try:
        if request.method == 'GET':
            restaurants = list(db.Restaurants.find({}, {'restaurantLogo': 0}))
            for restaurant in restaurants:
                restaurant['restaurantId'] = str(restaurant.pop('_id'))

            response = {"status": "success", "data": restaurants}

        elif request.method == 'POST':
            data = request.get_json()
            # Add restaurant into Restaurants
            db.Restaurants.insert_one(data)
            data['restaurantId'] = str(data.pop('_id'))

            response = {"status": "success",
                        "message": "Restaurant added successfully.",
                        "data": data}

        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant/<restaurantId>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_restaurant(restaurantId):
    try:
        restaurant = db.Restaurants.find_one(
            {'_id': ObjectId(restaurantId)})
        restaurant['restaurantId'] = str(restaurant.pop('_id'))
        response = {"status": "success", "data": restaurant}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant/<restaurantId>/menu', methods=['GET'])
@cross_origin(supports_credentials=True)
def restaurant(restaurantId):
    try:
        if request.method == "GET":
            pipeline = [
                {'$match': {'_id': ObjectId(restaurantId)}},
                {
                    '$lookup': {
                        'from': 'FoodMenu',
                        'localField': '_id',
                        'foreignField': 'restaurantId',
                        'as': 'menu'
                    }
                },
                {'$project': {'menu.restaurantId': 0}}
            ]

            temp = db.Restaurants.aggregate(pipeline)
            for item in temp:
                restaurantInfo = item
            restaurantInfo['restaurantId'] = str(restaurantInfo.pop('_id'))
            for food in restaurantInfo['menu']:
                food['foodMenuId'] = str(food.pop('_id'))

            response = {"status": "success", "data": restaurantInfo}
            return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/restaurant/food/<foodMenuId>', methods=['GET'])
@cross_origin(supports_credentials=True)
def foodItem(foodMenuId):
    try:
        data = db.FoodMenu.find_one({"_id": ObjectId(foodMenuId)})
        data['restaurantId'] = str(data.pop('restaurantId'))
        data['foodMenuId'] = str(data.pop('_id'))
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
            # {
            #     '$lookup': {
            #         'from': 'Profiles',
            #         'localField': 'userID',
            #         'foreignField': 'userID',
            #         'as': 'userList'
            #     }
            # },
            {'$project': {'foodIds': 0}}
        ]

        orderList = db.Order.aggregate(pipeline)

        data = []
        for order in orderList:
            order['orderId'] = str(order.pop('_id'))
            # order['user']['_id'] = str(order['user']['_id'])
            for food in order["foodList"]:
                food["foodId"] = str(food.pop('_id'))
                food["restaurantId"] = str(food.pop('restaurantId'))
                food["foodMenuId"] = str(food.pop('foodMenuId'))

            data.append(order)

        data.sort(key=lambda x: x.get('createdAt'), reverse=True)

        response = {"status": "success", "data": data}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/user/<userID>/joinGroupHistory', methods=['GET'])
@cross_origin(supports_credentials=True)
def user_join_group_history(userID):
    try:
        supperGroups = list(db.Order.find(
            {'userID': userID}, {'_id': 0, 'supperGroupId': 1}))
        supperGroupIds = [supperGroup.get('supperGroupId')
                          for supperGroup in supperGroups]

        pipeline = [
            {"$match": {'supperGroupId': {"$in": supperGroupIds}}},
            {
                '$lookup': {
                    'from': 'Order',
                    'localField': 'supperGroupId',
                    'foreignField': 'supperGroupId',
                    'as': 'orderList'
                }
            },
            {
                '$lookup': {
                    'from': 'Restaurants',
                    'localField': 'restaurantName',
                    'foreignField': 'name',
                    'as': 'restaurant'
                }
            },
            {
                '$unwind': {'path': '$restaurant'}
            },
            {
                '$addFields': {
                    'totalPrice': {'$sum': '$orderList.totalCost'},
                    'numOrders': {'$size': '$orderList'},
                    'restaurantLogo': '$restaurant.restaurantLogo'
                }
            },
            {'$project': {'orderList': 0, '_id': 0, 'restaurant': 0}}
        ]

        result = db.SupperGroup.aggregate(pipeline)

        data = []
        for supperGroup in result:
            data.append(supperGroup)

        data.sort(key=lambda x: x.get('createdAt'), reverse=True)

        response = {"status": "success", "data": data}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/user/<userID>/supperGroupHistory', methods=['GET'])
@cross_origin(supports_credentials=True)
def user_supper_group_history(userID):
    try:
        pipeline = [
            {'$match': {'ownerId': userID}},
            {
                '$lookup': {
                    'from': 'Order',
                    'localField': 'supperGroupId',
                    'foreignField': 'supperGroupId',
                    'as': 'orderList'
                }
            },
            {
                '$lookup': {
                    'from': 'Restaurants',
                    'localField': 'restaurantName',
                    'foreignField': 'name',
                    'as': 'restaurant'
                }
            },
            {
                '$unwind': {'path': '$restaurant'}
            },
            {
                '$addFields': {
                    'totalPrice': {'$sum': '$orderList.totalCost'},
                    'numOrders': {'$size': '$orderList'},
                    'restaurantLogo': '$restaurant.restaurantLogo'
                }
            },
            {'$project': {'orderList': 0, '_id': 0, 'restaurant': 0}}
        ]

        result = db.SupperGroup.aggregate(pipeline)

        data = []
        for supperGroup in result:
            data.append(supperGroup)

        data.sort(key=lambda x: x.get('createdAt'), reverse=True)

        response = {"status": "success", "data": data}
        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/supperGroup/<int:supperGroupId>/collated', methods=['GET'])
@cross_origin(supports_credentials=True)
def collated_orders(supperGroupId):
    try:
        pipeline = [
            {'$match': {'supperGroupId': supperGroupId}},
            {
                '$lookup': {
                    'from': 'Order',
                    'localField': 'supperGroupId',
                    'foreignField': 'supperGroupId',
                    'as': 'orderList'
                }
            },
            {
                '$lookup': {
                    'from': 'FoodOrder',
                    'localField': 'orderList.foodIds',
                    'foreignField': '_id',
                    'as': 'foods'
                }
            },
            {'$project': {'orderList': 0, '_id': 0, 'foods._id': 0}},
        ]

        result = db.SupperGroup.aggregate(pipeline)

        data = None
        for item in result:
            data = item

        for food in data['foods']:
            food['customHash'] = make_hash(food['custom'])

        data['foods'].sort(key=lambda x: (x['foodMenuId'], x['customHash']))

        data['collatedOrderList'] = []
        for food in data['foods']:
            if not data['collatedOrderList']:
                data['collatedOrderList'].append(food)
            elif food['foodMenuId'] == data['collatedOrderList'][-1]['foodMenuId'] and food['customHash'] == \
                    data['collatedOrderList'][-1]['customHash']:
                data['collatedOrderList'][-1]['quantity'] += food['quantity']
            else:
                data['collatedOrderList'].append(food)

        data.pop('foods')
        for food in data['collatedOrderList']:
            food.pop('customHash')
            food['restaurantId'] = str(food['restaurantId'])
            food['foodMenuId'] = str(food['foodMenuId'])

        data = {key: data[key] for key in ('supperGroupId', 'ownerId', 'collatedOrderList') if key in data}

        response = {"status": "success", "data": data}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@app.route('/supper/supperGroup/<int:supperGroupId>/user/<userID>', methods=['GET'])
@cross_origin(supports_credentials=True)
def user_order(supperGroupId, userID):
    try:
        pipeline = [
            {'$match': {'userID': userID, 'supperGroupId': supperGroupId}},
            {
                '$lookup': {
                    'from': 'FoodOrder',
                    'localField': 'foodIds',
                    'foreignField': '_id',
                    'as': 'foodList'
                }
            },
            {
                '$lookup': {
                    'from': 'Profiles',
                    'localField': userID,
                    'foreignField': 'userID',
                    'as': 'user'
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
            food["restaurantId"] = str(food.pop('restaurantId'))
            food["foodMenuId"] = str(food.pop('foodMenuId'))

        response = {"status": "success", "data": data}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


###########################################################

# def keep_alive():
#     t = Thread(target=run)
#     t.start()


# def run():
#     app.run(host='0.0.0.0', port=8080)
#     app.run(threaded=True, debug=True)


# keep_alive()
if __name__ == '__main__':
    # keep_alive();
    # app.run('0.0.0.0', port=8080)
    app.run(threaded=True, debug=True)
