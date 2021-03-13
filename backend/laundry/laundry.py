from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, make_response
import os
from pymongo import MongoClient
import pymongo
from pprint import pprint
from datetime import datetime
from bson.json_util import dumps
import json
import time
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"
# app.config.from_object(os.environ['APP_SETTINGS'])

client = MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = client.RHApp


@app.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
def home_page():
    # landing page
    # return make_response(render_template("index.html"), 200);
    return make_response("Laundry API", 200)


@app.route('/location', methods=['GET'])
@cross_origin(supports_credentials=True)
def all_location():
    try:
        all_location = db.LaundryLocation.find()
        return make_response(json.dumps(list(all_location), default=lambda o: str(o)), 200)
    except Exception as e:
        return make_response({"err": str(e)}, 400)


@app.route('/location/<int:block_num>', methods=['GET'])
@cross_origin(supports_credentials=True)
def location(block_num):
    try:
        block_info = dumps(db.LaundryLocation.find({'block': block_num}))
        return make_response(block_info, 200)
    except Exception as e:
        return make_response({"err": str(e)}, 400)


def SweepAll():
    # function to do lazy deletion of all the laundry machines after 15 mins
    # Also do lazy update when duration + starttime of laundry is finished, change from In Use --> Uncollected
    # I assume since there are only 74 machines, sweeping 74 machines would be pretty fast for each call
    all_machines = db.LaundryMachine.find()
    # this one can optimize the query using if else inside the pymongo itself and in instead of update one by one
    for machine in all_machines:
        # print(machine.get('duration'));
        startTime = 0 if machine.get(
            'startTime') == None else machine.get('startTime')
        expiryTime = startTime + int(machine.get('duration'))
        currentTime = datetime.now().timestamp()

        status = machine.get('job')
        myquery = {
            'machineID': machine.get("machineID")
        }

        if(expiryTime < currentTime and status == "Reserved"):
            # reset the duration
            data_body = {'$set':
                         {'duration': 0,
                          "job": "Available"}
                         }
            try:
                result = db.LaundryMachine.update_one(myquery, data_body)
            except Exception as e:
                return str(e) + " : Update " + str(machine.get("machineID")) + " failed"
        elif (expiryTime < currentTime and status == "In Use"):
            # reset the duration
            data_body = {'$set':
                         {'duration': 0,
                          "job": "Uncollected"}
                         }
            try:
                result = db.LaundryMachine.update_one(myquery, data_body)
            except Exception as e:
                return str(e) + " : Update " + str(machine.get("machineID")) + " failed"

    return True


def getUserPicture(userID=None):
    defaultProfilePictureUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    if (userID is not None):
        try : 
            image = db.Profiles.find_one(
                {"userID": userID}, {"profilePictureUrl": 1})

            return image.get('profilePictureUrl')
        except :
            return defaultProfilePictureUrl
    else:
        return defaultProfilePictureUrl


