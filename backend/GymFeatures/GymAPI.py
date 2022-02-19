from operator import is_
from numpy import sort
from db import *
from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, make_response, Blueprint
from flask_cors import cross_origin
import pymongo
import sys
from datetime import datetime
import time
import pandas as pd
from .defaultLocation import DEFAULT_KEY_LOC, DEFAULT_TELEGRAM_HANDLE
sys.path.append("../")

gym_api = Blueprint("gym", __name__)


@gym_api.route("/", methods = ['GET'])
def get_history():
    try:
        data = list(db.Gym.find({},{"_id":0}).sort("requesttime",1))
        data = pd.DataFrame(data)
        checkkeyHolder = data['keyHolder'].shift(-1) == data['keyHolder']
        checkrequesttime = data['requesttime'].shift(-1) - data['requesttime'] <= 60
        checkgymIsOpen = (data['gymIsOpen'] == False) & (data['gymIsOpen'].shift(-1) == True)
        data = data[~((checkkeyHolder) & (checkrequesttime) & (checkgymIsOpen))].tail(10)

        data['date'] = data.apply(lambda row: datetime.fromtimestamp(row.requesttime).strftime('%Y-%m-%d'), axis=1)
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
            temp_data['date'] = i['date']
            temp_data['statusChange'] = i['statusChange']
            data_list.append(temp_data)
        
        new_data = {}
        
        for d in data_list:
            d = d.copy()
            date = d.pop('date')
            date = int(datetime.strptime(date, '%Y-%m-%d').timestamp())
            if date not in new_data:
                new_data[date] = {'date': date, 'details': []}
            new_data[date]['details'].append(d)

        allHistory = list(new_data.values())

        response = {"status":"success","data":allHistory}

    except Exception as e:
        print(e)
        return {"err":"An error has occured", "status":"failed"}, 500
    
    return make_response(response)

@gym_api.route("/status", methods=['GET'])
def get_statuses():
    try:
        data = list(db.Gym.find({}, {"_id": 0}).sort("requesttime", -1))[0]
        del data['requesttime']
        del data['keyIsReturned']
        
        if data['keyHolder']['telegramHandle'] == DEFAULT_TELEGRAM_HANDLE:
            data['userID'] = ''
        else:
            data['userID'] = db.User.find_one({"telegramHandle": data['keyHolder']['telegramHandle']})['userID']
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
