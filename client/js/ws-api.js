function wsApi(url, port, msgHandler) {
    websocket = new WebSocket('ws://' + url + ':' + port);
    websocket.onopen = function(evt) {
        onOpen(evt)
    };
    websocket.onclose = function(evt) {
        onClose(evt)
    };
    websocket.onmessage = function(evt) {
        onMessage(evt)
    };
    websocket.onerror = function(evt) {
        onError(evt)
    };

    function onOpen(evt) {
        console.log("Connected to ", url + ':' + port);
    }

    function onClose(evt) {
        console.log("Disconnected from ", url + ':' + port);
    }

    function onMessage(evt) {
        var data = JSON.parse(evt.data);
        sensorData[data.client] = data.value;
    }

    function onError(evt) {
        console.log('ERROR: ', evt.data);
    }

    var sensorData = {};

    return sensorData;
}
