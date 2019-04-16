"use strict";
var ChatRoomBackground = "";
var ChatRoomData = {};
var ChatRoomCharacter = [];
var ChatRoomLog = "";

// Creates the chat room input elements
function ChatRoomCreateElement() {
	if (document.getElementById("InputChat") == null) {
		ElementCreateInput("InputChat", "text", "", "250");
		ElementCreateTextArea("TextAreaChatLog");
		ElementValue("TextAreaChatLog", ChatRoomLog);
		document.getElementById("InputChat").focus();
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
	}
}

// When the chat room loads
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ChatRoomLog = "";
	ChatRoomCreateElement();
}

// Draw the characters in the room
function ChatRoomDrawCharacter(DoClick) {

	// If there's 2 characters, it's zoomed in
	if (!DoClick) {
		if (ChatRoomCharacter.length <= 2) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 500, 0, 1000, 1000, 0, 0, 1000, 1000);
		if (ChatRoomCharacter.length == 3) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 400, 0, 1200, 1000, 0, 50, 1000, 900);
		if (ChatRoomCharacter.length == 4) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 200, 0, 1600, 1000, 0, 150, 1000, 700);
		if (ChatRoomCharacter.length == 5) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 250, 1000, 500);
		if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 0, 1000, 500);
		if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 500, 1000, 500);
	}

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
		if (DoClick) {
			if ((MouseX >= (C % 5) * Space + X) && (MouseX <= (C % 5) * Space + X + 500 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500) && (MouseX <= Y + Math.floor(C / 5) * 500 + 1000 * Zoom)) {
				ElementRemove("InputChat");
				ElementRemove("TextAreaChatLog");
				ChatRoomBackground = ChatRoomData.Background;
				CharacterSetCurrent(ChatRoomCharacter[C]);
			}
		}
		else
			DrawCharacter(ChatRoomCharacter[C], (C % 5) * Space + X, Y + Math.floor(C / 5) * 500, Zoom);

}

// When the chat room runs
function ChatRoomRun() {
	ChatRoomCreateElement();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	ElementPosition("InputChat", 1403, 945, 796);
	ElementPositionFix("TextAreaChatLog", 36, 1005, 5, 970, 878);
	DrawButton(1805, 905, 90, 90, "", "White", "Icons/Chat.png");
	if (Player.CanWalk()) DrawButton(1905, 905, 90, 90, "", "White", "Icons/Exit.png");
}

// When the player clicks in the chat room
function ChatRoomClick() {
	
	// When the user chats
	if ((MouseX >= 0) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) ChatRoomDrawCharacter(true);
	if ((MouseX >= 1805) && (MouseX < 1895) && (MouseY >= 905) && (MouseY < 995)) ChatRoomSendChat();

	// When the user leaves
	if ((MouseX >= 1905) && (MouseX < 1995) && (MouseY >= 905) && (MouseY < 995) && (Player.CanWalk())) {
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
	var msg = DialogGarble(Player, ElementValue("InputChat").trim());
	if (msg != "") ServerSend("ChatRoomChat", { Message: msg } );
	ElementValue("InputChat", "");
}

// Publishes the player action to the chat
function ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem) {
	var msg = "(" + Player.Name;
	var dest = (C.ID == 0) ? "herself" : C.Name;
	if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null)) msg = msg + " swaps " + DialogProgressPrevItem.Asset.Name + " for " + DialogProgressNextItem.Asset.Name + " on " + dest + ".)";
	else if (DialogProgressNextItem != null) msg = msg + " uses " + DialogProgressNextItem.Asset.Name + " on " + dest + ".)";
	else msg = msg + " removes " + DialogProgressPrevItem.Asset.Name + " from " + dest + ".)";
	ServerSend("ChatRoomChat", { Message: msg } );
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
		if (document.getElementById("TextAreaChatLog") != null) {
			ElementValue("TextAreaChatLog", ChatRoomLog);
			setTimeout(function(){ 
				var element = document.getElementById("TextAreaChatLog");
				element.focus();
				element.selectionStart = element.selectionEnd = element.value.length;
				document.getElementById("InputChat").focus();
			}, 0);
		}
	}
}

// Gets the new room data from the server
function ChatRoomSync(data) {
	if ((data != null) && (typeof data === "object") && (data.Name != null)) {

		// Load the room
		if (CurrentScreen != "ChatRoom") CommonSetScreen("Online", "ChatRoom");
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