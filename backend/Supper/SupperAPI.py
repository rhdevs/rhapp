from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import database
from db import *
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask import Blueprint
from bson.json_util import dumps
from datetime import datetime, timedelta
from threading import Thread
from bson.objectid import ObjectId
import pymongo
import copy
import sys
sys.path.append("../db")


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


# session format : {userID: {
#                           sessionID: VALUE
#                           startTime : VALUE
#                           expiry : VALUE
#                  }}
supper_api = Blueprint("supper", __name__)


@supper_api.route('/')
@cross_origin()
def root_route():
    return 'What up losers'

@supper_api.route('/reset')
@cross_origin()
def reset_database():
    db.SupperGroup.delete_many({})
    db.Order.delete_many({})
    db.FoodOrder.delete_many({})
    response = {"status": "success"}
    return make_response(response, 200)


@supper_api.route('/close')
@cross_origin()
def close_supper():
    closeSupperGroup(8)
    return 'SupperGroup Close'

###########################################################
#                   SUPPER ROUTES                         #
###########################################################

sched = BackgroundScheduler(daemon=True)


def closeSupperGroup(supperGroupId):
    result = db.SupperGroup.find({'supperGroupId': supperGroupId})
    data = None
    for supperGroup in result:
        data = supperGroup
    data['status'] = 'Closed'
    db.SupperGroup.update_one({"supperGroupId": supperGroupId},
                              {"$set": data})
    # Delete all Orders with no foodIds
    emptyOrders = list(db.Order.find({'supperGroupId': supperGroupId, 'foodIds': []}, {'foodIds': 0}))
    orderList = []
    for order in emptyOrders:
        orderList.append(order['_id'])
    db.Order.delete_many({'_id': {'$in': orderList}})


def deleteSupperGroup(supperGroupId):
    db.SupperGroup.delete_one({'supperGroupId': supperGroupId})


