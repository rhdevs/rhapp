###########################################################################
#            1. Stores the name and url of the profile picture            #
###########################################################################
from db import db

studentNumber = input("Input the student number to upload the file to AWS to: ")
userName = db.Profiles.find_one({"userID":studentNumber}).get("displayName")
imageUrl = db.Profiles.find_one({"userID":studentNumber}).get("profilePictureUrl")

###########################################################################
#         2. Logic to download image to local file called images          #
###########################################################################

import urllib.request

def dl_jpg(url, file_path, file_name):
    full_path = file_path + file_name + '.jpg'
    urllib.request.urlretrieve(url, full_path)

dl_jpg(imageUrl, 'images/', userName)

############################################################################
#                3. Logic to upload file to AWS bucket                     #
############################################################################

from secrets import access_key, secret_access_key
import boto3
from botocore.client import Config

BUCKET_NAME = "rhapp-picture-bucket"
photo = userName + ".jpg"
data = open("images/" + photo, 'rb')
s3 = boto3.resource(
    's3',
    aws_access_key_id = access_key,
    aws_secret_access_key = secret_access_key,
    config=Config(signature_version='s3v4')
)

s3.Bucket(BUCKET_NAME).put_object(Key=photo, Body=data)

############################################################################
#         4. Logic to delete image from local file after uploading         #
############################################################################
import os

os.remove("images/" + photo)

########################### End of Code #####################################

# Input the student ID from the database
#
# Logic 1. Retrieves the name and the profile picture
# Logic 2. Downloads the profile picture into the images folder.
# Logic 3. Upload the profile picture from local images folder onto the AWS S3.
# Logic 4. Deletes the profile picture from the local images folder