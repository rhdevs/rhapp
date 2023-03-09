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

superpage_api = Blueprint("superpage", __name__)

@superpage_api.route("/")
@cross_origin()
def hello():
    return "Welcome the Raffles Hall Superpage Server"