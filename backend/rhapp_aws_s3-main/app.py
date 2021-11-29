from boto3 import client, resource
from credentials import ACCESS_KEY, SECRET_ACCESS_KEY
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import io
from PIL import Image, ImageGrab

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

bucket = res.Bucket('rhapp-picture-bucket')

#create
def create(file):
    obj = bucket.Object(file)
    img = Image.open('stickman.png')
    image_stream = io.BytesIO()
    img.save(image_stream, format='png')
    image_stream.flush()
    obj.put(Body=image_stream.getvalue())

#read
def read(file):
    obj = bucket.Object(file)
    image_stream = io.BytesIO()
    obj.download_fileobj(image_stream)
    img = mpimg.imread(image_stream, format='jpg')
    imgplot = plt.imshow(img)
    plt.show()

#update
def update(file):
    delete(file)
    create(file)

#delete
def delete(file):
    obj = bucket.Object(file)
    obj.delete()

#create('pictures/stickman.png')
#read('pictures/stickman2.png')
#update('pictures/stickman2.png')
#delete('pictures/profile.png')