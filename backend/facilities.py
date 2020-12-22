from flask import Flask, request
import pymongo, json
from datetime import datetime
#MongoDB
myclient = pymongo.MongoClient("mongodb+srv://rhdevs-admin-db:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = myclient.test


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
        data = db.Facilities.find()
        print(data)
    except Exception as e:
        return {"err": e}, 400
    return data, 200

@app.route('/bookings/user/<userID>')
def user_bookings(userID) :
    try:
        data = db.Bookings.find({"userID" : userID})
        data = "Test 2"
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@app.route('/bookings/facility/<facilityID>/')
def check_bookings(facilityID):
    print('TESTING 0')
    try :
        startDate = datetime.strptime(request.args.get('startDate'), "%Y-%m-%d").date()
        endDate = datetime.strptime(request.args.get('endDate'), "%Y-%m-%d").date()
        data = db.Bookings.find({"facilityID": facilityID, "startDate" : {"$gt": startDate}, "endDate": {"$lt" : endDate}})
        data = {"start" : startDate, "end" : endDate,"test" : "Test 3"}
    except Exception as e:
        return {"err": e}, 400

    return data, 200
@app.route('/users/telegramID/<userID>')
def user_telegram(userID) :
    try :
        data = db.User.find({"userID" : userID})['telegramHandle']
        data = userID
    except Exception as e:
        print(e)
        return {"err": e}, 400
    return data, 200

@app.route('/bookings', methods=['POST'])
def add_booking() :
    try:
        formData = request.form
        db.Bookings.insertOne(formData)
        print(formData, " test4")
    except Exception as e:
        return {"err": e}, 400

    return {"message": "Booking Confirmed"}, 200




@app.route('/bookings/<bookingID>', methods=['GET'])
def get_booking(bookingID) :
    try:
        #data = db.Bookings.find({"bookingID":bookingID}), 200
        data = bookingID + " Test 5"
    except Exception as e:
        return {"err": e}, 400
    return data, 200
     
@app.route('/bookings/<bookingID>', methods=['PUT'])
def edit_booking(bookingID) :
    try : 
        if request.cookies.get("userID") == db.Bookings.find({"bookingID" : bookingID})['userID'] :
            db.Bookings.findOneAndUpdate({"bookingID": bookingID}, {request.form})
            print(bookingID, request.form, "Test6")
        else:
            return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        return {"err": e}, 400
    
    return {"message" : "Booking edited"}, 200


@app.route('/bookings/<bookingID>', methods=['DELETE'])
def delete_booking(bookingID) :
    try :
        if request.cookies.get("userID") == db.Bookings.find({"bookingID" : bookingID}).get('userID') :
            db.Bookings.remove({"bookingID" : bookingID})
            print(bookingID, "Test7")
        else:
            return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        return {"err": e}, 400
    
    return {"message" : "Booking Deleted"}, 200

if __name__ == '__main__':
   app.run(debug = True)

def authenticate(cookie) :
    userID = cookie.get('userID')
    sessionID = cookie.get('sessionID')
    serverSession = session.get("userID")

    if not userID or not sessionID or not serverSession :
        return False

    if not db.User.find({"userID" : userID}) :
        return False
    
    if serverSession.get("sessionID") != sessionID :
        return False

    if serverSession.get("startTime") + datetime.timeDelta(0, serverSession.get("expiry") * 60) < datetime.today() :
        return False

    return True