@supper_api.route('/supperGroup', methods=['GET'])
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
                '$addFields': {
                    'currentFoodCost': {'$sum': '$orderList.totalCost'},
                    'numOrders': {'$size': '$orderList'},
                }
            },
            {'$project': {'_id': 0}}
        ]

        result = db.SupperGroup.aggregate(pipeline)
        data = []
        currentTime = int(datetime.now().timestamp())
        for supperGroup in result:
            if supperGroup.get('status') == 'Open' and supperGroup.get('closingTime') <= currentTime:
                # Checks if closingTime has passed. If so, set status to closed.
                supperGroup['status'] = 'Closed'
                query = {'supperGroupId': supperGroup.get('supperGroupId')}
                changes = {'$set': {'status': 'Closed'}}
                db.SupperGroup.update_one(query, changes)

            # Creates userIDList for each supper group
            supperGroup['userIdList'] = []
            for order in supperGroup['orderList']:
                supperGroup['userIdList'].append(order['userID'])
            supperGroup.pop('orderList')
        
            supperGroup['totalPrice'] = supperGroup['currentFoodCost'] + supperGroup['additionalCost']
            query = {'supperGroupId': supperGroup.get('supperGroupId')}
            changes = {'$set': {'currentFoodCost': supperGroup['currentFoodCost'],
                                'userIdList': supperGroup['userIdList'],
                                'totalPrice': supperGroup['totalPrice']}}
            db.SupperGroup.update_one(query, changes)

            # Filters only open supper groups
            if supperGroup['status'] == 'Open':
                data.append(supperGroup)

        data.sort(key=lambda x: x.get('createdAt'), reverse=True)

        response = {"status": "success", "data": data}
        return make_response(response, 200)
    except Exception as e:
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/supperGroup', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_supper_group():
    try:
        supperGroupData = request.get_json()

        # auto-increment supperGroupId
        lastsupperGroupID = list(db.SupperGroup.find().sort(
            [('supperGroupId', pymongo.DESCENDING)]).limit(1))
        newsupperGroupID = 1 if len(lastsupperGroupID) == 0 else int(
            lastsupperGroupID[0].get("supperGroupId")) + 1

        supperGroupData["supperGroupId"] = newsupperGroupID
        supperGroupData["createdAt"] = int(datetime.now().timestamp())
        db.SupperGroup.insert_one(supperGroupData)
        supperGroupData['_id'] = str(supperGroupData.pop('_id'))

        # Add scheduler to close supper group order
        closingTime = datetime.fromtimestamp(supperGroupData['closingTime'])
        deleteDate = datetime.fromtimestamp(
            supperGroupData['createdAt']) + timedelta(days=5)
        sched.add_job(closeSupperGroup, 'date',
                      run_date=closingTime, args=[newsupperGroupID])
        sched.add_job(deleteSupperGroup, 'date',
                      run_date=deleteDate, args=[newsupperGroupID])
        if not sched.running:
            sched.start()

        # Automatically creates order for supperGroup owner
        orderData = {
            "supperGroupId": supperGroupData['supperGroupId'],
            "userContact": supperGroupData['phoneNumber'],
            "foodIds": [],
            "userID": supperGroupData['ownerId'],
            "createdAt": supperGroupData["createdAt"],
            "paymentMethod": supperGroupData['paymentInfo'][0]['paymentMethod'],
            "totalCost": 0,
            "hasPaid": False,
            "hasReceived": False
        }

        db.Order.insert_one(orderData)
        orderData['orderId'] = str(orderData.pop('_id'))

        # Retrieve relevant information from database
        pipeline = [
            {'$match': {'supperGroupId': newsupperGroupID}},
            {
                '$lookup': {
                    'from': 'Restaurants',
                    'localField': 'restaurantName',
                    'foreignField': 'name',
                    'as': 'restaurant'
                }
            },
            {
                '$lookup': {
                    'from': 'Profiles',
                    'localField': 'ownerId',
                    'foreignField': 'userID',
                    'as': 'ownerList'
                }
            },
            {
                '$unwind': {'path': '$restaurant'}
            },
            {
                '$unwind': {'path': '$ownerList'}
            },
            {
                '$addFields': {
                    # 'restaurantLogo': '$restaurant.restaurantLogo',
                    'restaurantId': '$restaurant._id',
                    'ownerName': '$ownerList.displayName',
                    'ownerTele': '$ownerList.telegramHandle'
                }
            },
            {
                '$project': {'_id': 0, 'restaurant': 0, 'ownerList': 0}
            }
        ]

        result = db.SupperGroup.aggregate(pipeline)

        # Add restaurantId, ownerName and ownerTele to SupperGroup
        data = None
        for suppergroup in result:
            supperGroupData['restaurantId'] = str(
                suppergroup.pop('restaurantId'))
            supperGroupData['ownerName'] = suppergroup['ownerName']
            supperGroupData['ownerTele'] = suppergroup['ownerTele']

        query = {'supperGroupId': newsupperGroupID}
        changes = {'$set': {'restaurantId': supperGroupData['restaurantId'],
                            'ownerName': supperGroupData['ownerName'],
                            'ownerTele': supperGroupData['ownerTele']}}
        db.SupperGroup.update_one(query, changes)

        data = {'supperGroup': supperGroupData,
                'orderId': orderData['orderId']}

        response = {"status": "success",
                    "message": "Successfully created supper group!",
                    "data": data}

        return make_response(response, 200)
    except Exception as e:
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/supperGroup/<int:supperGroupId>', methods=['GET', 'PUT', 'DELETE'])
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
                        'from': 'FoodOrder',
                        'localField': 'orderList.foodIds',
                        'foreignField': '_id',
                        'as': 'foodList'
                    }
                },
                {
                    '$addFields': {
                        'currentFoodCost': {'$sum': '$orderList.totalCost'},
                        'numOrders': {'$size': '$orderList'},
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
                {'$project': {'_id': 0, 'foodList.foodMenuId': 0, 'foodList.restaurantId': 0
                              }
                 }
            ]

            result = db.SupperGroup.aggregate(pipeline)

            data = None
            for suppergroup in result:
                data = suppergroup

                for order in data['orderList']:
                    order['orderId'] = str(order.pop('_id'))
                    order['foodIds'] = list(
                        map(lambda x: str(x), order['foodIds']))

                for food in data['foodList']:
                    food['foodId'] = str(food.pop('_id'))
                    for order in data['orderList']:
                        if food['foodId'] in order['foodIds']:
                            order['foodList'].append(food)
                            order['foodIds'].remove(food['foodId'])

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

            elif data.get('status') == 'Open' and data.get('closingTime') <= currentTime:
                # Checks if closingTime has passed. If so, set status to closed.
                data['status'] = 'Closed'
                query = {'supperGroupId': data.get('supperGroupId')}
                changes = {'$set': {'status': 'Closed'}}
                db.SupperGroup.update_one(query, changes)

            response = {"status": "success", "data": data}

        elif request.method == "PUT":  # Edit supper group details
            supper_group = db.SupperGroup.find(
                {'supperGroupId': supperGroupId})
            for sg in supper_group:
                supperGroup = sg

            data = request.get_json()

            db.SupperGroup.update_one({"supperGroupId": supperGroupId},
                                      {"$set": data})

            db.Order.update_many({'supperGroupId': supperGroupId},
                                 {'$set': {'notification': 'Update'}})

            # Add scheduler to close supper group order
            closingTime = datetime.fromtimestamp(supperGroup['closingTime'])
            sched.add_job(closeSupperGroup, 'date',
                          run_date=closingTime, args=[supperGroupId])
            if not sched.running:
                sched.start()

            response = {"status": "success",
                        "message": "Supper Group edited",
                        "data": data}

        elif request.method == "DELETE":

            foodIdList = list(db.Order.find(
                {'supperGroupId': supperGroupId}, {'foodIds': 1, '_id': 0}))
            foods = []
            for foodIds in foodIdList:
                if foodIds['foodIds']: # Check list is not empty
                    foods.append(foodIds['foodIds'][0])

            remove = db.SupperGroup.delete_one(
                {"supperGroupId": supperGroupId}).deleted_count
            if remove == 0:
                raise Exception("Supper group not found")
            db.Order.delete_many({'supperGroupId': supperGroupId})
            db.Order.update_many({'supperGroupId': supperGroupId},
                                 {'$set': {'notification': 'Delete'}})
            db.FoodOrder.delete_many({'_id': {'$in': foods}})
            response = {"status": "success",
                        "message": "Supper Group Deleted"}

        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/order', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_order():
    try:
        data = request.get_json()
        check = db.Order.find_one({'userID': data['userID'], 'supperGroupId': data['supperGroupId']})
        if check and '_id' in check:
            data['orderId'] = str(check['_id'])
        else:
            data['foodIds'] = []
            data['totalCost'] = 0
            data['paymentMethod'] = 'Nil'
            data['userContact'] = 0
            data["createdAt"] = int(datetime.now().timestamp())
            data['hasPaid'] = False
            data['hasReceived'] = False
            db.Order.insert_one(data)
            data['orderId'] = str(data.pop('_id'))

        response = {"status": "success",
                    "message": "Order created successfully.",
                    "data": {'orderId': data['orderId']}}

        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/order/<orderId>', methods=['GET', 'PUT', 'DELETE'])
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
            order = db.Order.find_one({"_id": ObjectId(orderId)})

            supperGroup = db.SupperGroup.find_one(
                {'supperGroupId': order['supperGroupId']})

            costLimit = supperGroup['costLimit']
            currentPrice = supperGroup['currentFoodCost']

            data = request.get_json()
            # If totalPrice for order is updated
            if 'totalCost' in data:
                if costLimit is not None and ((data['totalCost'] + currentPrice) > costLimit):
                    raise Exception('Total price exceeded cost limit')

                # Update supperGroup totalPrice when order is added
                else:
                    query = {'supperGroupId': order['supperGroupId']}
                    changes = {
                        '$set': {'totalPrice': currentPrice + data['totalCost']}}
                    db.SupperGroup.update_one(query, changes)

                # Change supper group status when totalPrice >= 90% of cost limit
                if costLimit is not None and (data['totalCost'] + currentPrice) > (costLimit * 0.9):
                    query = {'supperGroupId': order['supperGroupId']}
                    changes = {'$set': {'status': 'Pending'}}
                    db.SupperGroup.update_one(query, changes)

            # Update foodList - Empty cart
            if 'foodList' in data:
                if not data['foodList']: # FoodList is empty
                    # Remove all foodOrders in Order
                    data.pop('foodList')
                    data['totalCost'] = 0
                    db.FoodOrder.delete_many({'_id': {'$in': order['foodIds']}})

            db.Order.update_one({"_id": ObjectId(orderId)},
                                {"$set": data})

            response = {"status": "success",
                        "message": "Successfully edited order!",
                        "data": data}

        elif request.method == 'DELETE':
            foodIdList = list(db.Order.find(
                {'supperGroupId': supperGroupId}, {'foodIds': 1, '_id': 0}))
            foods = []
            for foodIds in foodIdList:
                if foodIds['foodIds']: # Check list is not empty
                    foods.append(foodIds['foodIds'][0])

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


@supper_api.route('/order/<orderId>/food', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_food(orderId):
    try:
        data = request.get_json()

        data["restaurantId"] = ObjectId(data["restaurantId"])
        data["foodMenuId"] = ObjectId(data["foodMenuId"])

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

        order = db.Order.find_one({'_id': ObjectId(orderId)})
        supperGroup = db.SupperGroup.find_one(
                {'supperGroupId': order['supperGroupId']})

        costLimit = supperGroup['costLimit']
        currentPrice = supperGroup['currentFoodCost']

        # Checks if addition of food price will exceed cost limit
        if costLimit is not None and ((data['foodPrice'] + currentPrice) > costLimit):
            raise Exception('Total price exceeded cost limit')

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

        data["restaurantId"] = str(data["restaurantId"])
        data["foodMenuId"] = str(data["foodMenuId"])

        response = {"status": "success",
                    "message": "Food added successfully.",
                    "data": data}

        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/order/<orderId>/food/<foodId>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin(supports_credentials=True)
def food_order(orderId, foodId):
    try:
        if request.method == 'GET':
            data = db.FoodOrder.find_one({"_id": ObjectId(foodId)})

            data['orderId'] = str(data.pop('_id'))
            data['restaurantId'] = str(data['restaurantId'])
            data['foodMenuId'] = str(data['foodMenuId'])

            response = {"status": "success",
                        "data": data}

        elif request.method == 'PUT':
            data = request.get_json()

            if 'custom' in data:
                temp = db.FoodOrder.find_one({"_id": ObjectId(foodId)})
                data['foodPrice'] = temp['price']
                if 'quantity' not in data:
                    data['quantity'] = temp['quantity']
                for custom in data['custom']:
                    for option in custom['options']:
                        if option['isSelected']:
                            data['foodPrice'] += option['price']
                            break
                        else:
                            continue
                data['foodPrice'] = data['foodPrice'] * data['quantity']
            elif 'quantity' in data:
                temp = db.FoodOrder.find_one({"_id": ObjectId(foodId)})
                data['foodPrice'] = temp['foodPrice'] / temp['quantity']
                data['foodPrice'] = data['foodPrice'] * data['quantity']

            food_result = db.FoodOrder.find_one_and_update({"_id": ObjectId(foodId)},
                                                           {"$set": data})

            if food_result is None:
                raise Exception('Food not found')

            # Owner manually edit foodPrice
            if 'foodPrice' in data:
                
                db.FoodOrder.update_one({"_id": ObjectId(foodId)},
                                        {"$set": {"foodPrice": data['foodPrice']}})
                
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


@supper_api.route('/restaurant', methods=['GET', 'POST'])
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


@supper_api.route('/restaurant/<restaurantId>', methods=['GET'])
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


@supper_api.route('/restaurant/<restaurantId>/menu', methods=['GET'])
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


@supper_api.route('/restaurant/food/<foodMenuId>', methods=['GET'])
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


@supper_api.route('/user/<userID>/orderHistory', methods=['GET'])
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


@supper_api.route('/user/<userID>/joinGroupHistory', methods=['GET'])
@cross_origin(supports_credentials=True)
def user_join_group_history(userID):
    try:
        supperGroups = list(db.Order.find(
            {'userID': userID}, {'_id': 0, 'supperGroupId': 1}))
        supperGroupIds = [supperGroup.get('supperGroupId')
                          for supperGroup in supperGroups]

        pipeline = [
            {"$match": {'supperGroupId': {"$in": supperGroupIds},
                        'ownerId': {'$nin': [userID]}}},
            {
                '$lookup': {
                    'from': 'Order',
                    'localField': 'supperGroupId',
                    'foreignField': 'supperGroupId',
                    'as': 'orderList'
                }
            },
            {
                '$addFields': {
                    'currentFoodCost': {'$sum': '$orderList.totalCost'},
                    'numOrders': {'$size': '$orderList'},
                }
            },
            {'$project': {'orderList': 0, '_id': 0}}
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


@supper_api.route('/user/<userID>/supperGroupHistory', methods=['GET'])
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
                '$addFields': {
                    'currentFoodCost': {'$sum': '$orderList.totalCost'},
                    'numOrders': {'$size': '$orderList'},
                }
            },
            {'$project': {'orderList': 0, '_id': 0}}
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


@supper_api.route('/user/<userID>/supperGroupNotification', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user_supper_group_notification(userID):
    try:
        if request.method == "GET":
            pipeline = [
                {'$match': {'userID': userID}},
                {
                    '$lookup': {
                        'from': 'SupperGroup',
                        'localField': 'supperGroupId',
                        'foreignField': 'supperGroupId',
                        'as': 'supperGroup'
                    }
                },
                {
                    '$unwind': {'path': '$supperGroup'}
                },
                {'$project': {'supperGroupId': 1, 'supperGroup.ownerName': 1,
                              'supperGroup.supperGroupName': 1, 'notification': 1, '_id': 0}}
            ]

            result = db.Order.aggregate(pipeline)
            data = []
            for item in result:
                item['supperGroupName'] = item['supperGroup']['supperGroupName']
                item['ownerName'] = item.pop('supperGroup')['ownerName']
                if 'notification' in item and item['notification']:
                    data.append(item)

            response = {"status": "success", "data": data}

        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/user/<userID>/supperGroupNotification/<int:supperGroupId>', methods=['POST', 'DELETE'])
@cross_origin(supports_credentials=True)
def user_supper_group_notification(userID, supperGroupId):
    try:
        if request.method == 'POST':
            # data = {notification: Update/Delete <str>}
            data = request.get_json()

            db.Order.update_many({'userID': userID, 'supperGroupId': supperGroupId},
                                 {'$set': data})

            response = {"status": "success", "data": data}

        elif request.method == 'DELETE':
            data = request.get_json()

            db.Order.update_many({'userID': userID, 'supperGroupId': supperGroupId},
                                 {'$unset': {'notification': ''}})

            response = {"status": "success", "data": data}

        return make_response(response, 200)

    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/supperGroup/<int:supperGroupId>/collated', methods=['GET'])
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
            {'$project': {'_id': 0}},
        ]

        result = db.SupperGroup.aggregate(pipeline)

        data = None
        for item in result:
            data = item

        def mapUserId(foodList, orderList):
            for order in orderList:
                for foodId in order['foodIds']:
                    for food in foodList:
                        if str(food['_id']) == str(foodId):
                            food['userID'] = order['userID']

        mapUserId(data['foods'], data['orderList'])
        data.pop('orderList')

        for food in data['foods']:
            hash_dict = {'custom': food['custom'],
                         'cancelAction': food['cancelAction']}
            if 'comments' in food:
                hash_dict['comments'] = food['comments']
            if 'updates' in food:
                hash_dict['updates'] = food['updates']

            food['customHash'] = make_hash(hash_dict)

        data['foods'].sort(key=lambda x: (x['foodMenuId'], x['customHash']))

        data['collatedOrderList'] = []
        for food in data['foods']:
            if not data['collatedOrderList']:
                data['collatedOrderList'].append(food)
                data['collatedOrderList'][-1]['userIdList'] = [data['collatedOrderList'][-1].pop('userID')]
                data['collatedOrderList'][-1]['foodIdList'] = [str(data['collatedOrderList'][-1].pop('_id'))]
            elif food['foodMenuId'] == data['collatedOrderList'][-1]['foodMenuId'] and \
                    food['customHash'] == data['collatedOrderList'][-1]['customHash']:
                data['collatedOrderList'][-1]['quantity'] += food['quantity']
                data['collatedOrderList'][-1]['foodPrice'] += food['foodPrice']
                data['collatedOrderList'][-1]['userIdList'].append(food['userID'])
                data['collatedOrderList'][-1]['foodIdList'].append(str(food['_id']))
            else:
                data['collatedOrderList'].append(food)
                data['collatedOrderList'][-1]['userIdList'] = [data['collatedOrderList'][-1].pop('userID')]
                data['collatedOrderList'][-1]['foodIdList'] = [str(data['collatedOrderList'][-1].pop('_id'))]

        data.pop('foods')
        for food in data['collatedOrderList']:
            food.pop('customHash')
            food['restaurantId'] = str(food['restaurantId'])
            food['foodMenuId'] = str(food['foodMenuId'])

        data = {key: data[key] for key in (
            'supperGroupId', 'ownerId', 'collatedOrderList') if key in data}

        response = {"status": "success", "data": data}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/supperGroup/<int:supperGroupId>/owner', methods=['PUT'])
@cross_origin(supports_credentials=True)
def owner_edit_order(supperGroupId):
    try:
        if request.method == 'PUT':
            data = request.get_json()
            foodId = ObjectId(data.pop('foodId'))
            food = db.FoodOrder.find_one({"_id": foodId})

            if 'updatedPrice' in data['updates'] and data['updates']['updatedPrice']:
                data['foodPrice'] = data['updates']['updatedPrice']
            else:
                data['foodPrice'] = 0

            if data['updates']['updateAction'] == 'Update':
                if any(k not in data['updates'] for k in ('reason', 'change')) \
                        or data['updates']['reason'] is None \
                        or data['updates']['change'] is None:
                    raise Exception('Update information incomplete')
            elif data['updates']['updateAction'] == 'Remove':
                if 'reason' not in data['updates'] or data['updates']['reason'] is None:
                    raise Exception('Update information incomplete')

            if 'updatedQuantity' in data['updates']:
                data['foodPrice'] = data['foodPrice'] * data['updates']['updatedQuantity']
            else:
                data['foodPrice'] = data['foodPrice'] * food['quantity']

            if 'global' in data['updates'] and data['updates'].pop('global'):
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
                            'as': 'foodList'
                        }
                    },
                    {'$project': {'_id': 1, 'foodIds': 1, 'foodList._id': 1, 'foodList.foodMenuId': 1,
                                  'foodList.quantity': 1, 'foodList.custom': 1, 'foodList.comments': 1,
                                  'foodList.cancelAction': 1, 'foodList.foodPrice': 1}},
                ]

                result = db.Order.aggregate(pipeline)

                foods = []
                for item in result:
                    item['foodList'] = list(filter(lambda x: x['_id'] in item['foodIds'], item['foodList']))
                    for food in item['foodList']:
                        food['orderId'] = item['_id']
                    foods += item['foodList']

                foods = list(filter(lambda x:
                                    x['foodMenuId'] == food['foodMenuId'] and
                                    x['custom'] == food['custom'] and
                                    x['cancelAction'] == food['cancelAction'] and
                                    x['comments'] == food['comments']
                                    if 'comments' in x else
                                    x['foodMenuId'] == food['foodMenuId'] and
                                    x['custom'] == food['custom'] and
                                    x['cancelAction'] == food['cancelAction'], foods))

                for food in foods:
                    db.Order.update({'_id': food['orderId']},
                                    {'$inc': {'totalCost': data['foodPrice'] - food['foodPrice']},
                                     '$set': {'notification': 'Food'}})
                    db.FoodOrder.update({'_id': food['_id']},
                                        {'$set': data})

            else:
                db.Order.update({'foodIds': food['_id']},
                                {'$inc': {'totalCost': data['foodPrice'] - food['foodPrice']},
                                 '$set': {'notification': 'Food'}})
                result = db.FoodOrder.find_one_and_update({'_id': foodId},
                                                          {'$set': data})
            if result is None:
                raise Exception('Food not found')

            response = {"status": "success",
                        "message": "Successfully updated food!",
                        "data": data}

        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/supperGroup/<int:supperGroupId>/payment', methods=['PUT'])
