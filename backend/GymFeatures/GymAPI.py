from db import *
from flask import Blueprint, make_response
import pymongo
import sys
from datetime import datetime
import time
sys.path.append("../")

gym_api = Blueprint("gym", __name__)

@gym_api.route("/")
def get_all_history():
    unix3days = 259200
    try:
        pipeline1 = [{"$addFields":{'date_diff': {"$subtract" : [int(time.time()), '$requesttime']}}},
            {"$project":{"_id":0,'userID': 1, 'telegramHandle':1, 'requesttime':1, 'keyStatus':1, 'gymStatus':1, 'lte3days': {"$toString":{"$lte" : ["$date_diff",unix3days]}}}},
            {"$match":{'lte3days':"true"}},
            {"$project":{'lte3days':0}}]
        
        data = list(db.Gym.aggregate(pipeline1))
        response = {"status":"success","data":data}

    except Exception as e:
        print(e)
        return {"err":"An error has occured", "status":"failed"}, 500

    return make_response(response)