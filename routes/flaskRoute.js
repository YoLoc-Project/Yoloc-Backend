const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');
const request = require('request');
const dotenv = require('dotenv').config().parsed;

const router = express.Router();

router.get('/getme', function(req, res) {
    res.status(200).send({
      yes: "true"
    });
});

router.get('/test', function(req, res) {
  console.log("test");
    request.get('http://127.0.0.1:5000/flask/test', function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.send(body);
      });  
  // req.app.io.emit('my_event', {
  //     data : "Hello world",
  //     data2 : true
  //  });
  //  res.status(200).send({
  //   stuff: "true"
  // });
   return false;    
});

router.post('/trainmodel', function(req, res) {
    request.post('http://127.0.0.1:5000/flask/trainmodel', function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.send(body);
      });  
  // req.app.io.emit('my_event', {
  //     data : "Hello world",
  //     data2 : true
  //  });
  //  res.status(200).send({
  //   stuff: "true"
  // });
   return false;    
});

router.post('/test', function(req, res) {
  console.log("test");
    request.post('http://127.0.0.1:5000/flask/test', function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.send(body);
      });  
   return false;    
});


module.exports = router;