@cross_origin(supports_credentials=True)
def order_payments(supperGroupId):
    try:
        if request.method == 'PUT':
            data = request.get_json()

            received_orders = []
            not_received_orders = []
            for order in data:
                if order['hasReceived']:
                    received_orders.append(ObjectId(order['orderId']))
                else:
                    not_received_orders.append(ObjectId(order['orderId']))

            db.Order.update_many({"_id": {"$in": received_orders}},
                                 {"$set": {"hasReceived": True}})

            db.Order.update_many({"_id": {"$in": not_received_orders}},
                                 {"$set": {"hasReceived": False}})

            response = {"status": "success", "data": data}
            return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


@supper_api.route('/supperGroup/<int:supperGroupId>/user/<userID>', methods=['GET', 'DELETE'])
@cross_origin(supports_credentials=True)
def user_order(supperGroupId, userID):
    try:
        if request.method == 'GET':
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
            data = None

            # Only 1 item in temp, can only access it like this otherwise its a mongo array object
            for item in temp:
                data = item

            if data is None:
                raise Exception(
                    "User " + str(userID) + " was not found in supper group " + str(supperGroupId))

            data['orderId'] = str(data.pop('_id'))

            for food in data["foodList"]:
                # rename _id field to foodId and unbox mongo object
                food["foodId"] = str(food.pop('_id'))
                food["restaurantId"] = str(food.pop('restaurantId'))
                food["foodMenuId"] = str(food.pop('foodMenuId'))

            response = {"status": "success", "data": data}
        elif request.method == 'DELETE':
            foodIdList = list(db.Order.find(
                {'supperGroupId': supperGroupId, 'userID': userID}, {'foodIds': 1, '_id': 1}))
            print(foodIdList)
            orderId = None
            foods = []
            for foodIds in foodIdList:
                orderId = foodIds['_id']
                print(orderId)
                if foodIds['foodIds']: # Check list is not empty
                    foods.append(foodIds['foodIds'][0])

            result = db.Order.delete_one({"_id": orderId})
            if result.deleted_count == 0:
                raise Exception("Order not found")

            db.FoodOrder.delete_many({'_id': {'$in': foods}})

            response = {"status": "success",
                        "message": "Successfully deleted order!"}
        return make_response(response, 200)
    except Exception as e:
        print(e)
        return make_response({"status": "failed", "err": str(e)}, 400)


def delete_supper_group(supperGroupId):
    foodIdList = list(db.Order.find(
        {'supperGroupId': supperGroupId}, {'foodIds': 1, '_id': 0}))
    foods = [food.get('foodIds') for food in foodIdList]

    remove = db.SupperGroup.delete_one(
        {"supperGroupId": supperGroupId}).deleted_count
    if remove == 0:
        raise Exception("Supper group not found")
    db.Order.delete_many({'supperGroupId': supperGroupId})
    db.FoodOrder.delete_many({'_id': {'$in': foods}})
    print("Supper Group deleted!")
