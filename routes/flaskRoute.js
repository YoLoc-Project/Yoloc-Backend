const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');
const fetch = require('cross-fetch');
const request = require('request');
const dotenv = require('dotenv').config().parsed;

const router = express.Router();

router.get('/getme', function(req, res) {
    res.status(200).send({
      example: "true"
    });

});

router.get('/test', function(req, res) {

  console.log("test");
    request.get('http://127.0.0.1:5000/flask/test', function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.send(body);
      });  
      
});

// router.post('/test', function(req, res) {
//   fetch('http://127.0.0.1:5000/flask/test', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({target: 'one'})
// });
// });


router.post('/trainmodel', function(req, res) {
  console.log("train model");

  // var user = FUNC.getUser(req);
  // เลือกของ pee ไปใช้ก่อน
  // In real work environment I shouldn't do this, as it is rather vulnerable.
    User.findById('6440eb66227584984f75e9ba').exec((err, foundUser) => {
        if (err) return res.status(401).json({success: false, message: err});

        var userObject = {
            email: foundUser.email,
            name: foundUser.name,
            nickname: foundUser.nickname,
            phone: foundUser.phone,
            birthdate: foundUser.birthdate,
            gender: foundUser.gender,
            faceImgs: foundUser.faceImgs,
        }
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
      
        
        // Placeholder slot for updating database
        // TODO Get all firebase image urls
        
      
          request(options, function (error, response, body) {
            console.error('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            if (response === undefined || response.statusCode !== 200) {
              return res.status(500).json({success: false, message: 'Flask server error', user: userObject});
            } else {
              return res.status(200).json({success: true, message: 'Image url sending success', user: userObject});
            }
          });  
        
    });
  
});

module.exports = router;