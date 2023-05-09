const jwt = require('jwt-simple');
const User = require('../models/userModel');

var midwareFunctions = {};

midwareFunctions.lowercaseEmail = function(req, res, next){
  req.body.email = req.body.email.toLowerCase();
  next();
}

// midwareFunctions.checkToken = function(req, res, next){
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     // the incoming token is 'Bearer #token#'
//     var token = req.headers.authorization.split(' ')[1];
//     // we need to convert the string to JSON object first.
//     // var stringToken = JSON.parse(token)['token'];
//     if (!token || token == null || token == "null") return res.status(401).json({success: false, message: 'Invalid token.'});
//     var decodedtoken = jwt.decode(token, process.env.SECRET_KEYWORD);
//     User.findOne(
//         {
//           $and: [
//                  { _id :decodedtoken._id },
//                  { token: token }
//                ]
//         }
//         , function (err, foundUser) {
//         if (err){
//           return res.status(401).json({success: false, message: 'Invalid token.'});
//         }
//         else {
//           if (!foundUser) {
//             return res.status(401).json({success: false, message: 'Invalid token.'});
//           } else {
//             return next();
//           }
//         }
//     });
      
//     } else {
//       return res.status(401).json({success: false, message: 'Invalid token.'});
//     }
// };

midwareFunctions.checkTokenBody = function(req, res, next){
  if (req.body.authorization && req.body.authorization.split(' ')[0] === 'Bearer') {
    // the incoming token is 'Bearer #token#'
    var token = req.body.authorization.split(' ')[1];
    // we need to convert the string to JSON object first.
    // var stringToken = JSON.parse(token)['token'];
    if (!token || token == null || token == "null") return res.status(401).json({success: false, message: 'Invalid token.'});
    var decodedtoken = jwt.decode(token, process.env.SECRET_KEYWORD);
    User.findOne(
        {
          _id :decodedtoken.id
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

midwareFunctions.checkTokenParams = function(req, res, next){
  if (req.params.authorization && req.params.authorization.split('|')[0] === 'Bearer') {
    // the incoming token is 'Bearer #token#'
    var token = req.params.authorization.split('|')[1];
    // we need to convert the string to JSON object first.
    // var stringToken = JSON.parse(token)['token'];
    if (!token || token == null || token == "null") return res.status(401).json({success: false, message: 'Invalid token.'});
    var decodedtoken = jwt.decode(token, process.env.SECRET_KEYWORD);
    User.findOne(
      {
        _id :decodedtoken.id
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