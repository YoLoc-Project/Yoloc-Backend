const express  = require('express');
const User = require('../models/userModel');
const jwt = require('jwt-simple');
const MID = require('../middlewares');
const FUNC = require('../functions');
const request = require('request');
const dotenv = require('dotenv').config().parsed;

const router = express.Router();

router.get('/test', function(req, res) {
    request('http://127.0.0.1:5000/flask', function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.send(body);
      });      
});

module.exports = router;