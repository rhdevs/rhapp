from db import *
from flask import Blueprint, make_response
import pymongo
import sys
from datetime import datetime
sys.path.append("../")

gym_api = Blueprint("gym", __name__)

@gym_api.route("/")
def get_all_history():
    try:
        data = list(db.Gym.find({},{"_id":0}))
        response = {"status":"success","data":data}

    except Exception as e:
        return {"err":"An error has occured","status":"failed"},500

    return make_response(response)