//grab our dependecies or packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const User = require('./models/User')
const jwt = require('jsonwebtoken')


//protect our tweet posting or anything really we want to protect...users cannot post unless they are logged in
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, 'secret');
      req.userId = decoded.id;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  };


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
app.post("/tweets", authMiddleware, async(req,res) => {
    //when sending data to the backend, it is stored in something known as the requests body
    const tweet = new Tweet(req.body)
    await tweet.save()
    res.status(201).json(tweet)
})

//when creating a new user ...we use a post route
app.post('/signup', authMiddleware, async (req,res) =>{
    const {username, password} = req.body
    //because we have a bit more requirements for our username..we will use try catch
    //similar to if else, but responds to errors
    try{
        const user = new User({username, password})
        await user.save()
        res.status(201).json({message: 'User Created'})
    }
    catch (err){
        res.status(400).json({message: 'User Already Exists'})
    }

})

//login...logins are not GET request..they are POSTS request because we are creating a new session or sending a new token to the frontend
app.post('/login', async(req,res) =>{
    const {username, password} = req.body
    //find the user based on the username
    const user = await User.findOne({username})
    if(!user){
        return res.status(400).json({message: 'User Not found'})
    }
    const isMatch = await user.comparePasswords(password)
    if(!isMatch){
        return res.status(400).json({message: 'Invalid Password'})
    }
    const token = jwt.sign({id: user._id}, 'secret')
    res.json({token, username})
})


  
//start our server we say app.listen(portnumber).  the portnumber can be determined by you.
//often times we give it an or statement that says run on this port or the OS primary port for web servers
//this is important because when we deploy our application it will start on the apporpriate port for that particular Os/Machine 


//use app.listen to listen for requests from a port
app.listen(PORT, () => console.log("Server running"))