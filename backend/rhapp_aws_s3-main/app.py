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

def file_exist(key):
    obj = list(bucket.objects.filter(Prefix=key))
    if len(obj)>0:
        return True
    else:
        return False

#create
def create(key, fileLocation):
    obj = bucket.Object(key)
    img = Image.open(fileLocation)
    fileName, fileExtension = os.path.splitext(fileLocation)
    fileExtension = fileExtension[1:]
    image_stream = io.BytesIO()
    img.save(image_stream, format=fileExtension)
    image_stream.flush()
    obj.put(Body=image_stream.getvalue())

#read
def read(key):
    if file_exist(key):
        presigned_url = user.generate_presigned_url('get_object', Params={'Bucket': bucketLocation, 'Key': key}, ExpiresIn=3600)
        return presigned_url
    else:
        raise FileNotFoundError

#update
def update(oldKey, newKey, fileLocation=''):
    if not file_exist(oldKey):
        raise FileNotFoundError
    newObj = bucket.Object(newKey)
    if fileLocation=='':
            newObj.copy_from(CopySource=bucketLocation+'/'+oldKey)
            delete(oldKey)
    else:
        delete(oldKey)
        create(newKey, fileLocation)
    

#delete
def delete(key):
    obj = bucket.Object(key)
    obj.delete()

create('pictures/stickman.png', 'assets/stickman.png')
#print(read('pictures/stickman2.png'))
#update('pictures/stickman2.png', 'pictures/stickman2.png', 'assets/stickman2.png')
#delete('pictures/profile.png')