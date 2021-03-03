var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/node6major');

var userSchema = new mongoose.Schema({
  name: String,
  luckyname: String,
  username: String,
  email: String,
  contact: String,
  dob: Date,
  about: String,

  profilepic: {
    type: String,
    default: ''
  },
  
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }
  ],

  msgs: [
    {
      chatid: String,
      another: String
    }
  ]
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);