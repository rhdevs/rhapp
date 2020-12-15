from flask import Flask
import pymongo
from datetime import datetime
#MongoDB
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
db = myclient["mydatabase"]


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
        data = db.Facilities.find(), 200
    except Exception as e:
        return {"err": e}, 400
    return data, 200

@app.route('/bookings/<userID>')
def user_bookings(userID) :
    try:
        data = db.Bookings.find({"userID" : userID}), 200
    except Exception as e:
        return {"err": e}, 400
    return data, 200


@app.route('/bookings/<facilityID>/')
def check_bookings(facilityID):
    try :
        startDate = datetime.strptime(request.args.get('startDate'), "%Y-%m-%d")
        endDate = datetime.strptime(request.args.get('endDate'), "%Y-%m-%d")
        data = db.Bookings.find({"facilityID": facilityID, "startDate" : {"$gt": startDate}, "endDate": {"$lt" : endDate}})
    except Exception as e:
        return {"err": e}, 400

    return data, 200
@app.route('/users/telegramID/<userID>')
def user_telegram(userID) :
    try :
        data = db.User.find({"userID" : userID})['telegramHandle']
    except Exception as e:
        return {"err": e}, 400
    return data, 200

@app.route('/bookings', methods=['POST'])
def add_booking() :
    try:
        formData = request.form
        db.Bookings.insertOne(formData)
    except Exception as e:
        return {"err": e}, 400

    return {"message": "Booking Confirmed"}, 200




@app.route('/bookings/<bookingID>', methods=['GET'])
def get_booking(bookingID) :
    try:
        data = db.Bookings.find({"bookingID":bookingID}), 200
    except Exception as e:
        return {"err": e}, 400
    return data, 200
     
@app.route('/bookings/<bookingID>', methods=['PUT'])
def edit_booking(bookingID) :
    try : 
        if request.cookies.get("userID") == db.Bookings.find({"bookingID" : bookingID})['userID'] :
            db.Bookings.findOneAndUpdate({"bookingID": bookingID}, {request.form})
        else:
            return {"err": "Unauthorised Access"}, 401
    except Exception as e:
        return {"err": e}, 400
    
    return {"message" : "Booking edited"}, 200


@app.route('/bookings/<bookingID>', methods=['DELETE'])
def delete_booking(bookingID) :
    try :
        if request.cookies.get("userID") == db.Bookings.find({"bookingID" : bookingID})['userID'] :
            db.Bookings.remove({"bookingID" : bookingID})
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