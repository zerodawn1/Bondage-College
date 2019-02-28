"use strict";
var ServerSocket = null;

// Loads the server events
function ServerInit() {
	ServerSocket = io('http://localhost:4288');
	ServerSocket.on("ServerMessage", function (data) { console.log(data) });
	ServerSocket.on("CreationResponse", function (data) { CreationResponse(data) });
	ServerSocket.on("LoginResponse", function (data) { LoginResponse(data) });
	ServerSocket.on("disconnect", function (data) { ServerDisconnect() } );
}

// When the server disconnects, we go back to the login screen
function ServerDisconnect() {
	if (Player.Name != "" ) {
		if (CurrentCharacter != null) 
			DialogLeave(); 
		CommonSetScreen("Character", "Login"); 
		LoginMessage = TextGet("ErrorDisconnectedFromServer");
	}
}

// Sends a message to the server
function ServerSend(Message, Data) {
	ServerSocket.emit(Message, Data);
}

// Syncs some player information to the server
function ServerPlayerSync() {
	ServerSend("AccountUpdate", {Money: Player.Money, Owner: Player.Owner, Lover: Player.Lover});
}

// Syncs the full player inventory to the server
function ServerPlayerInventorySync() {
	var D = {};
	D.Inventory = [];
	for(var I = 0; I < Player.Inventory.length; I++)
		if (Player.Inventory[I].Asset != null)
			D.Inventory.push({ Name: Player.Inventory[I].Asset.Name, Group: Player.Inventory[I].Asset.Group.Name });
	ServerSend("AccountUpdate", D);
}

// Syncs the full player log to the server
function ServerPlayerLogSync() {
	var D = {};
	D.Log = Log;
	ServerSend("AccountUpdate", D);
}

// Syncs the full player reputation to the server
function ServerPlayerReputationSync() {
	var D = {};
	D.Reputation = Player.Reputation;
	ServerSend("AccountUpdate", D);
}

// Syncs the full player reputation to the server
function ServerPlayerSkillSync() {
	var D = {};
	D.Skill = Player.Skill;
	ServerSend("AccountUpdate", D);
}