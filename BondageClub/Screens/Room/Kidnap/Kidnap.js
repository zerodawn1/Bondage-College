"use strict";
var KidnapBackground = "KidnapLeagueDark";
var KidnapOpponent = null;
var KidnapTimer = 0;
var KidnapMode = "";

// Generates the character or player kidnap stats
function KidnapLoadStats(C, Bonus) {
	C.KidnapStat = [SkillGetLevel(C, "BruteForce") + Bonus + 4, SkillGetLevel(C, "Domination") + Bonus + 4, SkillGetLevel(C, "Sneakiness") + Bonus + 4, SkillGetLevel(C, "Manipulation") + Bonus + 4];
}

// Sets the new kidnap mode and timer
function KidnapSetMode(NewMode) {
	KidnapMode = NewMode;
	if (NewMode == "ShowMove") KidnapTimer = CommonTime() + 5000;
	else KidnapTimer = CommonTime() + 15000;
}

// When the player selects it move
function KidnapSelectMove(C, NewMove) {
	KidnapSetMode("ShowMove");
}

// Starts a kidnap match
function KidnapStart(Opponent, Background, Difficulty) {
	if (Difficulty == null) Difficulty = 0;
	KidnapOpponent = Opponent;
	KidnapBackground = Background;
	CurrentCharacter = null;
	Player.KidnapWillpower = 30;
	KidnapOpponent.KidnapWillpower = 30;
	KidnapLoadStats(Player, (Difficulty < 0) ? Difficulty * -1 : 0);
	KidnapLoadStats(KidnapOpponent, (Difficulty > 0) ? Difficulty : 0);
	KidnapSetMode("SelectMove");
	CommonSetScreen("Room", "Kidnap");
}

// Draws the player and opponent moves
function KidnapDrawMoves(C, Header, X) {
	DrawText(TextGet(Header), X, 50, "White", "Gray");
	DrawButton(X - 200, 100, 400, 70, TextGet("BruteForce") + " ( " + C.KidnapStat[0] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 200, 400, 70, TextGet("Domination") + " ( " + C.KidnapStat[1] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 300, 400, 70, TextGet("Sneakiness") + " ( " + C.KidnapStat[2] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 400, 400, 70, TextGet("Manipulation") + " ( " + C.KidnapStat[3] + " )", (C.ID == 0) ? "White" : "Pink");
	DrawButton(X - 200, 900, 400, 70, TextGet("Surrender"), (C.ID == 0) ? "White" : "Pink");
}

// Run the kidnap league
function KidnapRun() {
	
	// Draw the kidnap elements
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(KidnapLeagueTrainer, 1000, 0, 1);
	if (KidnapMode == "SelectMove") { KidnapDrawMoves(Player, "SelectMove", 250); KidnapDrawMoves(KidnapLeagueTrainer, "OpponentMove", 1750); }
	
	// If the time is over, we go to the next step
	if (CommonTime() >= KidnapTimer) {
		if (KidnapMode == "SelectMove") KidnapSelectMove(C, 4);
		if (KidnapMode == "ShowMove") KidnapSetMode("SelectMove");
	}

}

// When the user clicks in the kidnap league room
function KidnapClick() {
	for(var M = 0; M < 4; M++)
		if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseX <= 170 + (M * 100)))
			KidnapSelectMove(C, M);
}