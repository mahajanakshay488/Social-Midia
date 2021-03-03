var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  comment: String,
  
  react: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],

  postid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  
  userid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],

});

module.exports = mongoose.model('comment', commentSchema);