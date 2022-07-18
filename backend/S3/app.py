from boto3 import client, resource
from S3.credentials import ACCESS_KEY, SECRET_ACCESS_KEY, BUCKET_LOCATION
import botocore # for S3-related error handling, see: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/error-handling.html

user = client(
    's3',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name='ap-southeast-1'
)

res = resource(
    's3',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name='ap-southeast-1'
)

bucket = res.Bucket(BUCKET_LOCATION)


def fileExist(key):
    obj = list(bucket.objects.filter(Prefix=key))
    if len(obj) > 0:
        return True
    else:
        return False

# create


def create(key, fileLocation):
    user.upload_file(fileLocation, BUCKET_LOCATION, key)

# read


def read(key):
     PresignedUrl = user.generate_presigned_url(
     'get_object', Params={'Bucket': BUCKET_LOCATION, 'Key': key}, ExpiresIn=3600)
     return PresignedUrl


# update


def update(oldKey, newKey, fileLocation=''):
    try:    
        if not fileExist(oldKey):
            raise FileNotFoundError
        if fileLocation == '':
            newObj = bucket.Object(newKey)
            newObj.copy_from(CopySource=BUCKET_LOCATION+'/'+oldKey)
            delete(oldKey)
        else:
            delete(oldKey)
            create(newKey, fileLocation)
    except botocore.exceptions.ClientError as e:
        print(e)

# delete
def delete(key):
    if not fileExist(key):
        raise FileNotFoundError
    obj = bucket.Object(key)
    obj.delete()