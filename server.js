var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'client')));

app.listen(4000, function() { console.log('Listening on http://localhost:4000/'); });


var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 9001 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(ws) {
    ws.send(data);
  });
};

wss.on('connection', function (ws) {
    console.log(wss.clients.length);
});

var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.0.118:1883');
 
client.on('connect', function () {
  client.subscribe('sensor');
});

client.on('message', function(topic, msgbuf) {
    var msg = msgbuf.toString();
    console.log(msg);
    wss.broadcast(msg);
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) client.end();
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup: true, exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));