from boto3 import client, resource
from credentials import ACCESS_KEY, SECRET_ACCESS_KEY
import io
import os
from PIL import Image

bucketLocation = 'rhapp-picture-bucket'

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

bucket = res.Bucket(bucketLocation)


def fileExist(key):
    obj = list(bucket.objects.filter(Prefix=key))
    if len(obj) > 0:
        return True
    else:
        return False

# create


def create(key, fileLocation):
    if fileExist(key):
        raise FileExistsError
    obj = bucket.Object(key)
    img = Image.open(fileLocation)
    fileName, fileExtension = os.path.splitext(fileLocation)
    fileExtension = fileExtension[1:]
    ImageStream = io.BytesIO()
    img.save(ImageStream, format=fileExtension)
    ImageStream.flush()
    obj.put(Body=ImageStream.getvalue())

# read


def read(key):
    if not fileExist(key):
        raise FileNotFoundError
    PresignedUrl = user.generate_presigned_url(
        'get_object', Params={'Bucket': bucketLocation, 'Key': key}, ExpiresIn=3600)
    return PresignedUrl

# update


def update(oldKey, newKey, fileLocation=''):
    if not fileExist(oldKey):
        raise FileNotFoundError
    newObj = bucket.Object(newKey)
    if fileLocation == '':
        newObj.copy_from(CopySource=bucketLocation+'/'+oldKey)
        delete(oldKey)
    else:
        delete(oldKey)
        create(newKey, fileLocation)


# delete
def delete(key):
    if not fileExist(key):
        raise FileNotFoundError
    obj = bucket.Object(key)
    obj.delete()
