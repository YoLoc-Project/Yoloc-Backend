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
      example: "true"
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
   return false;    
});

router.post('/trainmodel', function(req, res) {
  console.log("train model");

  const options = {
    uri: 'http://127.0.0.1:5000/flask/trainmodel',
    method: 'POST',
    json: {
      images: [
        {
          url: 'example.com',
          email: 'example@email.com',
          name: 'Name'
        },
        {
          url: 'example2.com',
          email: 'example2@email.com',
          name: 'Name2'
        },
      ],
    },
  };

  // Placeholder slot for updating database
  // TODO Get all firebase image urls
    request(options, function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.send(body);
      });  
   return false;    
});

module.exports = router;