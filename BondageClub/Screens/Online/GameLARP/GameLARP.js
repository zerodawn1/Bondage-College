"use strict";
var GameLARPBackground = "Sheet";
var GameLARPClassList = ["Matron", "Seducer", "Trickster", "Servant", "Artist", "Protector"];
var GameLARPTeamList = ["None", "Red", "Green", "Blue", "Yellow", "Cyan", "Purple", "Orange", "White", "Gray", "Black"];
var GameLARPEntryClass = "";
var GameLARPEntryTeam = "";
var GameLARPProgress = [];

// Draws the LARP class/team icon of a character
function GameLARPDrawIcon(C, X, Y, Zoom) {
	if ((C != null) && (C.Game != null) && (C.Game.LARP != null) && (C.Game.LARP.Class != null) && (C.Game.LARP.Team != null) && (C.Game.LARP.Team != "None"))
		DrawImageZoomCanvas("Icons/LARP/" + C.Game.LARP.Class + C.Game.LARP.Team + ".png", MainCanvas, 0, 0, 100, 100, X, Y, 100 * Zoom, 100 * Zoom);
}

// When the screens loads
function GameLARPLoad() {
	GameLARPEntryClass = Player.Game.LARP.Class;
	GameLARPEntryTeam = Player.Game.LARP.Team;
	if (GameLARPGetStatus() == "") GameLARPProgress = [];
}

// When the screen runs
function GameLARPRun() {

	// Draw the character, text and buttons
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Title"), 550, 125, "Black", "Gray");
	DrawText(TextGet("SelectClass"), 550, 225, "Black", "Gray");
	DrawText(TextGet("SelectTeam"), 550, 325, "Black", "Gray");
	if (GameLARPGetStatus() != "") DrawText(TextGet("Class" + Player.Game.LARP.Class), 900, 225, "Black", "Gray");
	if (GameLARPGetStatus() != "") DrawText(TextGet("Color" + Player.Game.LARP.Team), 900, 325, "Black", "Gray");
	DrawText(TextGet((GameLARPGetStatus() == "") ? "StartCondition" : "RunningGame"), 550, 425, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (GameLARPGetStatus() == "") DrawBackNextButton(900, 193, 400, 64, TextGet("Class" + Player.Game.LARP.Class), "White", "", () => "", () => "");
	if (GameLARPGetStatus() == "") DrawBackNextButton(900, 293, 400, 64, TextGet("Color" + Player.Game.LARP.Team), "White", "", () => "", () => "");
	GameLARPDrawIcon(Player, 1400, 200, 1.5);
	if (GameLARPCanLaunchGame()) DrawButton(550, 500, 400, 65, TextGet("StartGame"), "White");

}

// When the player clicks in the chat Admin screen
function GameLARPClick() {

	// When the user exits
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) GameLARPExit();

	// When the user selects a new class
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 193) && (MouseY < 257) && (GameLARPGetStatus() == "")) {
		if (MouseX <= 1100) Player.Game.LARP.Class = (GameLARPClassList.indexOf(Player.Game.LARP.Class) <= 0) ? GameLARPClassList[GameLARPClassList.length - 1] : GameLARPClassList[GameLARPClassList.indexOf(Player.Game.LARP.Class) - 1];
		else Player.Game.LARP.Class = (GameLARPClassList.indexOf(Player.Game.LARP.Class) >= GameLARPClassList.length - 1) ? GameLARPClassList[0] : GameLARPClassList[GameLARPClassList.indexOf(Player.Game.LARP.Class) + 1];
	}
	
	// When the user selects a new team
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 293) && (MouseY < 357) && (GameLARPGetStatus() == "")) {
		if (MouseX <= 1100) Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) <= 0) ? GameLARPTeamList[GameLARPTeamList.length - 1] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) - 1];
		else Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) >= GameLARPTeamList.length - 1) ? GameLARPTeamList[0] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) + 1];
	}
	
	// If the administrator wants to start the game
	if ((MouseX >= 550) && (MouseX < 950) && (MouseY >= 500) && (MouseY < 565) && GameLARPCanLaunchGame()) {

		// Shuffles all players in the chat room
		for (var C = 0; C < ChatRoomCharacter.length; C++) {
			if (ChatRoomCharacter[C].MemberNumber != Player.MemberNumber) {
				ServerSend("ChatRoomAdmin", { MemberNumber: ChatRoomCharacter[C].MemberNumber, Action: "Shuffle" });
				break;
			}
		}

		// Notices everyone in the room that the game starts
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		ServerSend("ChatRoomChat", { Content: "LARPGameStart", Type: "Action" , Dictionary: Dictionary});

		// Changes the game status and exits
		ServerSend("ChatRoomGame", { GameProgress: "Start" });
		Player.Game.LARP.Status = "Running";
		ServerSend("AccountUpdate", { Game: Player.Game });
		ChatRoomCharacterUpdate(Player);
		CommonSetScreen("Online", "ChatRoom");

	}
	
}

// When the user exit from this screen
function GameLARPExit() {

	// When the game isn't running, we allow to change the class or team
	if (GameLARPGetStatus() == "") {
		
		// Notices everyone in the room of the change
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		ServerSend("ChatRoomChat", { Content: "LARPChangeTeamClass", Type: "Action" , Dictionary: Dictionary});

		// Updates the player and go back to the chat room
		ServerSend("AccountUpdate", { Game: Player.Game });
		ChatRoomCharacterUpdate(Player);
		CommonSetScreen("Online", "ChatRoom");

	} else {
		Player.Game.LARP.Class = GameLARPEntryClass;
		Player.Game.LARP.Team = GameLARPEntryTeam;
		CommonSetScreen("Online", "ChatRoom");
	}

}

// The game status is maintained by the room administrator/creator
function GameLARPGetStatus() {
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0)
			return ChatRoomCharacter[C].Game.LARP.Status;
	return "";
}

// Returns TRUE if the game can be launched, the player must an administrator and two different teams must be selected
function GameLARPCanLaunchGame() {
	if (Player.Game.LARP.Class != GameLARPEntryClass) return false;
	if (Player.Game.LARP.Team != GameLARPEntryTeam) return false;
	if (GameLARPGetStatus() != "") return false;
	if (!ChatRoomPlayerIsAdmin()) return false;
	var Team = "";
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game.LARP.Team != "") && (ChatRoomCharacter[C].Game.LARP.Team != "None")) {
			if (Team == "")
				Team = ChatRoomCharacter[C].Game.LARP.Team;
			else
				if (Team != ChatRoomCharacter[C].Game.LARP.Team)
					return true;
		}
	return false;
}

// Processes the LARP game clicks
function GameLARPChatRoomClick(C) {
	console.log(C.MemberNumber);
}

// Returns the character currently playing the turn
function GameLARPGetCurrentPlayer() {
	return Player;
}

function GameLARPDisplayTurn() {
	var C = GameLARPGetCurrentPlayer();
	
}

// Processes the LARP game messages
function GameLARPProcess(P) {
	if ((P != null) && (typeof P === "object") && (P.Data != null) && (typeof P.Data === "object") && (P.Sender != null) && (typeof P.Sender === "number") && (P.RNG != null) && (typeof P.RNG === "number")) {
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress == "Start")) GameLARPProgress = [];
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress != "")) {
			GameLARPProgress.push({ Sender: P.Sender, Time: CurrentTime, RNG: P.RNG, Data: P.Data });
			GameLARPDisplayTurn();
		}
		console.log(P);
	}
}