@app.route('/laundry/machine', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def laundry_by_location():
    try:
        if request.method == 'GET':
            job = request.args.get('job')
            locationID = request.args.get('locationID')
            type = request.args.get('type')
            machineID = request.args.get('machineID')
            print("Just Sweep : " + str(SweepAll()))
            # actually pretty not efficient, can optimize by lazily deleting and updating only those that wants to be returned

            if machineID:
                laundry_info = dumps(
                    db.LaundryMachine.find_one({'machineID': machineID}))
                return make_response(laundry_info, 200)
            elif locationID:
                laundry_info = db.LaundryMachine.find(
                    {'locationID': locationID})
                response = {"data": []}
                for item in laundry_info:
                    item["userImage"] = getUserPicture(item.get('userID'))
                    response["data"].append(item)

                return make_response(response, 200)
            elif job and type:
                laundry_info = dumps(db.LaundryMachine.find(
                    {'job': job, 'type': type}))
                return make_response(laundry_info, 200)
            elif type:
                laundry_info = dumps(db.LaundryMachine.find({'type': type}))
                return make_response(laundry_info, 200)
            elif job:
                laundry_info = dumps(db.LaundryMachine.find())
                return make_response(laundry_info, 200)
            else:
                return make_response(dumps(db.LaundryMachine.find()), 200)

        elif request.method == 'POST':
            data = request.get_json()
            # it is possible to change into JSON format, using request.json to check
            job = str(data.get("job"))
            machineID = str(data.get("machineID"))
            userID = str(data.get("userID"))
            currentDuration = None if data.get(
                'currentDuration') is None else int(data.get('currentDuration'))

            myquery = {
                'machineID': machineID
            }

            currMachine = db.LaundryMachine.find_one({'machineID': machineID})

            status = currMachine.get("job")

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

                result = db.LaundryMachine.update_one(myquery, data_body)

                db.LaundryJob.insert_one({
                    "machineID": str(machineID),
                    "userID": userID,
                    "jobID": newJobID,
                    "actionTimeHistory": [datetime.now().timestamp()],
                    "jobHistory": ["Reserved"]
                })

                return make_response("Successfully create new job and change from Available to Reserved", 200)

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

                result = db.LaundryMachine.update_one(myquery, data_body)

                jobUpdate = db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "Completed"
                    }}
                )

                return make_response("Successfully Completed the job", 200)

            elif status == "Available" and job == "Broken":
                # just update the machine without new entry
                data_body = {'$set':
                             {'job': job,
                                 'userID': userID,
                                 'startTime': datetime.now().timestamp()}
                             }

                result = db.LaundryMachine.update_one(myquery, data_body)

                return make_response("Successfully change the machine to Broken", 200)

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
                result = db.LaundryMachine.update_one(myquery, data_body)
                jobUpdate = db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "In Use"
                    }}
                )

                return make_response("Successfully update job from Reserved to In Use", 200)

            elif status in ['Uncollected', 'Alerted'] and job == "Alerted":
                # just update the database without creating new entry
                data_body = {'$set':
                             {'job': job,
                                 'userID': userID,
                              }
                             }

                jobID = db.LaundryMachine.find_one(
                    {'machineID': machineID}).get("jobID")
                result = db.LaundryMachine.update_one(myquery, data_body)

                jobUpdate = db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "Alerted"
                    }}
                )

                return make_response("Successfully alerted the job", 200)

            elif job == "Cancelled":
                jobID = db.LaundryMachine.find_one(
                    {'machineID': machineID}).get("jobID")
                data_body = {'$set':
                             {'job': "Available",
                                 'userID': '',
                                 'duration': 0,
                                 'startTime': datetime.now().timestamp()}
                             }

                result = db.LaundryMachine.update_one(myquery, data_body)

                jobUpdate = db.LaundryJob.update_one(
                    {'jobID': int(jobID)},
                    {'$push': {
                        "actionTimeHistory": datetime.now().timestamp(),
                        "jobHistory": "Cancelled"
                    }}
                )

                return make_response("Successfully Cancelled and Reset the job", 200)
            else:
                return make_response("command not recognized", 400)
    except Exception as e:
        return {"err": str(e)}, 400


@app.route('/laundry/machine/startTime', methods=['GET'])
@cross_origin(supports_credentials=True)
def getStartTime():
    response = {}
    try:
        machineID = request.args.get('machineID')
        if machineID is None:
            raise Exception(
                "machine ID not provided as URL parameter, use ?machineID=...")

        machine = db.LaundryMachine.find_one(
            {'machineID': machineID}, {'job': 1, 'startTime': 1})

        if machine.get("job") not in ['Reserved', 'In Use']:
            raise Exception(
                "Only can fetch start time when the machine is Reserved or In Use")

        response['status'] = 'success'
        response['data'] = {
            'startTime': machine.get("startTime")
        }

        return make_response(response, 200)

    except Exception as e:
        response['status'] = 'failed'
        response['data'] = {
            'message': str(e)
        }

        return make_response(response, 404)


@app.route('/laundry/machine/editDuration', methods=['PUT'])
@cross_origin(supports_credentials=True)
def change_duration():
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

            result = db.LaundryMachine.update_one(myquery, data_body)

            return make_response("Successfully Update the duration", 200)
        else:
            return make_response("Can only update duration when its In Use, cannot change Reserved Timing")
    except Exception as e:
        return {"err": str(e)}, 400


@app.route('/laundry/job', methods=['GET'])
@cross_origin(supports_credentials=True)
def laundry_machine_by_job():
    try:
        machineID = request.args.get('machineID')
        userID = request.args.get('userID')
        jobID = request.args.get('jobID')

        if jobID:
            laundry_info = dumps(db.LaundryJob.find_one({'jobID': int(jobID)}))
            return make_response(laundry_info, 200)
        elif userID:
            laundry_info = dumps(db.LaundryJob.find({'userID': userID}))
            return make_response(laundry_info, 200)
        elif machineID:
            laundry_info = dumps(db.LaundryJob.find({'machineID': machineID}))
            return make_response(laundry_info, 200)
        else:
            return make_response(dumps(db.LaundryJob.find()), 200)
    except Exception as e:
        return make_response({"err": str(e)}, 400)


if __name__ == "__main__":
    # app.run(debug = True)
    app.run('0.0.0.0', port=8080)
