const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const serv = require('http').Server(app);


// Passport config

require('./config/passport')(passport);


// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db,{ useNewUrlParser : true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(er => console.log(er));


// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));


// Passport 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars for Messages
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 5000;




//Game Server/Client E

// app.get('/game',function(req,res) {
//     res.sendFile(__dirname + '/client/index.html');
// });

// app.use('/game',express.static(__dirname+'/client/'));


serv.listen(PORT, console.log('Server started'));


const io = require('socket.io')(serv,{});
var SOCKET_LIST = {};

//when a connection is made, this will run
io.sockets.on('connection',function(socket){
    socket.id = Math.random();          //gives each connection a random id
    socket.x = 0;
    socket.y = 0;
    socket.number = '' + Math.floor(10*Math.random());

    SOCKET_LIST[socket.id] = socket;
    console.log(socket.number.toString() + ' has connected');

    socket.on('disconnect',function(){
        console.log(socket.number.toString() + ' has disconnected');
        delete SOCKET_LIST[socket.id];
        
    });

});

setInterval(function(){
    var pack = []

    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i]
        socket.x++;
        socket.y++;
        pack.push({
            x:socket.x,
            y:socket.y,
            number:socket.number
        })
    }

    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i]
        socket.emit('newPositions',pack)
    };

},1000/25);