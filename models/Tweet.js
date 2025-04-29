const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  comments: [
    {
      user: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Tweet', TweetSchema);
