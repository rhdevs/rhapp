############################
# Used to login to Pymongo #
#  Do not change anything  #
############################
import pymongo

AUTH_SECRET_KEY = "rhdevs-32806134351679125416"
AUTH_PASSWORD_RESET_SECRET = "rhdevs" 
URL = "mongodb+srv://rhdevs-db-admin:6fEN9J9ZSXFmbSd@cluster0.0urzo.mongodb.net/test?authSource=admin&replicaSet=atlas-aldpli-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
client = pymongo.MongoClient(URL)
db = client["RHApp"]
