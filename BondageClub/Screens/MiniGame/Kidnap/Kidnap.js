"use strict";
var KidnapBackground = "KidnapLeagueDark";
var KidnapOpponent = null;
var KidnapMaxWillpower = 30;
var KidnapTimer = 0;
var KidnapMode = "";
var KidnapDialog = "";
var KidnapResultPlayer = "test";
var KidnapResultOpponent = "test";
var KidnapMoveType = ["BruteForce", "Domination", "Sneakiness", "Manipulation", "Passive"];
var KidnapMoveMap = [
	[0, 2, 0, 1, 2], // Brute force
	[0, 0, 1, 2, 2], // Domination 
	[2, 1, 0, 0, 2], // Sneakiness
	[1, 0, 2, 0, 2], // Manipulation
	[0, 0, 0, 0, 0] // Passive
];

// Generates the character or player kidnap stats
function KidnapLoadStats(C, Bonus) {
	C.KidnapStat = [SkillGetLevel(C, KidnapMoveType[0]) + Bonus + 4, SkillGetLevel(C, KidnapMoveType[1]) + Bonus + 4, SkillGetLevel(C, KidnapMoveType[2]) + Bonus + 4, SkillGetLevel(C, KidnapMoveType[3]) + Bonus + 4];
}

// Sets the new kidnap mode and timer
function KidnapSetMode(NewMode) {
	KidnapMode = NewMode;
	if (NewMode == "Intro") KidnapTimer = CommonTime() + 2000;
	else if (NewMode == "ShowMove") KidnapTimer = CommonTime() + 9000;
	else KidnapTimer = CommonTime() + 15000;
}

// Returns the opponent move determined by the AI
function KidnapAIMove() {
	return Math.floor(Math.random() * 4);
}

// Show the move text on the left side, show the effect on the right side
function KidnapShowMove() {
	DrawTextWrap(TextGet(KidnapDialog + "Action"), 10, 20, 580, 180, "white");
	if (CommonTime() + 7000 >= KidnapTimer) DrawTextWrap(Player.Name + ": " + DialogGarble(Player, TextGet(KidnapDialog + "Player")), 10, 220, 580, 380, "white");
	if (CommonTime() + 6000 >= KidnapTimer) DrawTextWrap(KidnapOpponent.Name + ": " + DialogGarble(KidnapOpponent, TextGet(KidnapDialog + "Opponent")), 10, 420, 580, 580, "white");
	if (CommonTime() + 5000 >= KidnapTimer) DrawText(KidnapResultPlayer, 1700, 200, "white", "gray");
	if (CommonTime() + 5000 >= KidnapTimer) DrawText(KidnapResultOpponent, 1700, 400, "white", "gray");
}

// When the player select its move
function KidnapSelectMove(PlayerMove) {

	// Gets both moves effectiveness
	var OpponentMove = KidnapAIMove();
	var PM = KidnapMoveMap[PlayerMove][OpponentMove];
	var OM = KidnapMoveMap[OpponentMove][PlayerMove];
	KidnapDialog = "Player" + KidnapMoveType[PlayerMove] + "Opponent" + KidnapMoveType[OpponentMove];

	// If the move is effective, we lower the willpower
	if (PM >= 1) KidnapOpponent.KidnapWillpower = KidnapOpponent.KidnapWillpower - Player.KidnapStat[PlayerMove];
	if (OM >= 1) Player.KidnapWillpower = Player.KidnapWillpower - KidnapOpponent.KidnapStat[OpponentMove];

	// Every move gets a +2
	for(var M = 0; M < 4; M++) {
		Player.KidnapStat[M] = Player.KidnapStat[M] + 2;
		KidnapOpponent.KidnapStat[M] = KidnapOpponent.KidnapStat[M] + 2;
	}

	// The move that was used is halved
	if (PlayerMove <= 3) Player.KidnapStat[PlayerMove] = Math.round(Player.KidnapStat[PlayerMove] / 2);
	if (OpponentMove <= 3) KidnapOpponent.KidnapStat[OpponentMove] = Math.round(KidnapOpponent.KidnapStat[OpponentMove] / 2);

	// Shows the move dialog
	KidnapSetMode("ShowMove");

}

