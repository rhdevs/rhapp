############################
# Used to login to Pymongo #
#  Do not change anything  #
############################
import pymongo

AUTH_SECRET_KEY = ""
AUTH_PASSWORD_RESET_SECRET = "" 
URL = ""
client = pymongo.MongoClient(URL)
db = client["RHApp"]
