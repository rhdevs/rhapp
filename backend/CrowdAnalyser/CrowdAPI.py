from AuthFunction import authenticate
from db import *
from flask import jsonify, request, make_response
from AuthFunction import authenticate
from datetime import datetime, timedelta
import time
from flask_cors import cross_origin
from flask import Blueprint
import pymongo
import sys, copy

sys.path.append("../")

crowd_api = Blueprint("crowd", __name__)

@crowd_api.route('/getweekly', methods=["GET"])
@cross_origin(supports_credentials=True)
def get_weekly_crowd():
    try: 
        # Get today's date
        today = datetime.today()

        # Calculate the date of the start of the current week (Monday)
        start_of_week = today - timedelta(days = today.weekday())

        # Create a datetime object representing the start of the week
        start_of_week_datetime = datetime.combine(start_of_week, datetime.min.time())

        # Convert the datetime object to Unix timestamp
        start_of_week_unix = int(time.mktime(start_of_week_datetime.timetuple()))
        
        # Initialise counter for loop to find avg crowd on each day of the week
        counter = today.weekday()
        start_of_day = start_of_week_unix; 
        crowd_result = []
        for _ in range(0, counter):
            # Find all the data for the current day
            data = list(db.Crowd.find({"time": {"$gte": start_of_day, "$lte": start_of_day + 86400}}))
            level_sum = 0
            for item in data:
                level_sum += item['level']
            avg_level = level_sum / len(data)
            crowd_result.append(avg_level)
            
            # Increment the start of the day by 1 day
            start_of_day = start_of_day + 86400
        response = {"status": "success", "data": crowd_result}
    except Exception as e:
        print(e)
        return {"err": "An error has occured", "status": "failed"}, 500
    return make_response(response)