// Starts a kidnap match
function KidnapStart(Opponent, Background, Difficulty) {
	if (Difficulty == null) Difficulty = 0;
	KidnapOpponent = Opponent;
	KidnapBackground = Background;
	CurrentCharacter = null;
	Player.KidnapWillpower = KidnapMaxWillpower;
	KidnapOpponent.KidnapWillpower = KidnapMaxWillpower;
	KidnapLoadStats(Player, (Difficulty < 0) ? Difficulty * -1 : 0);
	KidnapLoadStats(KidnapOpponent, (Difficulty > 0) ? Difficulty : 0);
	KidnapSetMode("Intro");
	CommonSetScreen("MiniGame", "Kidnap");
}

// Draws the player and opponent moves
function KidnapDrawMoves(C, Header, X) {
	DrawText(TextGet(Header), X, 50, "White", "Gray");
	DrawButton(X - 200, 100, 400, 70, TextGet(KidnapMoveType[0]) + " ( " + C.KidnapStat[0] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 200, 400, 70, TextGet(KidnapMoveType[1]) + " ( " + C.KidnapStat[1] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 300, 400, 70, TextGet(KidnapMoveType[2]) + " ( " + C.KidnapStat[2] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 400, 400, 70, TextGet(KidnapMoveType[3]) + " ( " + C.KidnapStat[3] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 900, 400, 70, TextGet("Surrender"), (C.ID == 0) ? "White" : "Pink");
}

// Shows a huge timer in the middle of the screen
function KidnapShowTimer() {
	if (KidnapMode == "SelectMove") {
		var Sec = Math.floor((KidnapTimer - CommonTime() + 1000) / 1000);
		MainCanvas.font = "italic 200px Arial Narrow"; 
		DrawText(Sec.toString(), 1000, 500, (Sec <= 3) ? "red" : "white", "black"); 
		MainCanvas.font = "36px Arial";
	}
}

// Run the kidnap league
function KidnapRun() {
	
	// Draw the kidnap elements
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(KidnapLeagueTrainer, 1000, 0, 1);
	DrawProgressBar(600, 960, 300, 35, Math.round(Player.KidnapWillpower / KidnapMaxWillpower * 100));
	DrawProgressBar(1100, 960, 300, 35, Math.round(KidnapOpponent.KidnapWillpower / KidnapMaxWillpower * 100));
	DrawText(Player.KidnapWillpower.toString(), 750, 978, "white", "black");
	DrawText(KidnapOpponent.KidnapWillpower.toString(), 1250, 978, "white", "black");
	if (KidnapMode == "Intro") { MainCanvas.font = "italic 200px Arial Narrow"; DrawText(Player.Name + " vs " + KidnapOpponent.Name, 1000, 500, "red", "white"); MainCanvas.font = "36px Arial"; }
	if (KidnapMode == "SelectMove") { KidnapDrawMoves(Player, "SelectMove", 250); KidnapDrawMoves(KidnapLeagueTrainer, "OpponentMove", 1750); }
	if (KidnapMode == "ShowMove") KidnapShowMove();
	
	// If the time is over, we go to the next step
	if (CommonTime() >= KidnapTimer) {
		if (KidnapMode == "Intro") { KidnapSetMode("SelectMove"); return; }
		if (KidnapMode == "SelectMove") { KidnapSelectMove(4); return; }
		if (KidnapMode == "ShowMove") { KidnapSetMode("SelectMove"); return }
	} else KidnapShowTimer();

}

// When the user clicks in the kidnap league room
function KidnapClick() {
	for(var M = 0; M < 4; M++)
		if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
			KidnapSelectMove(M);
}