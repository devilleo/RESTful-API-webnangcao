const express = require('express');
const logger = require('morgan');
const users = require('./routes/users');
const index = require('./routes/index')
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
// const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const socketIO = require('socket.io')
const app = express();
const {
  findingRoom, 
  sendMessage, 
  getInfoCurrentRoom, 
  addSquareTogged, 
  changeTurn, 
  getListSquareTogged, 
  getCurrentTurn, 
  resetGame,
  setNumbersOfAcceptPlayAgain,
  getNumbersOfAcceptPlayAgain,
  resetNumbersOfAcceptPlayAgain,
  eraseRoom
} = require('./config/socket')

const passport = require('passport');
require('./middleware/passport')
app.use(session({secret: 'iloveyou'})); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session());

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.get('/', function(req, res){
res.json({"1612278" : "Build REST API with node.js"});
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, secret_token");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

// public route
app.use('', index);
app.use('/users',users);

// private route
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
 console.log(err);
 
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else 
    res.status(500).json({message: "Something looks wrong :( !!!"});
});

// app.set( 'port', ( process.env.PORT || 5000 ));
// Start node server
// app.listen(app.get( 'port' ), function(){
//  console.log('Node server listening on port ' + app.get( 'port' ));
// });

// #!/usr/bin/env node

// /**
//  * Module dependencies.
//  */

var debug = require('debug')('btcn06-restfulapi:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server)

// socket test connection
io.on('connection', socket => {
  console.log('New client connected')
  
  socket.on("finding room", (data) => {
    var result = findingRoom(data)
    socket.join(result.idRoom)
    socket.emit('response finding room', result.idRoom, result.isPlayer1)
    // if room is full 
    if (result.room.numbersInRoom === 2){
      io.sockets.in(result.idRoom).emit('reponse room info', result.room)
    }
  });

  socket.on("send message", (idRoom, email, isPlayer1, message, time) => {
    var room = sendMessage(idRoom, email, isPlayer1, message, time)
    if (room !== false){
      var clients = io.sockets.adapter.rooms
      console.log(clients)
      io.sockets.in(idRoom).emit("response newest message list", room.message)
    }
    
  })

  socket.on("enter Room Again After Refresh Page", idRoom => {
    socket.join(idRoom)
    var infoCurrentRoom = getInfoCurrentRoom(idRoom)
    socket.emit("reponse room info after refresh page", infoCurrentRoom)
  })

  socket.on("toggle squareeeee", (idSquare, idRoom) => {
    addSquareTogged(idSquare, idRoom)
    changeTurn(idRoom)
    const newBoard = getListSquareTogged(idRoom)
    console.log(newBoard)
    const newTurn = getCurrentTurn(idRoom)
    io.sockets.in(idRoom).emit("response newest board", newBoard)
    io.sockets.in(idRoom).emit("response newest turn", newTurn)
  })

  socket.on("emit winner", (isPlayer1, idRoom) => {
  })

  socket.on("emit restart game after game over", idRoom => {
    resetGame(idRoom)
    socket.emit("response restart game request")
    setNumbersOfAcceptPlayAgain(idRoom)
    console.log("getNumbersOfAcceptPlayAgain: ", getNumbersOfAcceptPlayAgain(idRoom))
    if (getNumbersOfAcceptPlayAgain(idRoom) === 2){
      io.sockets.in(idRoom).emit("All members accept to play again")
      resetNumbersOfAcceptPlayAgain(idRoom)
    }

  })

  socket.on("cancel finding room (out of waiting room)", idRoom => {
    eraseRoom(idRoom)
    io.sockets.in(idRoom).emit("response cancel finding room")
  })
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on port ' + addr.port)

}
