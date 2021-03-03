var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    author: String,
    reciever: String,
    msg: String,
    time: {
        type: Date,
        default: Date.now
    },
    chatid: String
});

module.exports = mongoose.model('message', messageSchema);