const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const passport = require('passport');
const MID = require('../middlewares');

const router = express.Router();

router.get('/test', (req,res) => {
    console.log('Hello');
    return res.json({success: true, message: 'Hello world.'});
})

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
                User.register(user, req.body.password, function(err, user) {
                    if (err) {
                        console.log(err);
                        return res.status(401).json(err);
                    } 
                    // console.log("Register successful.");
                    res.locals.currentUser = user;
                    var token = jwt.encode({id: user._id, email: user.email, name: user.name}, process.env.SECRET_KEYWORD);

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
                // console.log("Login successful.");
                var token = jwt.encode({id: user._id, email: user.email, name: user.name}, process.env.SECRET_KEYWORD);
                User.findByIdAndUpdate(user._id, { token: token }, function(err, updatedUser) {
                    if (err) return console.log(err)
                    if (updatedUser) {
                        var userObject = {
                            email: updatedUser.email,
                            name: updatedUser.name,
                            nickname: updatedUser.nickname,
                            phone: updatedUser.phone,
                            birthdate: updatedUser.birthdate,
                            gender: updatedUser.gender,
                            faceImgs: updatedUser.faceImgs,
                        }

                        return res.status(200).json({"token" : token, "user": userObject});
                    } else {
                        return res.status(404).json({success: false, message: 'User not found while attempting to update'});
                    }
                })

            })
        } else {
            // console.log('user not found or wrong password');
            return res.status(401).json(info);
        }
    })(req, res, next)
})

router.post('/signout', MID.checkTokenBody, (req,res) => {
    var user = FUNC.getUserBody(req);
    User.findByIdAndUpdate(user._id, { token: "" }, function(err, updatedUser) {
        if (err) return console.log(err)
        if (updatedUser) {
            return res.status(200).json({"token" : token});
        } else {
            return res.status(404).json({success: false, message: 'User not found while attempting to logout'});
        }
    })
})

module.exports = router;