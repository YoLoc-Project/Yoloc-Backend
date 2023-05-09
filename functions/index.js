const jwt = require('jwt-simple');
const User = require('../models/userModel');

var functions = {};

functions.getUser = function(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    var token = req.headers.authorization.split(' ')[1];
    var user = jwt.decode(token, process.env.SECRET_KEYWORD);
    return user;
  }
  else {
      return res.json({success: false, msg: 'Invalid Header'});
  }

}

functions.getUserBody = function(req) {
  if (req.body.authorization && req.body.authorization.split(' ')[0] === 'Bearer') {

    var token = req.body.authorization.split(' ')[1];
    var user = jwt.decode(token, process.env.SECRET_KEYWORD);
    return user;
  }
  else {
      return res.json({success: false, msg: 'Invalid Header'});
  }

}

functions.getUserParams = function(authorization) {
  if (authorization && authorization.split('|')[0] === 'Bearer') {

    var token = authorization.split('|')[1];
    var user = jwt.decode(token, process.env.SECRET_KEYWORD);
    return user;
  }
  else {
      return res.json({success: false, msg: 'Params'});
  }

}


module.exports = functions;  