from AuthFunction import authenticate
from db import *
from flask import jsonify, request, make_response
from AuthFunction import authenticate
from datetime import datetime
from flask_cors import cross_origin
from flask import Blueprint
import pymongo
import sys, copy

sys.path.append("../")

crowd_api = Blueprint("crowd", __name__)

@crowd_api.route('/')
@cross_origin()
def root_route():
    return 'What up losers'
