from boto3 import client, resource
from S3.credentials import ACCESS_KEY, SECRET_ACCESS_KEY

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
    user.upload_file(fileLocation, bucketLocation, key)

# read


def read(key):
    PresignedUrl = user.generate_presigned_url(
        'get_object', Params={'Bucket': bucketLocation, 'Key': key}, ExpiresIn=3600)
    if not fileExist(key):
        raise FileNotFoundError
    else:
        return PresignedUrl

# update


def update(oldKey, newKey, fileLocation=''):
    try:
        if not fileExist(oldKey):
            raise FileNotFoundError
        if fileExist(newKey):
            raise FileExistsError
        if fileLocation == '':
            newObj = bucket.Object(newKey)
            newObj.copy_from(CopySource=bucketLocation+'/'+oldKey)
            delete(oldKey)
        else:
            delete(oldKey)
            create(newKey, fileLocation)
    except Exception as e:
        print(e)


# delete
def delete(key):
    if not fileExist(key):
        raise FileNotFoundError
    obj = bucket.Object(key)
    obj.delete()