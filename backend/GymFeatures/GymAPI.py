from operator import is_
from numpy import sort
from sympy import Q
from db import *
from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, make_response, Blueprint
from flask_cors import cross_origin
import pymongo
import sys
from datetime import datetime
import time
import pandas as pd
sys.path.append("../")

gym_api = Blueprint("gym", __name__)
DEFAULT_KEY_LOC = "5-409"
DEFAULT_TELEGRAM_HANDLE = "smchead"

@gym_api.route("/", methods = ['GET'])
def get_all_history():
    try:
        data = list(db.Gym.find({},{"_id":0}).sort("requesttime",1))
        data = pd.DataFrame(data)
        checkuserID = (data["userID"] == data["userID"].shift(-1))
        checkrequesttime = data['requesttime'].shift(-1) - data['requesttime'] <= 60
        checkgymIsOpen = data['gymIsOpen'].shift(-1) == data['gymIsOpen']
        data = data[~((checkuserID) & (checkrequesttime) & (checkgymIsOpen))].tail(10)
        data = data.to_dict('records')
        
        data_list = []

        for i in data:
            temp_data = {}
            if i['keyIsReturned']:
                temp_data['userDetails'] = DEFAULT_KEY_LOC
            else:
                temp_data['userDetails'] = i['keyHolder']['telegramHandle']

            temp_data['requesttime'] = i['requesttime']
            temp_data['gymIsOpen'] = i['gymIsOpen']
            data_list.append(temp_data)

        response = {"status":"success","data":data_list}

    except Exception as e:
        print(e)
        return {"err":"An error has occured", "status":"failed"}, 500
    
    return make_response(response)

@gym_api.route("/status", methods=['GET'])
def get_statuses():
    try:
        data = list(db.Gym.find({}, {"_id": 0, "requesttime": 0}).sort("requesttime", -1))[0]
        formData = request.get_json()
        if formData['userID'] == data['userID'] and not data['keyIsReturned']:
            data['keyWithCurrentUser'] = True
        else:
            data['keyWithCurrentUser'] = False
        del data['userID']
        response = {"data": data, "status": "success"}

    except:
        return {"err": "An error has occurred", "status": "failed"}, 500

    return make_response(response)

@gym_api.route("/movekey", methods = ["POST"])
def move_key():
    try:
        formData = request.get_json()
        data = db.Gym.find().sort('_id',-1).limit(1).next()
        insert_data = {}
        insert_data["gymIsOpen"] = data["gymIsOpen"]
        insert_data["keyStatus"] = formData["keyStatus"]
        insert_data["telegramHandle"] = formData["telegramHandle"]
        insert_data["userID"] = formData["userID"]
        insert_data["requesttime"] = int(time.time())
        db.Gym.insert_one(insert_data)
        response = {"status":"success"}
        return make_response(response)
    except Exception as e:
        print(e)
        return {"err":"An error has occured", "status":"failed"}, 500
    
@gym_api.route("/returnkey", methods = ["POST"])
def return_key():
    try:
        formData = request.get_json()
        data = db.Gym.find().sort('_id',-1).limit(1).next()
        insert_data = {}
        insert_data["gymIsOpen"] = data["gymIsOpen"]
        insert_data["keyStatus"] = DEFAULT_KEY_LOC
        insert_data["telegramHandle"] = formData["telegramHandle"]
        insert_data["userID"] = formData["userID"]
        insert_data["requesttime"] = int(time.time())
        db.Gym.insert_one(insert_data)
        response = {"status":"success"}
        return make_response(response)
    except Exception as e:
        print(e)
        return {"err":"An error has occured", "status":"failed"}, 500

@gym_api.route("/togglegym", methods = ["POST"])
def toggle_gym():
    try:
        formData = request.get_json()
        data = db.Gym.find().sort('_id',-1).limit(1).next()
        insert_data = {}
        insert_data["gymIsOpen"] = not formData["gymIsOpen"]
        insert_data["keyStatus"] = formData["telegramHandle"]
        insert_data["telegramHandle"] = formData["telegramHandle"]
        insert_data["userID"] = formData["userID"]
        insert_data["requesttime"] = int(time.time())
        db.Gym.insert_one(insert_data)
        response = {"status":"success"}
        return make_response(response)
    except Exception as e:
        print(e)
        return {"err":"An error has occured", "status":"failed"}, 500

@gym_api.route("/gymIsOpen", methods=['POST'])
def add_gymIsOpen():
    try:
        data = request.get_json(force=True)
        response = {"status": "success"}
        db.Gym.insert_one(data)
    except:
        return {"err": "An error has occurred", "status": "failed"}, 500
    return make_response(response)
