from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

import pymongo, json
from datetime import datetime

def removeObjectID(xs):
    for i,item in enumerate(xs, start=0) :
        del xs[i]["_id"] 
    return xs

def listToIndexedDict(xs):
    output = {}
    for i,item in enumerate(xs, start=0) :
        del xs[i]["_id"]
        output[i] = item
    return output    

#MongoDB
myclient = client = pymongo.MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]

#Flask
app = Flask("rhapp")
cors = CORS(app)
app.config['CORS_HEADERS'] = "Content-Type";

#Session
session = {}
#session format : {userID: {
#                           sessionID: VALUE
#                           startTime : VALUE 
#                           expiry : VALUE
#                  }}

@app.route('/')
@cross_origin()
def root_route():
    return 'What up losers'

@app.route('/facilities/all/')
@cross_origin()
def all_facilities(): 
    try :
        data = removeObjectID(list(db.Facilities.find()))
        
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    response = make_response(json.dumps(list(data), default = lambda o:str(o)), 200)
    return response

@app.route('/bookings/user/<userID>')
@cross_origin()
def user_bookings(userID) :
    try:
        data = removeObjectID(list(db.Bookings.find({"userID" : userID})))
    except Exception as e:
        return {"err": str(e)}, 400
    return make_response(json.dumps(list(data), default = lambda o:str(o)), 200)


@app.route('/bookings/facility/<facilityID>/')
@cross_origin()
def check_bookings(facilityID):
    #print('TESTING 0')
    try :
        data = removeObjectID(list(db.Bookings.find({"facilityID": int(facilityID), "startTime" : {"$gte": int(request.args.get('startDate'))}, "endTime": {"$lte": int(request.args.get('endDate'))}})))
        #print(data)
    except Exception as e:
        return {"err": str(e)}, 400

    return make_response(json.dumps(list(data), default = lambda o:str(o)), 200)
    
@app.route('/users/telegramID/<userID>')
@cross_origin()
def user_telegram(userID) :
    try :
        data = list(db.User.find({"userID" : userID}))
        if len(data) > 0 :
            data = {"telegramHandle": data[0]['telegramHandle']}
        else :
            return {"err" : "No User Found"}, 400
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return data, 200

@app.route('/bookings', methods=['POST'])
@cross_origin()
def add_booking() :
    try:
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
        formData = request.get_json()
        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])
        formData["facilityID"] = int(formData["facilityID"])
        formData["ccaID"] = int(formData["ccaID"])

        if (formData["endTime"] < formData["startTime"]) :
            raise Exception("End time eariler than start time")    
        # else:
        #     return {"err": "Unauthorised Access"}, 401
        lastbookingID = list(db.Bookings.find().sort([('_id', pymongo.DESCENDING)]).limit(1))

        newBookingID = 1 if len(lastbookingID) == 0 else int(lastbookingID[0].get("bookingID")) + 1

        formData["bookingID"] = newBookingID
        print(formData)
        db.Bookings.insert_one(formData)
        
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

    return {"message": "Booking Confirmed"}, 200

@app.route('/bookings/<bookingID>', methods=['GET'])
@cross_origin()
def get_booking(bookingID) :
    try:
        print(bookingID)
        data = listToIndexedDict(list(db.Bookings.find({"bookingID":bookingID})))
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return data, 200
     
@app.route('/bookings/<bookingID>', methods=['PUT'])
@cross_origin()
def edit_booking(bookingID) :
    try : 
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
            print(bookingID, request.get_json(), "Test6")
            db.Bookings.update_one({"bookingID": bookingID}, { "$set": request.get_json()})
            
        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    
    return {"message" : "Booking edited"}, 200


@app.route('/bookings/<bookingID>', methods=['DELETE'])
@cross_origin()
def delete_booking(bookingID) :
    try :
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0].get('userID') :
            db.Bookings.delete_one({"bookingID" : int(bookingID)})
            print(bookingID, "Test7")
        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400 
    
    return {"message" : "Booking Deleted"}, 200

if __name__ == '__main__':
   app.run('0.0.0.0', port=8080)