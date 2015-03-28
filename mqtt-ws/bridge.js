(function() {
    var mqtt = require('mqtt');
    var WebSocketServer = require('ws').Server;

    function Bridge(options) {
        var client = mqtt.connect('mqtt://' + options.mqtt.host + ':' + options.mqtt.port);
        var wss = new WebSocketServer({ port: options.ws.port });

        wss.broadcast = function broadcast(data) {
            console.log('Broadcasting message over WS to ' + wss.clients.length + ' clients: ', data);
            wss.clients.forEach(function each(ws) {
                ws.send(data);
            });
        };

        wss.on('connection', function(ws) {
            console.log('New client connected: total count is now', wss.clients.length);
        });

        this.forward = function(topic) {
            client.subscribe(topic);

            client.on('message', function(tpc, msgbuf) {
                if (topic === tpc) {
                    wss.broadcast(msgbuf.toString());
                }
            });
        }

        function exitHandler(options, err) {
            if (options.cleanup) client.end();
            if (err) console.log(err.stack);
            if (options.exit) process.exit();
        }

        //do something when app is closing
        process.on('exit', exitHandler.bind(null, {
            cleanup: true
        }));

        //catches ctrl+c event
        process.on('SIGINT', exitHandler.bind(null, {
            cleanup: true,
            exit: true
        }));

        //catches uncaught exceptions
        process.on('uncaughtException', exitHandler.bind(null, {
            exit: true
        }));

    }

    exports.Bridge = Bridge;
})();
