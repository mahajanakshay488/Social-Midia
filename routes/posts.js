var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  media: '',
  content: String,
  
  react: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  
  userid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],

  comment: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
  }],
});

module.exports = mongoose.model('post', postSchema);