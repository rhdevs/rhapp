from db import *
from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, make_response
import os
from datetime import datetime
import time
from flask_cors import cross_origin
from flask import Blueprint
import pymongo
import sys
sys.path.append("../db")

laundry_api = Blueprint("laundry", __name__)


@laundry_api.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
def home_page():
    try:
        response = {
            "status": "success",
            "data": {
                "message": "Hi People, this is Laundry API "
            }
        }

        return make_response(response, 200)
    except Exception as e:
        response = {"err": str(e), "status": "failed"}
        return make_response(response, 400)


@laundry_api.route('/location', methods=['GET'])
@cross_origin(supports_credentials=True)
def all_location():
    try:
        all_location = list(db.LaundryLocation.find({}, {'_id': 0}))
        response = {
            "status": "success",
            "data": {
                "locations": all_location
            }
        }

        return make_response(response, 200)
    except Exception as e:
        response = {"err": str(e), "status": "failed"}
        return make_response(response, 400)


def SweepAll():
    # function to do lazy deletion of all the laundry machines after 15 mins
    # Also do lazy update when duration + starttime of laundry is finished, change from In Use --> Uncollected
    # I assume since there are only 74 machines, sweeping 74 machines would be pretty fast for each call
    # all_machines = db.LaundryMachine.find({}, {'_id': 0})
    # this one can optimize the query using if else inside the pymongo itself and in instead of update one by one

    currentTime = datetime.now().timestamp()

    try:
        db.LaundryMachine.aggregate(
            [
                {'$project': {'expiryTime': {
                    '$add': ['$startTime', '$duration']}}}
            ]
        )

        db.LaundryMachine.update(
            {'expiryTime': {'$gte': '$currentTime'},
             'status': {'eq': 'Reserved'}
             },
            {'$set': {'status': 'Available', 'duration': 0}}
        )

        db.LaundryMachine.update(
            {'expiryTime': {'$gte': '$currentTime'},
             'status': {'eq': 'In Use'}
             },
            {'$set': {'status': 'Uncollected', 'duration': 0}}
        )

        return True
    except Exception as e:
        raise Exception("Sweeping Failed " + str(e))

db.LaundryMachine.create_index('userID')


