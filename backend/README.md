# rhapp-backend
Backend Repo for RHApp
<hr style="border:2px solid blue"> </hr>

# Stacks Used 
RHApp backend uses **MongoDB** to as the database, and **Flask** as the API Server ( which is a Python based framework ). Clone this github repo and to install the libaries, run the following code ( in the virtual environment preferably to maintain the correct versioning ).

<code>pip install -r requirements.txt</code>

For **MongoDB** development, it is also suggested to install **MongoDB Compass** which is the GUI that helps to interact with the database much easier. Moreover, please test each endpoint using **postman** before you deploy it and adhere to the github/restful practices !

# Middleware 
RHApp middleware acts as an intermediary between the front-end code that runs on local host and the server. Because the hosting server most likely is hosted using http, there would be a CORS problem if the front-end code is run directly from local-host and tries to fetch the data from the Repl.it data directly. 

# Linting
For code standardization, please install **pylint** by enabling VSCode Python linter. *Pylint* use **autoenv8** code formatting standard and you can enable save on formatting on VSCode to help VSCode adjust your code according to *Pylint* recommendation.

# Current Project Structure
There are 2 branches, **main** and **development**, the development branch is used for features and changes that are still in experimental phase. Hence, push all the features first to **development** and if the features are already verified and **reviewed**, please push it to the main 

The current Project Structure is : <br/>
-/main.py <br/> 
&emsp;|-/Laundry/LaundryAPI.py <br/>
&emsp;|-/FacilityBooking/FacilityAPI.py <br/>
&emsp;|-/Social/SocialAPI.py <br/>
&emsp;|-/Scheduling/SchedulingAPI.py <br/>
&emsp;|-/Authentication/AuthenticationAPI.py <br/>
 
 **main.py** is the main entry point for the server, this can be run using 
 
<code>python main.py</code>

And each folder is a feature for the [app](https://rhapp.lol).

# RESTFUL practice 

Current standardization is to put  **<domain>/v1/<endpoint>**, for more specific restful practice, please read some articles online such as https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api which is a pretty good resource. 
   
Some general pointer :
1. Use Noun instead of Verb
2. All resources should be put under the same noun, and what action to be done should be differentiated by the API method, for eg. /users should have PUT, DELETE, GET, etc
3. For collection, use plural instead of singular such as users instead of user 
4. For API, incoming body message and URL parameters should be get from **request** and returned in form of JSON using **response**, <br/>
Response for successful message should have the keys => "status" : "sucesssful", "data"<br/>
Response for failed message should have the keys => "status" : "failed", "err" : "<error message>"<br/>
Return the response type as specific as possible
5. Use **make_response** and **jsonify** from flask to return
6. For other files except the main.py, use blueprint (please refer to existing file such as LaundryAPI.py)
7. To make the endpoints more specific, use /<int:sth>, but for parameters, use URL Arguments using ?= such as token, startTime, etc
   
**Return Format** Example
```
response = {"status":"success", "data": {"facilities": []}}
response = {"err": "Error message here", "status":"failed"}

POST/EDIT/DELETE
response = {"status":"success"}

return make_response(response)
```
**For PUT / POST** request, please check whether the item exists in the first place, otherwise throw error

**Naming** Example
* /bookings – get all bookings
* /bookings/<ID> - get 1 booking

**Filtering and Pagination**
<code>/bookings?page=</code>
* Pagination - "page=1"
* Filtering - use parameter name eg: "startTime"

**Important note, get MongoDB 101 Slide from Junxiang or your BE Head to learn MongoDB further, also get db.py from the repl.it or your BE Head**

# Git Practice 

Check the https://www.youtube.com/watch?v=BUGjkDVsH_Y, **Intro to Git** by NUS Hackers, this is a very good resource. **Main is a protected branch, you should not commit to main directly**. General pointers:
1. Please use <code> git checkout -b <branch> </code> for every change/features that you are doing 
2. Use **pull request** to the **deployment** after you done with the work, and ask for review 
3. For every **pull request**, please link it to the issue using github reseved keywords such as resolved, fixed, etc
4. Move your card from to do list to pending review, this card can be found in the projects (Or ask your head on how to do it)
5. After its tested and review, merge the main and deployment using another pull request from deployment.

# Workflow

In general, the flow of the work would be 
1. Every 1-2 Weeks, there would be a SCRUM meeting
2. In every meeting, the team would decide the key KPI and what would be done in the projects (By right, every week should make a new Kanban project)
3. Not only that, every team member should mention what they have done, what are they doing, what are the blockers
4. Then for existing issues, put the issues that wants to be finished into the project, and assign the project accordingly
5. After every to do is done, please ask for **Review** and push it to **deployment** for experimental
6. If you are sure you are done, merge the main and deployment, and git pull the repl.it
   
# Deployment
Currently, we are using Repl.it, where you can just git pull using the version control feature from the repl.it, **do not modify the code directly from repl.it**, please use github and ask for review.

# Important
Please ask the DB Username, password and API_key from your BE Head !
