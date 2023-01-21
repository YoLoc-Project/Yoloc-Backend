const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const passport = require('passport');
const MID = require('../middlewares');
const FUNC = require('../functions');
const dotenv = require('dotenv').config().parsed;

const router = express.Router();

router.get('/test', (req,res) => {
    console.log('Hello');
    return res.json({success: true, message: 'Hello world.'});
})

router.get('/auth', MID.checkToken, (req,res) => {
    var user = FUNC.getUser(req);
    User.findById(user._id).exec((err, foundUser) => {
        if (err) return res.status(401).json({success: false, message: 'Error'});

        var userObject = {
            email: foundUser.email,
            name: foundUser.name,
            nickname: foundUser.nickname,
            phone: foundUser.phone,
            gender: foundUser.gender,
            faceImgs: foundUser.faceImgs,
        }
        // console.log(userObject);
        return res.status(200).json({success: true, message: 'Auth success', user: userObject});
    });

    // return res.status(200).json({success: true, message: 'Auth success'});
})



module.exports = router;