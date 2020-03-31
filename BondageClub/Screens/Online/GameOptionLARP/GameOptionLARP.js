"use strict";
var GameOptionLARPBackground = "Sheet";
var GameOptionLARPTeamList = ["None", "Red", "Green", "Blue", "Yellow", "Cyan", "Purple", "Orange", "White", "Gray", "Black"];

// When the screens loads
function GameOptionLARPLoad() {

}

// When the screen runs
function GameOptionLARPRun() {

	// Draw the character, text and buttons
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Title"), 550, 125, "Black", "Gray");
	DrawText(TextGet("SelectTeam"), 550, 225, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawBackNextButton(900, 193, 400, 64, TextGet("Color" + Player.LARP.Team), "White", "", () => "", () => "");
	if (Player.LARP.Team != "None") DrawImage("Screens/Room/LARP/" + Player.LARP.Class + Player.LARP.Team + ".png", 1050, 300);

}

// When the player clicks in the chat Admin screen
function GameOptionLARPClick() {

	// When the user exits
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) GameOptionLARPExit();

	// When the user selects a new team
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 193) && (MouseY < 257)) {
		if (MouseX <= 1100) Player.LARP.Team = (GameOptionLARPTeamList.indexOf(Player.LARP.Team) <= 0) ? GameOptionLARPTeamList[GameOptionLARPTeamList.length - 1] : GameOptionLARPTeamList[GameOptionLARPTeamList.indexOf(Player.LARP.Team) - 1];
		else Player.LARP.Team = (GameOptionLARPTeamList.indexOf(Player.LARP.Team) >= GameOptionLARPTeamList.length - 1) ? GameOptionLARPTeamList[0] : GameOptionLARPTeamList[GameOptionLARPTeamList.indexOf(Player.LARP.Team) + 1];
	}
	
}

// When the user exit from this screen
function GameOptionLARPExit() {
	CommonSetScreen("Online", "ChatRoom");
}