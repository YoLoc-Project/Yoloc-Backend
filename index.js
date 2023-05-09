const express = require('express');
const config = require('./config');
const port = config.serverPort;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local');

const User = require('./models/userModel');

const dotenv = require('dotenv').config().parsed;
// console.log(dotenv);

// ---- [SOCKETIO CONNECTION] ----
const http = require('http');
const server = http.createServer(app);
// const { SocketServer } = require("socket.io");

const mongoAtlasUrl = process.env.MONGODB_URL;
mongoose.connect(mongoAtlasUrl);

var corsOptions = {
  origin: true,
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  "preflightContinue": true,
  credentials: true
};

app.options('*', cors())
app.use(cors(corsOptions))

app.use(function(req,res,next) {
  res.locals.currentUser = req.user;
  // res.header("X-Frame-Options", "ALLOWALL");
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  // res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use((err, req, res, next) => {
  var statusCode = err.status || 500
  res.status(statusCode)
  res.json({
    error: {
      status: statusCode,
      message: err.message
    }
  });
});

app.use(require('express-session')({
  secret: process.env.SECRET_KEYWORD,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  User.authenticate()
));
app.use(async function(req,res,next){
  res.locals.message = req.user;
  console.log(res.locals)
  next();
});

app.use('/user', require('./routes/userRoute'));
app.use('/profile', require('./routes/profileRoute'));
app.use('/token', require('./routes/tokenRoute'));
app.use('/socket', require('./routes/socketRoute'));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

server.listen(port, () => {
  console.log('server listening on port : ' + port);
});

var io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('face recognition client connected');

  socket.on("disconnect", ()=> {
    console.log('face recognition client disconnected');
  })

  socket.on('client_success', function(data) {
    console.log('client msg: ' + data.message);
  });

  socket.on('client_error', function(data) {
    console.log('client error msg: ' + data.message);
  });
});

app.set('socketio', io);
app.io = io;