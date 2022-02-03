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
sys.path.append("../")

gym_api = Blueprint("gym", __name__)
DEFAULT_KEY_LOC = "5-409"

@gym_api.route("/movekey", methods = ["POST"])
def move_key():
    try:
        formData = request.get_json()
        print(formData)
        data = db.Gym.find().sort('_id',-1).limit(1).next()
        insert_data = {}
        insert_data["gymStatus"] = data["gymStatus"]
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

@gym_api.route("/togglegym", methods = ["POST"])
def toggle_gym():
    try:
        formData = request.get_json()
        print(formData)
        data = db.Gym.find().sort('_id',-1).limit(1).next()
        insert_data = {}
        insert_data["gymStatus"] = not data["gymStatus"]
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

# @gym_api.route("/now")
# def gym_now():
#     try:
#         data = db.Gym.find().sort('_id',-1).limit(1).next()
#         key_loc = data["keyStatus"]
#         is_open = data["gymStatus"]
#         if is_open:
#             gym_status = "open"
#         else:
#             gym_status = "closed"
#         response = {"data":{"Key":key_loc, "is_open":is_open},"status":"success","message":f"key at {key_loc}, gym is {gym_status}"}
#         return make_response(response)
#     except Exception as e:
#         print(e)
#         return {"err":"An error has occured", "status":"failed"}, 500

@gym_api.route("/history/")
def get_all_history():
    try:
        data = list(db.Gym.find({},{"_id":0}))
        response = {"status":"success","data":data}

    except Exception as e:
        return {"err":"An error has occured","status":"failed"},500

    return make_response(response)