@ laundry_api.route('/laundryMachines', methods=['GET'])
def laundry_all():
    if request.method == 'GET':
        try:
            print("Just Sweep : " + str(SweepAll()))

            laundryMachines = list(db.LaundryMachine.find({}, {'_id': 0}))
            response = {
                "status": "success",
                "data": {
                    "laundryMachines": laundryMachines
                }
            }
            return make_response(response, 200)

        except Exception as e:
            response = {"err": str(e), "status": "failed"}
            return make_response(response, 400)

    elif request.method == 'POST':
        try:
            data = request.get_json()
            job = str(data.get("job"))
            machineID = str(data.get("machineID"))
            userID = str(data.get("userID"))
            currentDuration = None if data.get(
                'currentDuration') is None else int(data.get('currentDuration'))
        except Exception as e:
            response = {"err": str(
                "argument supplied is invalid, should have job, machineID and userID"), "status": "failed"}
            return make_response(response, 400)

        myquery = {
            'machineID': machineID
        }

        currMachine = db.LaundryMachine.find_one({'machineID': machineID})
        status = currMachine.get("job")

        try:
            if status == "Available" and job == 'None':
                # if status is Available, change the job to In Use
                # create a new entry in the laundryJob collections
                lastjobID = db.LaundryJob.find_one(
                    sort=[('_id', pymongo.DESCENDING)])
                newJobID = 1 if lastjobID is None else int(
                    lastjobID.get("jobID")) + 1

                data_body = {'$set':
                             {'job': "Reserved",
                              'jobID': newJobID,
                              'userID': userID,
                              'duration': 15 * 60,  # fix to 15 minutes
                              'startTime': datetime.now().timestamp()}
                             }

                db.LaundryMachine.update_one(myquery, data_body)
                db.LaundryJob.insert_one({
                    "machineID": str(machineID),
                    "userID": userID,
                    "jobID": newJobID,
                    "actionTimeHistory": [datetime.now().timestamp()],
                    "jobHistory": ["Reserved"]
                })

                response = {
                    "status": "success",
                    "data": {}
                }

                return make_response(response, 200)

            elif status == "Available" and (job not in ['Broken']):
                # for admin use, change Available to Broken
                raise Exception('you can only change to Broken from Available')

            elif status == "Broken" and (job != 'Available'):
                raise Exception(
                    'From Broken, you can only make it to Available')

            elif status in ['Uncollected', 'Alerted'] and job == "Completed":
                jobID = db.LaundryMachine.find_one(
                    {'machineID': machineID}).get("jobID")
                data_body = {'$set':
                             {'job': "Available",
                                 'userID': userID,
                                 'startTime': datetime.now().timestamp()}
                             }

                db.LaundryMachine.update_one(myquery, data_body)
                db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "Completed"
                    }}
                )

                response = {
                    "status": "success",
                    "data": {}
                }

                return make_response(response, 200)

            elif status == "Available" and job == "Broken":
                # just update the machine without new entry
                data_body = {'$set':
                             {'job': job,
                                 'userID': userID,
                                 'startTime': datetime.now().timestamp()}
                             }

                db.LaundryMachine.update_one(myquery, data_body)

                response = {
                    "status": "success",
                    "data": {}
                }

                return make_response(response, 200)

            elif status == "Reserved" and job == 'None':
                if(currentDuration == None or currentDuration == 0):
                    return make_response("cannot start with duration 0 / Not supplied", 400)

                data_body = {'$set':
                             {'job': "In Use",
                                 'userID': userID,
                                 'duration': currentDuration,
                                 'startTime': datetime.now().timestamp()}
                             }

                jobID = db.LaundryMachine.find_one(
                    {'machineID': machineID}).get("jobID")
                db.LaundryMachine.update_one(myquery, data_body)
                db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "In Use"
                    }}
                )

                response = {
                    "status": "success",
                    "data": {}
                }

                return make_response(response, 200)

            elif status in ['Uncollected', 'Alerted'] and job == "Alerted":
                # just update the database without creating new entry
                data_body = {'$set':
                             {'job': job,
                                 'userID': userID,
                              }
                             }

                jobID = db.LaundryMachine.find_one(
                    {'machineID': machineID}).get("jobID")
                db.LaundryMachine.update_one(myquery, data_body)
                db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "Alerted"
                    }}
                )

                response = {
                    "status": "success",
                    "data": {}
                }

                return make_response(response, 200)

            elif job == "Cancelled":
                jobID = db.LaundryMachine.find_one(
                    {'machineID': machineID}).get("jobID")
                data_body = {'$set':
                             {'job': "Available",
                                 'userID': '',
                                 'duration': 0,
                                 'startTime': datetime.now().timestamp()}
                             }

                db.LaundryMachine.update_one(myquery, data_body)
                db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "Cancelled"
                    }}
                )

                response = {
                    "status": "success",
                    "data": {}
                }

                return make_response(response, 200)
            else:
                raise Exception("command not recognized")
        except Exception as e:
            response = {"err": str(e), "status": "failed"}
            return make_response(response, 400)


@ laundry_api.route('/laundryMachines/<int:machineID>', methods=['GET'])
@ cross_origin(supports_credentials=True)
def laundry_by_id(machineID):
    try:
        laundry_info = db.LaundryMachine.find_one(
            {'machineID': machineID}, {'_id': 0})
        response = {
            "status": "success",
            "data": {
                "laundry_info": laundry_info
            }
        }

        return make_response(response, 200)

    except Exception as e:
        response = {
            "err": "invalid machineID or machineID not found in db, " + str(e), "status": "failed"}
        return make_response(response, 400)


