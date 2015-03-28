function WebSocketService(url, port) {
    this.openHandlers = [function(evt) {
            console.log("Connected to ", url + ':' + port);
        }];
    this.closeHandlers = [function(evt) {
            console.log("Disconnected from ", url + ':' + port);
        }];
    this.messageHandlers = [function(evt) {
            console.log('Message received: ', evt.data);
        }];
    this.errorHandlers = [function(evt) {
            console.log('ERROR: ', evt.data);
        }];

    function onOpen(evt) {
        for (var i in this.openHandlers) {
            this.openHandlers[i](evt);
        }
    }

    function onClose(evt) {
        for (var i in this.closeHandlers) {
            this.closeHandlers[i](evt);
        }
    }

    function onMessage(evt) {
        for (var i = 0; i < this.messageHandlers.length; ++i) {
            this.messageHandlers[i](evt);
        }
    }

    function onError(evt) {
        for (var i in this.errorHandlers) {
            this.errorHandlers[i](evt);
        }
    }

    this.socket = new WebSocket('ws://' + url + ':' + port);
    this.socket.onopen = onOpen;
    this.socket.onclose = onClose;
    this.socket.onmessage = onMessage.bind(this);
    this.socket.onerror = onError;

    this.addMessageHandler = function(handler) {
        this.messageHandlers.push(handler);
    }

    this.sendMessage = function(msg) {
        this.socket.send(msg);
    }
}
