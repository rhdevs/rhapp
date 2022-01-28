from db import *
from flask import Blueprint
import pymongo
import sys
from datetime import datetime
sys.path.append("../")

gym_api = Blueprint("gym", __name__)

@gym_api.route("/")
def hello():
    return "Welcome"