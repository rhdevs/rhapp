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
app.config['CORS_HEADERS'] = "Content-Type";
# app.config.from_object(os.environ['APP_SETTINGS'])

client = MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = client.RHApp

@app.route('/', methods = ['GET'])
@cross_origin(supports_credentials=True)
def home_page(): 
    # landing page 
    # return make_response(render_template("index.html"), 200);
    return make_response("Laundry API", 200);

@app.route('/location', methods = ['GET'])
@cross_origin(supports_credentials=True)
def all_location():
    try : 
        all_location = db.LaundryLocation.find();
        return make_response(json.dumps(list(all_location), default = lambda o:str(o)), 200)
    except Exception as e:
        return make_response({"err" : str(e)}, 400)

@app.route('/location/<int:block_num>', methods = ['GET'])
@cross_origin(supports_credentials=True)
def location(block_num):
    try : 
        block_info = dumps(db.LaundryLocation.find({'block' : block_num})) 
        return make_response(block_info, 200)
    except Exception as e :
        return make_response({"err" : str(e)}, 400)

@app.route('/laundry/machine', methods = ['GET', 'POST'])
@cross_origin(supports_credentials=True)
def laundry_by_location():
    try :
        job = request.args.get('job')
        locationID = request.args.get('locationID')
        type = request.args.get('type')
        machineID = request.args.get('machineID')

        if request.method == 'GET':
            if machineID :
                laundry_info = dumps(db.LaundryMachine.find_one({'machineID' : machineID}))
                return make_response(laundry_info, 200)
            elif locationID : 
                laundry_info = dumps(db.LaundryMachine.find({'locationID' : locationID}))
                return make_response(laundry_info, 200)
            elif job and type :
                laundry_info = dumps(db.LaundryMachine.find({'job' : job, 'type' : type}))
                return make_response(laundry_info, 200)
            elif type :
                print(type)
                laundry_info = dumps(db.LaundryMachine.find({'type' : type}))
                return make_response(laundry_info, 200)
            elif job : 
                laundry_info = dumps(db.LaundryMachine.find())
                return make_response(laundry_info, 200)
            else :
                return make_response(dumps(db.LaundryMachine.find()), 200)
            
        elif request.method == 'POST':
            data = request.get_json()          
            # it is possible to change into JSON format, using request.json to check 
            job = str(data.get("job"))
            machineID = str(data.get("machineID"))
            userID = str(data.get("userID"))

            myquery = {
                'machineID' : machineID
            }
            currMachine = db.LaundryMachine.find_one({'machineID' : machineID})
            status = currMachine.get("job")
            currentDuration = currMachine.get("duration")
            
            if status == "Available" and job == 'None':
                # if status is Available, change the job to In Use 
                # create a new entry in the laundryJob collections
                lastjobID = db.LaundryJob.find_one(sort=[( '_id', pymongo.DESCENDING )])
                newJobID = 1 if lastjobID is None else int(lastjobID.get("jobID")) + 1

                data_body = {'$set' : 
                                {'job' : "Reserved",
                                 'jobID' : newJobID,
                                 'userID' : userID,
                                'startTime' : datetime.now().timestamp()}
                        }
                
                result = db.LaundryMachine.update_one(myquery, data_body)
                
                db.LaundryJob.insert_one({
                    "machineID" : str(machineID),
                    "userID" : userID,
                    "jobID" : newJobID,
                    "actionTimeHistory" : [datetime.now().timestamp()],
                    "jobHistory" : ["Reserved"]
                })
                
                return make_response("Successfully create new job and change from Available to Reserved", 200)
            
            elif status == "Available" and (job not in ['Broken']):
                #for admin use, change Available to Broken
                raise Exception('you can only change to Broken from Available')
            
            elif status == "Broken" and (job != 'Available'):
                raise Exception('From Broken, you can only make it to Available')
            
            elif status in ["In Use", "Alerted"] and job == "Completed": 
                jobID = db.LaundryMachine.find_one({'machineID' : machineID}).get("jobID")
                data_body = {'$set' : 
                                {'job' : "Available",
                                 'userID' : userID,
                                'startTime' : datetime.now().timestamp()}
                        }
                
                result = db.LaundryMachine.update_one(myquery, data_body)
                
                jobUpdate = db.LaundryJob.update_one(
                    {'jobID' : int(jobID)},
                    {'$push' : {
                        "actionTimeHistory" : datetime.now().timestamp(),
                        "jobHistory" : "Completed"
                    }}
                )
   
                return make_response("Successfully Completed the job", 200)
            
            elif status == "Available" and job == "Broken" :
                #just update the machine without new entry 
                data_body = {'$set' : 
                                {'job' : job,
                                 'userID' : userID,
                                'startTime' : datetime.now().timestamp()}
                        }
                
                result = db.LaundryMachine.update_one(myquery, data_body)
                
                return make_response("Successfully change the machine to Broken", 200)
            
            elif status == "Reserved" and job == 'None':
                if(int(currentDuration) == 0):
                    return make_response("cannot start with duration 0", 400)
                
                data_body = {'$set' : 
                                {'job' : "In Use",
                                 'userID' : userID,
                                'startTime' : datetime.now().timestamp()}
                        }
                
                jobID = db.LaundryMachine.find_one({'machineID' : machineID}).get("jobID")
                result = db.LaundryMachine.update_one(myquery, data_body)
                
                jobUpdate = db.LaundryJob.update_one(
                    {'jobID' : int(jobID)},
                    {'$push' : {
                        "actionTimeHistory" : datetime.now().timestamp(),
                        "jobHistory" : "In Use"
                    }}
                )
   
                return make_response("Successfully update job from Reserved to In Use", 200)
            
            elif status in ["In Use", "Alerted"] and job == "Alerted":
                # just update the database without creating new entry
                data_body = {'$set' : 
                                {'job' : job,
                                 'userID' : userID,
                                'startTime' : datetime.now().timestamp()}
                        }
                
                jobID = db.LaundryMachine.find_one({'machineID' : machineID}).get("jobID")
                result = db.LaundryMachine.update_one(myquery, data_body)
                
                jobUpdate = db.LaundryJob.update_one(
                    {'jobID' : int(jobID)},
                    {'$push' : {
                        "actionTimeHistory" : datetime.now().timestamp(),
                        "jobHistory" : "Alerted"
                    }}
                )
   
                return make_response("Successfully alerted the job", 200)
            
            elif job == "Cancelled":
                jobID = db.LaundryMachine.find_one({'machineID' : machineID}).get("jobID")
                data_body = {'$set' : 
                                {'job' : "Available",
                                 'userID' : '',
                                'startTime' : datetime.now().timestamp()}
                        }
                
                result = db.LaundryMachine.update_one(myquery, data_body)
                
                jobUpdate = db.LaundryJob.update_one(
                    {'jobID' : int(jobID)},
                    {'$push' : {
                        "actionTimeHistory" : datetime.now().timestamp(),
                        "jobHistory" : "Cancelled"
                    }}
                )
   
                return make_response("Successfully Cancelled and Reset the job", 200)
            else :
                return make_response("command not recognized", 400)
    except Exception as e :
        return {"err" : str(e)}, 400
     
