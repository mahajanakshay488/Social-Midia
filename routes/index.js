var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts');
var cmntModel = require('./comments');
var msgModel = require('./messages');
var peakyb = require('./peakyb');

var uuid = require('uuid');
var passport = require('passport');
var localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.status(200).json({msg: 'success', page: 'index'});
});

router.get('/profile', isLogedin, (req, res) => {
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser) => {
    res.status(200).json({msg: 'success', val: foundUser});
  });
});

router.get('/allpost', isLogedin, (req, res) => {
  postModel.find()
  .then((posts)=>{
    res.status(200).json({msg: 'success', val: posts});
  });
});

router.get('/removal', (req, res)=>{
  userModel.remove({}).then(()=>{
    postModel.remove({}).then(()=>{
      cmntModel.remove({}).then(()=>{
        msgModel.remove({}).then(()=>{
          res.status(200).json({msg: 'Successfully remove schemas!'});
        });
      });
    });
  });
});

router.get('/chatsec', (req, res) => {
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser)=>{
    var chats = foundUser.msgs;
    res.status(251).json({msg: 'success', val: chats, foundUser}); 
  });
});

router.get('/messages/:chatId', isLogedin, (req, res)=>{
  msgModel.find({chatid: req.params.chatId})
  .then((foundMsgs)=>{
    res.status(200).json({msg: 'success', val: foundMsgs});
  });
});

router.post('/post', isLogedin, (req, res) => {
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser)=> {
    postModel.create({
      content: req.body.content,
      userid: foundUser._id
    })
    .then((createdPost)=>{
      foundUser.posts.push(createdPost);
      foundUser.save()
      .then((su)=>{
        res.status(200).json({msg: 'success', val: createdPost});
      });
    });
  });
});

router.post('/comment/:postid', isLogedin, (req, res)=>{
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser)=> {
    postModel.findOne({_id: req.params.postid})
    .then((foundPost)=>{
      cmntModel.create({
        comment: req.body.comment,
        postid: foundPost,
        userid: foundUser._id
      })
      .then((newComment)=> {
        foundPost.comment.push(newComment);
        foundPost.save()
        .then((sc)=>{
          res.status(200).json({msg: 'success', val: newComment, post: sc})
        });
      });
    });
  });
});

router.get('/post/:postid/react', isLogedin, (req, res)=>{
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser)=>{
    postModel.findOne({_id: req.params.postid})
    .then((foundPost)=>{
      if(foundPost.react.includes(foundUser.id)){
        let index = foundPost.react.indexOf(foundUser.id);
        foundPost.react.splice(index, 1);
      }
      else{
        foundPost.react.push(foundUser._id);
      }
      foundPost.save()
        .then((savedPost) => {
          res.status(200).json({msg: 'success', val: savedPost});
        });
    });
  });
});

router.post('/message/:reciever', isLogedin, (req, res)=>{
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser)=>{
    var returnedVal = foundUser.msgs.find(m => m.another === req.params.reciever);
    var chatId = (returnedVal !== undefined) ? returnedVal.chatid : uuid.v4();
    console.log(chatId);
    console.log(returnedVal);
   if(returnedVal === undefined){
      msgModel.create({
        author: foundUser.username,
        reciever: req.params.reciever,
        msg: req.body.msg,
        chatid: chatId
      })
      .then((createdMsg)=>{
        foundUser.msgs.push({chatid: chatId, another: req.params.reciever});
        foundUser.save().then((savedUser)=>{
          userModel.findOne({username: req.params.reciever})
          .then((foundReciever)=>{
            foundReciever.msgs.push({chatid: chatId, another: foundUser.username});
            foundReciever.save().then((savedReciever)=>{
              res.status(200).json({msg: 'success', val: createdMsg, savedUser, savedReciever});
            });
          });
        });
      }); 
    }
    else{
      msgModel.create({
        author: foundUser.username,
        reciever: req.params.reciever,
        msg: req.body.msg,
        chatid: chatId
      }).then((createdMsg)=>{
        res.status(200).json({msg: 'success', val: createdMsg});
      });
    }
  });
});

router.post('/reg', (req, res) => {
  var LucyName = peakyb.PickLucyname;
  var newUser = new userModel({
    name: req.body.name,
    username: req.body.username,
    luckyname: LucyName
  });
  userModel.register(newUser, req.body.password)
  .then((createdUser) =>{
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/profile');
    });
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), (req, res) => {});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

function isLogedin(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;
