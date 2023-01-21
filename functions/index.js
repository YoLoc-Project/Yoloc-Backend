const jwt = require('jwt-simple');
const User = require('../models/userModel');
const dotenv = require('dotenv').config().parsed;

var functions = {};

// Not really midware
functions.getUser = function(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    var token = req.headers.authorization.split(' ')[1];
    var user = jwt.decode(token, dotenv.SECRET_KEYWORD);
    return user;
  }
  else {
      return res.json({success: false, msg: 'Invalid Header'});
  }

}

module.exports = functions;  