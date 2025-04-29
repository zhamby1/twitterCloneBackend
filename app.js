const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // to parse JSON request body
app.use(cors());  // Allow cross-origin requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Models
const Tweet = require('./models/Tweet');
const User = require('./models/User');

// Auth middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authorization required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Routes

// User signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a tweet
app.post('/tweets', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { user } = req;

  try {
    const newTweet = new Tweet({
      user: user.username,
      content
    });

    await newTweet.save();
    res.status(201).json(newTweet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tweets with comments
app.get('/tweets', async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(tweets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a tweet
app.post('/tweets/:id/comments', authMiddleware, async (req, res) => {
  const { text } = req.body;
  const tweetId = req.params.id;
  const { user } = req;

  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) return res.status(404).json({ message: 'Tweet not found' });

    tweet.comments.push({
      user: user.username,
      text
    });

    await tweet.save();
    res.status(201).json(tweet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