@ laundry_api.route('/laundryMachines/location/<int:locationID>', methods=['GET'])
@ cross_origin(supports_credentials=True)
def laundry_by_location(locationID):
    try:
        DEFAULT_PROFILE_URI = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        print("Just Sweep : " + str(SweepAll()))
        pipeline = [
            {'$match': {
                'locationID': locationID
            }
            },
            {'$lookup': {
                'from': 'Profiles',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'profile'
            }
            }
        ]

        response = {"data": []}

        for item in db.LaundryMachine.aggregate(pipeline):
            # print(item["profile"])
            if (len(item["profile"]) != 0):
                item["userImage"] = item["profile"][0].get(
                    "profilePictureUrl")
            else:
                item["userImage"] = DEFAULT_PROFILE_URI

            del item["profile"]
            response["data"].append(item)
        response["status"] = "success"

        return make_response(response, 200)

    except Exception as e:
        response = {"err": str(e), "status": "failed"}
        return make_response(response, 400)


@ laundry_api.route('/laundryMachines/duration', methods=['PUT'])
@ cross_origin(supports_credentials=True)
def laundry_machine_change_duration():
    try:
        data = request.get_json()
        # it is possible to change into JSON format, using request.json to check
        duration = int(data.get("duration"))
        machineID = str(data.get("machineID"))

        myquery = {
            'machineID': machineID
        }

        status = db.LaundryMachine.find_one(
            {'machineID': machineID}).get("job")

        if status in ['In Use']:
            data_body = {'$set':
                         {'duration': duration}
                         }

            db.LaundryMachine.update_one(myquery, data_body)

            response = {
                "status": "success",
                "data": {}
            }
            return make_response(response, 200)
        else:
            raise Exception(
                "Can only update duration when its In Use, cannot change Reserved Timing")
    except Exception as e:
        response = {"err": str(e), "status": "failed"}
        return make_response(response, 400)


# =========================================================================================
# ================================ OLD Endpoints ==========================================
# =========================================================================================

# @laundry_api.route('/laundryMachines/startTime', methods=['GET'])
# @cross_origin(supports_credentials=True)
# def getStartTime():
#     response = {}
#     try:
#         machineID = request.args.get('machineID')
#         if machineID is None:
#             raise Exception(
#                 "machine ID not provided as URL parameter, use ?machineID=...")

#         machine = db.LaundryMachine.find_one(
#             {'machineID': machineID}, {'job': 1, 'startTime': 1})

#         if machine.get("job") not in ['Reserved', 'In Use']:
#             raise Exception(
#                 "Only can fetch start time when the machine is Reserved or In Use")

#         response['status'] = 'success'
#         response['data'] = {
#             'startTime': machine.get("startTime")
#         }

#         return make_response(response, 200)

#     except Exception as e:
#         response['status'] = 'failed'
#         response['data'] = {
#             'message': str(e)
#         }

#         return make_response(response, 404)

# @ app.route('/location/<int:block_num>', methods=['GET'])
# @ cross_origin(supports_credentials=True)
# def location(block_num):
#     try:
#         block_info = dumps(db.LaundryLocation.find({'block': block_num}))
#         return make_response(block_info, 200)
#     except Exception as e:
#         return make_response({"err": str(e)}, 400)

# @laundry_api.route('/job', methods=['GET'])
# @cross_origin(supports_credentials=True)
# def laundry_machine_get_job():
#     try:
#         machineID = request.args.get('machineID')
#         userID = request.args.get('userID')
#         jobID = request.args.get('jobID')

#         if jobID:
#             laundry_info = dumps(db.LaundryJob.find_one({'jobID': int(jobID)}))
#             return make_response(laundry_info, 200)
#         elif userID:
#             laundry_info = dumps(db.LaundryJob.find({'userID': userID}))
#             return make_response(laundry_info, 200)
#         elif machineID:
#             laundry_info = dumps(db.LaundryJob.find({'machineID': machineID}))
#             return make_response(laundry_info, 200)
#         else:
#             return make_response(dumps(db.LaundryJob.find()), 200)
#     except Exception as e:
#         return make_response({"err": str(e)}, 400)
