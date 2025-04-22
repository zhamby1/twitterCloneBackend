# Twitter Clone App

This is an app for SDEV 257 that is a twitter clone to test a backend.  We will be using Node and Express along with MongoDB to creat the app.

**If you wish to clone the app and just run it, see the instructions at the bottom of this document.**

## Express and Package Install
You will need node installed to create this app.  Make sure you run the following to initialize the app

```console
> npm init
```
I called our main entry point file app.js

We will need the following packages installed in order for this app to work

- Express - a JS server backend that will take our routes/URLS and bind them to functions

- Mongoose - JS package that allows us to query and modify a MongoDB daatabase

- CORS - allows for cross-origin scripting.  Other web apps can run scripts against this server

- dotenv - allow us to use a .env file that hides our creditentials and secret password from other developers using our app

```console
> npm install express mongoose cors dotenv
```
We will also install the nodemon package to better help with developer error handling and hot-reloading

```console
> npm install nodemon --save-dev
```

You will then create an app.js file.

You will begin to code the app in the following steps.  When you are ready to run your app type in the following command in the terminal:

```console
> npx nodemon app.js
```
You can visit your application by using a web browser and typing in the following url (this is by default if you set your app up and the app.js file like I did in this project):

<localhost:3000>

To test your API requests to grab tweets or post new tweets, you can use the VsCode extention EchoClient.  Watch the lecture for more information.

## Express
We will be using express to make our server respond to requests.  Backends work by taking a request from the user, and providing a response.

Express does this through REST.  What this means is we will tie URL routes to functions.  A route is just a url path that can route the user using functions.  It is different than a link because there is some functionality to it.

Routes need the URL path and the HTTP method

HTTP Methods
- GET - Grabs data
- POST - Adds data to database
- PUT - Update existing data
- DELETE - Delete Data


Express route example and syntax

` app.HTTPMETHOD("URLPATH",function that runs)`

```js
app.get("/hello", function(req,res){
    //send data back 
    //we use the res (response).send to send back something
    res.send("Hello")
})
```

## Database
We are going to use MongoDB for our database..we will use the cloud version of MognoDB called Atlas

Got to this url

<https://www.mongodb.com/products/platform/atlas-database?tck=exp-815>

And click get started. Sign up or user a Google account.

Click on the Free Tier so that you do not pay money and name your DB cluster

It will ask you to create a username and password for the DB.  Make whatever you wish and click create user.

Under the Add a Connection section click on Network Access

Click Add An Ip Address and then click allow access from anywhere, and click confirm

In the menu click on Database the Cluster and then click on the connect button

Click on drivers, and select Node.js. Your connection string is displayed for you to copy

You will have to change the password to the password created in the previous step.

## DotENV

we will make a .env file to store our connection so it is secure.  Add a new file and call it .env

Then add the MONGO_URI variable and have it equal your connection string (make sure that you change the password to the password you created in the previous step)

## Mongoose and MongoDB
Mongo is a NoSQL database..these are some of the differences between a SQL and NoSQL database

- There is no set structure to a NoSQL database
- Mongo uses something called documents instead of tables
- Documents look like a collection of JavaScript or JSON objects
- Unlike SQL, repetition is ok or even encouraged
- Another advantage is that if your application changes or we add fields, then it is of no issue to a MongoDB document

Now, that being said, we do like to model our data to look a certain way when we use Mongo.  That way we always know the data is correct that we are sending to the database, and it has a certain format

In our app.js file we will create a schema for our Tweet that looks like following/has the following fields:

| Name | Data Type |
| ---- | --------- |
| user | String    |
| content | String |
|createdAt | Date (using a default of Date.now) |

Here is a list of all the Mongo Model Data Types:
<https://mongoosejs.com/docs/schematypes.html>

Here is a list of all the queries you can do in Mongoose: 
<https://mongoosejs.com/docs/queries.html>

Here is an example of the schema/model you would use in the app.js file

```js
const Tweet = mongoose.model('Tweet', new mongoose.Schema({
    //the schema uses a name : data type
    user: String,
    content: String,
    createdAt: {type: Date, default: Date.now}
}))
```

Here is an example of a get request to grab all the Tweets

```js
app.get("/tweets", async function(req,res){
    //this is a mongoose method that is called .find...it finds all the entries in a database
    const tweets = await Tweet.find()
    res.json(tweets)

})
```

Check out the app.js file for the implementation of the model and the GET (grab all tweets) and POST (add a tweet to the DB) routes.

## Deploying Backend
We will use Railway to deploy or app
URL - <https://railway.com>

First create a Github repo of your project (make sure it is public)


Click on deploy app from Github and select your Repo

Then click on variables and New.  Add MONGO_URI variable and the connection string as the value (you may have to apply the changes)

Let Railway Deploy the App

Then click on the deployment, and find the deployment section and Generate a New Domain.  This is the url you will use to this API.