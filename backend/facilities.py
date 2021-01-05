from flask import Flask, request
import pymongo, json
from datetime import datetime

def listToIndexedDict(xs):
    output = {}
    for i,item in enumerate(xs, start=0) :
        del xs[i]["_id"]
        output[i] = item
    return output

def removeObjectID(xs):
    for i,item in enumerate(xs, start=0) :
        del xs[i]["_id"] 
    return xs



#MongoDB
myclient = client = pymongo.MongoClient("mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient["RHApp"]


#Flask
app = Flask("rhapp")

#Session
session = {}
#session format : {userID: {
#                           sessionID: VALUE
#                           startTime : VALUE 
#                           expiry : VALUE
#                  }}

@app.route('/')
def root_route():
    return 'What up losers'

@app.route('/facilities/all')
def all_facilities(): 
    try :
        print("testing 1")
        data = listToIndexedDict(list(db.Facilities.find()))
        print(data)

        
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return data, 200

@app.route('/bookings/user/<userID>')
def user_bookings(userID) :
    try:
        data = listToIndexedDict(list(db.Bookings.find({"userID" : userID})))
    except Exception as e:
        return {"err": str(e)}, 400
    return data, 200


@app.route('/bookings/facility/<facilityID>/')
def check_bookings(facilityID):
    #print('TESTING 0')
    try :
        data = listToIndexedDict(list(db.Bookings.find({"facilityID": int(facilityID), "startTime" : {"$gte": int(request.args.get('startDate'))}, "endTime": {"$lte": int(request.args.get('endDate'))}})))
        #print(data)
    except Exception as e:
        return {"err": str(e)}, 400
    return data

    return data, 200
    
@app.route('/users/telegramID/<userID>')
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
def add_booking() :
    try:
        print("Testing 2")
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
        formData = request.form.to_dict()

        formData["startTime"] = int(formData["startTime"])
        formData["endTime"] = int(formData["endTime"])

        formData["bookingID"] = int(formData["bookingID"])
        formData["facilityID"] = int(formData["facilityID"])
        formData["ccaID"] = int(formData["ccaID"])

        if (formData["endTime"] < formData["startTime"]) :
            raise Exception("End time eariler than start time")    
        # else:
        #     return {"err": "Unauthorised Access"}, 401    
        
        print(formData["startTime"], " test4")
        db.Bookings.insert(formData)
        
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400

    return {"message": "Booking Confirmed"}, 200




@app.route('/bookings/<bookingID>', methods=['GET'])
def get_booking(bookingID) :
    try:
        data = listToIndexedDict(list(db.Bookings.find({"bookingID":bookingID})))
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    return data, 200
     
@app.route('/bookings/<bookingID>', methods=['PUT'])
def edit_booking(bookingID) :
    try : 
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0]['userID'] :
            print(bookingID, request.form.to_dict(), "Test6")
            db.Bookings.update_one({"bookingID": bookingID}, { "$set": request.form.to_dict()})
            
        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    
    return {"message" : "Booking edited"}, 200


@app.route('/bookings/<bookingID>', methods=['DELETE'])
def delete_booking(bookingID) :
    try :
        # if request.cookies.get("userID") == list(db.Bookings.find({"bookingID" : bookingID}))[0].get('userID') :
            db.Bookings.remove({"bookingID" : bookingID})
            print(bookingID, "Test7")
        # else:
        #     return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        print(e)
        return {"err": str(e)}, 400
    
    return {"message" : "Booking Deleted"}, 200

if __name__ == '__main__':
   app.run(debug = True)

# def authenticate(cookie) :
#     userID = cookie.get('userID')
#     sessionID = cookie.get('sessionID')
#     serverSession = session.get("userID")

#     if not userID or not sessionID or not serverSession :
#         return False

#     if not db.User.find({"userID" : userID}) :
#         return False
    
#     if serverSession.get("sessionID") != sessionID :
#         return False

#     if serverSession.get("startTime") + datetime.timeDelta(0, serverSession.get("expiry") * 60) < datetime.today() :
#         return False

#     return True


    