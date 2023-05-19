const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');

const router = express.Router();

// add image list along with profile
router.post('/addimage', MID.checkTokenBody, (req,res) => {
    var user = FUNC.getUserBody(req);
    User.findByIdAndUpdate(
        user.id,
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
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                faceImgs: req.body.faceImgs,
            }
            const options = {
                json: JSON.stringify(payload)
            };

            var io = req.app.get('socketio');
            io.emit("trainmodel", options);
            return res.status(200).json({success: true, message: 'Image saved into database. Awaiting the Pi system to train (if there\'s one online).'});

            // return res.status(200).json({success: true, message: 'Successfully added profile and images'});
        } else {
            console.log('User not found while attempting to update')
            return res.status(404).json({success: false, message: 'User not found while attempting to update'});
        }
    })
})

// edit face image list
router.post('/editimage', MID.checkTokenBody, (req,res) => {
    var user = FUNC.getUserBody(req);
    User.findByIdAndUpdate(
        user.id,
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
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                faceImgs: req.body.faceImgs,
            }
            const options = {
                json: JSON.stringify(payload)
            };

            var io = req.app.get('socketio');
            io.emit("trainmodel", options);
            return res.status(200).json({success: true, message: 'Image saved into database. Awaiting the Pi system to train (if there\'s one online).'});
      
        } else {
            return res.status(404).json({success: false, message: 'User not found while attempting to update'});
        }
    })
})

// edit profile without image
router.post('/editprofile', MID.checkTokenBody, (req,res) => {
    var user = FUNC.getUserBody(req);
    console.log(user);
    console.log(user.id);
    User.findByIdAndUpdate(
        user.id,
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