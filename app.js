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
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(er => console.log(er));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({
    extended: false
}));

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
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//Static Files (used for the CSS)
app.use(express.static(__dirname + '/css'));



const PORT = process.env.PORT || 5000;




//Game Server/Client E

// app.get('/game',function(req,res) {
//     res.sendFile(__dirname + '/client/index.html');
// });

// app.use('/game',express.static(__dirname+'/client/'));


serv.listen(PORT, console.log('Server started'));


const io = require('socket.io')(serv, {});

var SOCKET_LIST = {};


var Entity = function () {
    var self = {
        x: 250,
        y: 250,
        spdX: 0,
        spdY: 0,
        id: "",
    }
    self.update = function () {
        self.updatePosition();
    }
    self.updatePosition = function () {
        self.x += self.spdX;
        self.y += self.spdY;
    }
    return self;
}



var Player = function (id) {
    var self = Entity();
    self.id = id;
    self.number = '' + Math.floor(10 * Math.random());
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.maxSpd = 10;

    var super_update = self.update;
    self.update = function () {
        self.updateSpd(); //updates speed on entity
        super_update(); //updates the x,y coordinates appropriately
    }

    self.updateSpd = function () { //will overwrite entity update function
        if (self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if (self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }
    Player.list[id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function (socket) { //when socket connects, this manages all players
    var player = Player(socket.id);
    console.log(player.number + ' has connected');
    socket.on('keyPress', function (data) {
        if (data.inputID == 'left')
            player.pressingLeft = data.state;
        else if (data.inputID == 'right')
            player.pressingRight = data.state;
        else if (data.inputID == 'up')
            player.pressingUp = data.state;
        else if (data.inputID == 'down')
            player.pressingDown = data.state;
    })
}
Player.onDisconnect = function (socket) {
    console.log(Player.list[socket.id].number + ' has disconnected');
    delete Player.list[socket.id];
}
Player.update = function () {
    var pack = []
    for (var i in Player.list) {
        var player = Player.list[i]
        player.update();
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number
        })
    }
    return pack;
}



// var Bullet = function(angle){
//     var self = Entity();
//     self.id = Math.random();
//     self.spdX = Math.cos(angle/180*Math.PI) * 10;
//     self.spdY = Math.sin(angle/180*Math.PI) * 10;
//     self.timer = 0;
//     self.toRemove = false;
//     var super_update = self.update;
//     self.update = function() {
//         if(self.timer++ > 100)
//             self.toRemove = true;
//         super_update();
//     }
//     Bullet.list[self.id] = self;
//     return self;
// }
// Bullet.list = {};
// Bullet.update = function () {
//     if(Math.random() < 0.1){
//         Bullet(Math.random()*360);
//     }
//     var pack = []
//     for (var i in Bullet.list) {
//         var bullet = Bullet.list[i]
//         bullet.update();
//         pack.push({
//             x: bullet.x,
//             y: bullet.y,
//             number: bullet.number
//         })
//     }
//     return pack;
// }



//when a connection is made, this will run
io.sockets.on('connection', function (socket) {
    socket.id = Math.random(); //gives each connection a random id
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);

    });

});

setInterval(function () {
    var pack = {
        player: Player.update(),
        // bullet: Bullet.update(),
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('newPositions', pack)
    };

}, 1000 / 25);