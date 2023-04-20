const express = require('express');
const config = require('./config');
const port = config.serverPort;
const ioport = config.socketIOPort;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local');

const User = require('./models/userModel');

const dotenv = require('dotenv').config().parsed;
// console.log(dotenv);

// ---- [FLASK SOCKETIO CONNECTION TEST] ----
const http = require('http');
const server = http.createServer(app);
const { SocketServer } = require("socket.io");

const mongoAtlasUrl = dotenv.MONGODB_URL;
mongoose.connect(mongoAtlasUrl);

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

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
  secret: dotenv.SECRET_KEYWORD,
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
app.use('/flask', require('./routes/flaskRoute'));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
  res.locals.currentUser = req.user;
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next();
});

// app.listen(port, () => {
//     console.log('port running on port : ' + port);
// });

// ---- [FLASK SOCKETIO CONNECTION TEST] ----
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

server.listen(port, () => {
  console.log('server listening on port : ' + port);
});

var io = require('socket.io')(server);

// io.listen(ioport, () => {
//   console.log('Socket.IO listening on port : ' + ioport);
// });

io.on('connection', (socket) => {
  console.log('io connected');

  socket.on("disconnect", ()=> {
    console.log('io disconnected');
  })

  socket.on('test message', function(msg) {
    console.log('msg: ' + msg);
    io.emit('msg back', msg);
  });
});
app.io = io;