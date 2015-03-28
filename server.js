var path = require('path');
var express = require('express');
var app = express();
app.use('/', express.static(path.join(__dirname, 'client')));
app.listen(4000, function() { console.log('Listening on http://localhost:4000/'); });

var Bridge = require('mqtt-ws').Bridge,
    bridge = new Bridge({ mqtt: { host: 'localhost', port: 1883 }, ws: { port: 9001 }});
bridge.forward('foo');
