const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');
const fetch = require('cross-fetch');
const request = require('request');
const ioreq = require("socket.io-request");
// const io = require("socket.io")();

const router = express.Router();

router.get('/online', function(req, res) {

  console.log("online");
  return res.status(200).json({success: true, message: 'online'});

//  io.emit("test", {data: 'data'}, (data2, data3) => {
//     console.log(data2);
//   });

});

router.get('/test', function(req, res) {

  console.log("test");
  var io = req.app.get('socketio');
  io.emit("test", {data: 'data'});
  return res.status(200).json({success: true, message: 'success'});

//  io.emit("test", {data: 'data'}, (data2, data3) => {
//     console.log(data2);
//   });

});

router.post('/trainmodel', function(req, res) {
  console.log("train model");

  // var user = FUNC.getUser(req);
  // เลือกของ pee ไปใช้ก่อน
  // In real work environment I shouldn't do this, as it is rather vulnerable.
    User.findById('6440eb66227584984f75e9ba').exec((err, foundUser) => {
        if (err) return res.status(401).json({success: false, message: err});

        const payload = {
          email: foundUser.email,
          name: foundUser.name,
          nickname: foundUser.nickname,
          faceImgs: foundUser.faceImgs,
        }
        const options = {
          uri: 'http://127.0.0.1:5000/flask/trainmodel',
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          json: JSON.stringify(payload)
        };

          var io = req.app.get('socketio');
          io.emit("trainmodel", options);
          return res.status(200).json({success: true, message: 'Image saved into database. Awaiting the Pi system to train (if there\'s one online).'});
      
          // request(options, function (error, response, body) {
          //   console.error('error:', error);
          //   console.log('statusCode:', response && response.statusCode);
          //   console.log('body:', body);
          //   if (response === undefined || response.statusCode !== 200) {
          //     return res.status(400).json({success: false, message: 'Python client error'});
          //   } else {
          //     return res.status(200).json({success: true, message: 'Image url sending success'});
          //   }
          // });  
        
    });
  
});

module.exports = router;