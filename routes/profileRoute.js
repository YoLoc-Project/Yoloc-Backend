const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');
const dotenv = require('dotenv').config().parsed;

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
            // TODO paste the flaskRoute /trainmodel code
            return res.status(200).json({success: true, message: 'Successfully added profile and images'});
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
            // TODO paste the flaskRoute /trainmodel code
            return res.status(200).json({success: true, message: 'Successfully edited face images'});
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