@app.route('/laundry/machine/editDuration', methods = ['PUT'])
@cross_origin(supports_credentials=True)
def change_duration():
    try : 
        form = request.form 
        # it is possible to change into JSON format, using request.json to check 
        duration = int(form.get("duration"))
        machineID = str(form.get("machineID"))

        myquery = {
            'machineID' : machineID
        }
        
        status = db.LaundryMachine.find_one({'machineID' : machineID}).get("job")
        
        if status in ['Available', 'Reserved']:
            data_body = {'$set' : 
                            {'duration' : duration}
                    }
            
            result = db.LaundryMachine.update_one(myquery, data_body)
            
   
            return make_response("Successfully Update the duration", 200)
        else :
            return make_response("Can only update duration when its Available or Reserved")
    except Exception as e :
        return {"err" : str(e)}, 400
    
@app.route('/laundry/job', methods = ['GET'])
@cross_origin(supports_credentials=True)
def laundry_machine_by_job():
    try :
        machineID = request.args.get('machineID')
        userID = request.args.get('userID')
        jobID = request.args.get('jobID')
        
        if jobID:
            laundry_info = dumps(db.LaundryJob.find_one({'jobID' : int(jobID)}))
            return make_response(laundry_info, 200)
        elif userID :
            laundry_info = dumps(db.LaundryJob.find({'userID' : userID}))
            return make_response(laundry_info, 200)
        elif machineID :
            laundry_info = dumps(db.LaundryJob.find({'machineID' : machineID}))
            return make_response(laundry_info, 200)
        else :
            return make_response(dumps(db.LaundryJob.find()), 200)
    except Exception as e :
        return make_response({"err" : str(e)}, 400)

if __name__ == "__main__":
    # print(os.environ['APP_SETTINGS'])
    app.run(debug = True)
