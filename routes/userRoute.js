const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const passport = require('passport');
const MID = require('../middlewares');
const dotenv = require('dotenv').config().parsed;

const router = express.Router();

router.get('/test', (req,res) => {
    console.log('Hello');
    return res.json({success: true, message: 'Hello world.'});
})

// router.get('/getinfo', (req,res) => {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         var token = req.headers.authorization.split(' ')[1];
//         var decodedtoken = jwt.decode(token, dotenv.SECRET_KEYWORD);
//         return res.json({success: true, msg: 'Hello ' + decodedtoken.email});
//     }
//     else {
//         return res.json({success: false, msg: 'No Headers'});
//     }
// })

router.post('/signup', MID.lowercaseEmail, (req,res) => {
    User.findOne({email:req.body.email,password:req.body.password} , (err,user) => {
        if(err){
            console.log(err);
            res.json(err);
        } else {
            if(user == null){
                const user = User({
                    email:req.body.email,
                    name:req.body.name,
                })
                // console.log(user)
                User.register(user, req.body.password, function(err, user) {
                    if (err) {
                        console.log(err);
                        return res.status(401).json(err);
                    } 
                    console.log("Register successful.");
                        res.locals.currentUser = user;
                        var token = jwt.encode(user, dotenv.SECRET_KEYWORD);

                        return res.status(200).json({"token" : token});
                    })
            } else {
                return res.status(401).json({
                    'message' : 'The email has already been used.'
                });
            }

        }   
    })
})

router.post('/signin', MID.lowercaseEmail, (req,res,next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) return res.status(401).json(err);
        if (user) {
            req.login(user, function(err) {
                if (err) return next(err);
                console.log("Login successful.");
                var token = jwt.encode(user, dotenv.SECRET_KEYWORD);
                // console.log(res.locals.currentUser)

                return res.status(200).json({"token" : token});
            })
        } else {
            console.log('user not found or wrong password');
            return res.status(401).json(info);
        }
    })(req, res, next)
})

module.exports = router;