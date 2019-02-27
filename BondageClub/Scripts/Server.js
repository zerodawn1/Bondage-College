"use strict";
var socket = null;

// Loads the server events
function ServerInit() {
	socket = io('http://localhost:4288');
	socket.on("ServerMessage", function (data) { console.log(data); });
	socket.on("CreationResponse", function (data) { CreationResponse(data); });
	socket.on("LoginResponse", function (data) { LoginResponse(data); });
}

// Sends a message to the server
function ServerSend(Message, Data) {
	socket.emit(Message, Data);
}