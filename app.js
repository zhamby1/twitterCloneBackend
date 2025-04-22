//grab our dependecies or packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 3000

//we make an instance of the epxpress package
const app = express()
//when we use middleware or other types of packages we often say app.use
app.use(cors())
app.use(express.json())

//connect to our mongo DB using mongoose which is a js package to make mongo easier
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log("Mongo Connected"))
.catch(err => console.log(err))

//model - aka a schema which shows how the data should look using Mongoose
const Tweet = mongoose.model('Tweet', new mongoose.Schema({
    //the schema uses a name : data type
    user: String,
    content: String,
    createdAt: {type: Date, default: Date.now}
}))



//using routes
//make a route for /tweets that grab all the tweets
app.get("/tweets", async function(req,res){
    //this is a mongoose method that is called .find...it finds all the entries in a database
    const tweets = await Tweet.find()
    res.json(tweets)

})

//add tweets to database using a post request
//we can use the same url path as long as the HTTP request is different
app.post("/tweets", async(req,res) => {
    //when sending data to the backend, it is stored in something known as the requests body
    const tweet = new Tweet(req.body)
    await tweet.save()
    res.status(201).json(tweet)
})

//start our server we say app.listen(portnumber).  the portnumber can be determined by you.
//often times we give it an or statement that says run on this port or the OS primary port for web servers
//this is important because when we deploy our application it will start on the apporpriate port for that particular Os/Machine 

//use app.listen to listen for requests from a port
app.listen(PORT, () => console.log("Server running"))