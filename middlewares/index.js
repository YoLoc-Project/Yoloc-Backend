const jwt = require('jwt-simple');
const User = require('../models/userModel');

var midwareFunctions = {};

midwareFunctions.lowercaseEmail = function(req, res, next){
  req.body.email = req.body.email.toLowerCase();
  next();
}

midwareFunctions.isLoggedIn = function(req, res, next){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      // the incoming token is 'Bearer #token#'
      var token = req.headers.authorization.split(' ')[1];
      // we need to convert the string to JSON object first.
      var stringToken = JSON.parse(token)['token'];
      var decodedtoken = jwt.decode(stringToken, dotenv.SECRET_KEYWORD);
      User.findById(decodedtoken._id, function (err, foundUser) {
        if (err){
          // console.log('not logged in');
          return res.status(401).json({success: false, message: 'Invalid token.'});
        }
        else {
          if (!foundUser) {
            // console.log('not logged in');
            return res.status(401).json({success: false, message: 'Invalid token.'});
          } else {
            // console.log('logged in');
            return next();
          }
        }
    });
      
    } else {
      // console.log('not logged in');
      return res.status(401).json({success: false, message: 'Invalid token.'});
    }
};

midwareFunctions.getUser = function(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // var token = req.headers.authorization.split(' ')[1]
    // var decodedtoken = jwt.decode(token, dotenv.SECRET_KEYWORD)
    // return res.json({success: true, msg: 'Hello ' + decodedtoken.email})
    
    var token = req.headers.authorization.split(' ')[1];
    var stringToken = JSON.parse(token)['token'];
    var user = jwt.decode(stringToken, dotenv.SECRET_KEYWORD);
    return user;
  }
  else {
      return res.json({success: false, msg: 'Invalid Header'});
  }

}

module.exports = midwareFunctions;  