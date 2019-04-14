"use strict";
var ChatRoomBackground = "Introduction";
var ChatRoomData = {};
var ChatRoomCharacter = [];
var ChatRoomLog = "";

// When the chat room loads
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementCreateInput("InputChat", "text", "", "250");
	ElementCreateTextArea("TextAreaChatLog");
	document.getElementById("InputChat").focus();
	document.getElementById("InputChat").setAttribute("autocomplete", "off");
	ChatRoomLog = "";
}

// Draw the characters in the room
function ChatRoomDrawCharacter() {

	// If there's 2 characters, it's zoomed in
	if (ChatRoomCharacter.length <= 2) DrawImageZoomCanvas("Backgrounds/" + ChatRoomBackground + ".jpg", MainCanvas, 500, 0, 1000, 1000, 0, 0, 1000, 1000);
	if (ChatRoomCharacter.length == 3) DrawImageZoomCanvas("Backgrounds/" + ChatRoomBackground + ".jpg", MainCanvas, 400, 0, 1200, 1000, 0, 50, 1000, 900);
	if (ChatRoomCharacter.length == 4) DrawImageZoomCanvas("Backgrounds/" + ChatRoomBackground + ".jpg", MainCanvas, 200, 0, 1600, 1000, 0, 150, 1000, 700);
	if (ChatRoomCharacter.length == 5) DrawImageZoomCanvas("Backgrounds/" + ChatRoomBackground + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 250, 1000, 500);
	if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomBackground + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 0, 1000, 500);
	if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomBackground + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 500, 1000, 500);

	// Sets the X position
	var X = 0;
	var Space = 500;	
	if (ChatRoomCharacter.length == 3) Space = 333;
	if (ChatRoomCharacter.length == 4) Space = 250;
	if (ChatRoomCharacter.length >= 5) Space = 200;
	if (ChatRoomCharacter.length >= 3) X = (Space / -5);
	
	// Sets the Y position
	var Y = 0;
	if (ChatRoomCharacter.length == 3) Y = 50;
	if (ChatRoomCharacter.length == 4) Y = 150;
	if (ChatRoomCharacter.length == 5) Y = 250;
	
	// Sets the zoom factor
	var Zoom = 1;
	if (ChatRoomCharacter.length == 3) Zoom = 0.9;
	if (ChatRoomCharacter.length == 4) Zoom = 0.7;
	if (ChatRoomCharacter.length >= 5) Zoom = 0.5;

	// Draw the characters
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		DrawCharacter(ChatRoomCharacter[C], (C % 5) * Space + X, Y + Math.floor(C / 5) * 500, Zoom);

}

// When the chat room runs
function ChatRoomRun() {
	ChatRoomDrawCharacter();
	ElementPosition("InputChat", 1400, 945, 800);
	ElementPositionFix("TextAreaChatLog", 36, 1000, 5, 970, 880);
	DrawButton(1805, 905, 90, 90, "", "White", "Icons/Chat.png");
	DrawButton(1905, 905, 90, 90, "", "White", "Icons/Exit.png");
}

// When the player clicks in the chat room
function ChatRoomClick() {
	
	// When the user chats
	if ((MouseX >= 1805) && (MouseX < 1895) && (MouseY >= 905) && (MouseY < 995)) ChatRoomSendChat();

	// When the user leaves
	if ((MouseX >= 1905) && (MouseX < 1995) && (MouseY >= 905) && (MouseY < 995)) {
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		ServerSend("ChatRoomLeave", "");
		CommonSetScreen("Online", "ChatSearch");
	}

}

// The ENTER key sends the chat
function ChatRoomKeyDown() {
	if (KeyPress == 13) ChatRoomSendChat();
}

// Sends the chat to everyone in the room
function ChatRoomSendChat() {
	var msg = ElementValue("InputChat").trim();	
	if (msg != "") ServerSend("ChatRoomChat", { Message: msg } );
	ElementValue("InputChat", "");
}

// When the server sends a response
function ChatRoomResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatRoomLog = data + '\r\n';
}

// When the server sends a chat message
function ChatRoomMessage(data) {
	if ((data != null) && (typeof data === "string") && (data != "")) {
		ChatRoomLog = ChatRoomLog + data + '\r\n';
		ElementValue("TextAreaChatLog", ChatRoomLog);
		setTimeout(function(){ 
			var element = document.getElementById("TextAreaChatLog");
			element.focus();
			element.selectionStart = element.selectionEnd = element.value.length;
			document.getElementById("InputChat").focus();
		}, 0);
	}
}

// Gets the new room data from the server
function ChatRoomSync(data) {
	if ((data != null) && (typeof data === "object") && (data.Name != null)) {

		// Load the room
		if (CurrentScreen != "ChatRoom") CommonSetScreen("Online", "ChatRoom");
		ChatRoomBackground = data.Background;
		ChatRoomData = data;

		// Load the characters
		ChatRoomCharacter = [];		
		for (var C = 0; C < data.Character.length; C++)
			if (data.Character[C].ID.toString() == Player.OnlineID)
				ChatRoomCharacter.push(Player);
			else
				ChatRoomCharacter.push(CharacterLoadOnline(data.Character[C].Name, "Online-" + data.Character[C].ID.toString(), data.Character[C].Appearance));

	}
}