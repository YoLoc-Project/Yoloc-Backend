const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');

const router = express.Router();

// add image list along with profile
router.post('/addimage', MID.checkToken, (req,res) => {
    var user = FUNC.getUser(req);
    User.findByIdAndUpdate(
        user._id,
         { 
            email: req.body.email,
            name: req.body.name,
            nickname: req.body.nickname,
            phone: req.body.phone,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            faceImgs: req.body.faceImgs,
         }, 
         function(err, updatedUser) {
        if (err) return console.log(err)
        if (updatedUser) {
            // Train the model inside flask server
            const payload = {
                email: updatedUser.email,
                name: updatedUser.name,
                nickname: updatedUser.nickname,
                faceImgs: updatedUser.faceImgs,
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
            //     console.error('error:', error);
            //     console.log('statusCode:', response && response.statusCode);
            //     console.log('body:', body);
            //     if (response === undefined || response.statusCode !== 200) {
            //         return res.status(400).json({success: false, message: 'Python client error'});
            //     } else {
            //         return res.status(200).json({success: true, message: 'Successfully added profile and images'});
            //     }
            // });  

            // return res.status(200).json({success: true, message: 'Successfully added profile and images'});
        } else {
            return res.status(404).json({success: false, message: 'User not found while attempting to update'});
        }
    })
})

// edit face image list
router.post('/editimage', MID.checkToken, (req,res) => {
    var user = FUNC.getUser(req);
    User.findByIdAndUpdate(
        user._id,
         { 
            faceImgs: req.body.faceImgs,
         }, 
         function(err, updatedUser) {
        if (err) return console.log(err)
        if (updatedUser) {
            // Train the model inside flask server
            // So far this system does not remove existing images inside Firebase
            // but it does replace existing images inside python server
            const payload = {
                email: updatedUser.email,
                name: updatedUser.name,
                nickname: updatedUser.nickname,
                faceImgs: updatedUser.faceImgs,
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
            //     console.error('error:', error);
            //     console.log('statusCode:', response && response.statusCode);
            //     console.log('body:', body);
            //     if (response === undefined || response.statusCode !== 200) {
            //         return res.status(400).json({success: false, message: 'Python client error'});
            //     } else {
            //         return res.status(200).json({success: true, message: 'Successfully edited profile and images'});
            //     }
            // });
            // return res.status(200).json({success: true, message: 'Successfully edited face images'});
        } else {
            return res.status(404).json({success: false, message: 'User not found while attempting to update'});
        }
    })
})

// edit profile without image
router.post('/editprofile', MID.checkToken, (req,res) => {
    var user = FUNC.getUser(req);
    User.findByIdAndUpdate(
        user._id,
         { 
            email: req.body.email,
            name: req.body.name,
            nickname: req.body.nickname,
            phone: req.body.phone,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
         }, 
         function(err, updatedUser) {
        if (err) return console.log(err)
        if (updatedUser) {
            return res.status(200).json({success: true, message: 'Successfully changed your profile'});
        } else {
            return res.status(404).json({success: false, message: 'User not found while attempting to update'});
        }
    })
})


module.exports = router;