/* 
 * 
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/hello', (req, res) => res.send('Hello World!'));

var players = ['zero', 'one', 'two', 'three'];
var playerCount = 0;


console.log("launching...");

// get a player name 
function player() {
    playerCount++;
    if (playerCount > 3) playerCount = 0;
    return players[playerCount];
}

var codes = [37, 38, 39, 40];
var nextCode = 0;

function aiDog() {
    //console.log('dog is thinking');

    io.emit('move', { code: codes[nextCode], who: "dog" });
    nextCode++;
    if (nextCode > 3) nextCode = 0;
}

setInterval(aiDog, 333);


io.on('connection', (socket) => {
    console.log('user connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data) => {
        console.log(data);
    });
    socket.on('send', (data) => {
        io.emit('receive', data);
    });
    // ========================== //
    socket.emit('hello', { id: player() });
    socket.on('key', (data) => {
        io.emit('move', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const port = process.env.PORT || 3000;

console.log("Port: " + port);

// WARNING: app.listen(...) will NOT work here!
http.listen(port);

