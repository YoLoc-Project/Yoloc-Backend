const jwt = require('jwt-simple');
const User = require('../models/userModel');
const dotenv = require('dotenv').config().parsed;

var midwareFunctions = {};

midwareFunctions.lowercaseEmail = function(req, res, next){
  req.body.email = req.body.email.toLowerCase();
  next();
}

midwareFunctions.checkToken = function(req, res, next){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      // the incoming token is 'Bearer #token#'
      var token = req.headers.authorization.split(' ')[1];
      // we need to convert the string to JSON object first.
      // var stringToken = JSON.parse(token)['token'];
      var decodedtoken = jwt.decode(token, dotenv.SECRET_KEYWORD);
      User.findOne(
        {
          $and: [
                 { _id :decodedtoken._id },
                 { token: token }
               ]
        }
        , function (err, foundUser) {
        if (err){
          return res.status(401).json({success: false, message: 'Invalid token.'});
        }
        else {
          if (!foundUser) {
            return res.status(401).json({success: false, message: 'Invalid token.'});
          } else {
            return next();
          }
        }
    });
      
    } else {
      return res.status(401).json({success: false, message: 'Invalid token.'});
    }
};
module.exports = midwareFunctions;  