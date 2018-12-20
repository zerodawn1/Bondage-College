"use strict";
var KidnapVictory = false;
var KidnapBackground = "KidnapLeagueDark";
var KidnapReturnFunction = "";
var KidnapOpponent = null;
var KidnapPlayerCloth = null;
var	KidnapOpponentCloth = null;
var KidnapMaxWillpower = 20;
var KidnapTimer = 0;
var KidnapMode = "";
var KidnapDialog = "";
var KidnapPlayerMove = "";
var KidnapOpponentMove = "";
var KidnapResultPlayer = "test";
var KidnapResultOpponent = "test";
var KidnapResultUpperHand = "";
var KidnapUpperHandVictim = null;
var KidnapUpperHandSelection = 0;
var KidnapMoveType = ["BruteForce", "Domination", "Sneakiness", "Manipulation", "Passive"];
var KidnapUpperHandMoveType = ["Cloth", "ItemNeck", "ItemFeet", "ItemMouth", "UndoCloth", "UndoItemNeck", "UndoItemFeet", "UndoItemMouth", "Mercy"];
var KidnapMoveMap = [
	[1, 2, 0, 1, 2], // Brute force
	[0, 1, 1, 2, 2], // Domination 
	[2, 1, 1, 0, 2], // Sneakiness
	[1, 0, 2, 1, 2], // Manipulation
	[0, 0, 0, 0, 0] // Passive
];

// Generates the character or player kidnap stats
function KidnapLoadStats(C, Bonus) {
	C.KidnapStat = [SkillGetLevel(C, KidnapMoveType[0]) + Bonus + 5, SkillGetLevel(C, KidnapMoveType[1]) + Bonus + 5, SkillGetLevel(C, KidnapMoveType[2]) + Bonus + 5, SkillGetLevel(C, KidnapMoveType[3]) + Bonus + 5];
}

// Sets the new kidnap mode and timer
function KidnapSetMode(NewMode) {

	// Removes the focus group if not selecting an item
	if (NewMode != "SelectItem") KidnapOpponent.FocusGroup = null;
	
	// If we must enter in Upper Hand mode
	if (KidnapMode == "UpperHand") KidnapUpperHandVictim = null;
	if ((NewMode == "SelectMove") && (KidnapUpperHandVictim != null)) NewMode = "UpperHand";
	if ((NewMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0)) KidnapAIMoveUpperHand();

	// If we must enter the sudden death mode
	if ((NewMode == "SelectMove") && (Player.KidnapWillpower <= 0) && (KidnapOpponent.KidnapWillpower <= 0)) {
		Player.KidnapWillpower = 1;
		KidnapOpponent.KidnapWillpower = 1;
		NewMode = "SuddenDeath";
	}

	// If we must end the mini game in defeat
	if ((NewMode == "SelectMove") && (Player.KidnapWillpower <= 0)) { 
		InventoryWearRandom(Player, "ItemArms"); 
		NewMode = "End"; 
	}
	
	// If we must end the mini game in victory, one last item can be equiped
	if ((NewMode == "SelectMove") && (KidnapOpponent.KidnapWillpower <= 0)) {
		if (!KidnapVictory) {
			for(var A = 0; A < AssetGroup.length; A++)
				if (AssetGroup[A].Name == "ItemArms")
					KidnapOpponent.FocusGroup = AssetGroup[A];
			if (KidnapOpponent.FocusGroup != null) NewMode = "SelectItem";
			else NewMode = "End";
			KidnapVictory = true;			
		} else NewMode = "End";
	}	
	
	// Sets the mode and timer
	KidnapMode = NewMode;
	if ((NewMode == "Intro") || (NewMode == "SuddenDeath") || (NewMode == "End")) KidnapTimer = CommonTime() + 5000;
	else KidnapTimer = CommonTime() + 15000;

}

// Returns the opponent regular move determined by the AI
function KidnapAIMove() {
	return Math.floor(Math.random() * 4);
}

// Returns TRUE if the Upper Hand move type is available
function KidnapUpperHandMoveAvailable(MoveType, DoMove) {

	// Mercy is always available
	if (MoveType == 8) return true;

	// If we need to check to strip the opponent
	if ((MoveType == 0) && (InventoryGet(KidnapUpperHandVictim, "Cloth") != null)) {
		if (DoMove) InventoryRemove(KidnapUpperHandVictim, "Cloth");
		return true;
	}

	// If we need to check to apply a restrain
	if ((MoveType >= 1) && (MoveType <= 3) && (InventoryGet(KidnapUpperHandVictim, KidnapUpperHandMoveType[MoveType]) == null)) {
		if (DoMove) InventoryWearRandom(KidnapUpperHandVictim, KidnapUpperHandMoveType[MoveType]);
		return true;
	}

	// If we need to check to dress back
	var C = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponent : Player;
	var Cloth = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentCloth : KidnapPlayerCloth;
	if ((MoveType == 4) && (InventoryGet(C, "Cloth") == null) && (Cloth != null)) {
		if (DoMove) InventoryWear(C, Cloth.Asset.Name, "Cloth", Cloth.Color);
		return true;
	}

	// If we need to check to remove the restrain
	if ((MoveType >= 5) && (MoveType <= 7) && (InventoryGet(C, KidnapUpperHandMoveType[MoveType].replace("Undo", "")) != null)) {
		if (DoMove) InventoryRemove(C, KidnapUpperHandMoveType[MoveType].replace("Undo", ""));
		return true;
	}

	// Invalid move
	return false;

}


// Returns the opponent upper hand move determined by the AI
function KidnapAIMoveUpperHand() {
	var Try = 0;
	var MoveDone = false;
	while ((Try < 100) && (MoveDone == false)) {
		KidnapUpperHandSelection = Math.floor(Math.random() * 8);
		MoveDone = KidnapUpperHandMoveAvailable(KidnapUpperHandSelection, true);
		Try++;
	}
	if (MoveDone == false) KidnapUpperHandSelection = 8;
}

// Show the move text on the left side, show the effect on the right side
function KidnapShowMove() {
	DrawTextWrap(TextGet(KidnapDialog + "Action"), 10, 150, 580, 200, "white");
	DrawTextWrap(Player.Name + ": " + DialogGarble(Player, TextGet(KidnapDialog + "Player")), 10, 350, 580, 200, "white");
	DrawTextWrap(KidnapOpponent.Name + ": " + DialogGarble(KidnapOpponent, TextGet(KidnapDialog + "Opponent")), 10, 550, 580, 200, "white");
	DrawTextWrap(KidnapResultPlayer, 1410, 150, 580, 200, "white");
	DrawTextWrap(KidnapResultOpponent, 1410, 350, 580, 200, "white");
	DrawTextWrap(KidnapResultUpperHand, 1410, 550, 580, 200, "white");
	DrawText(TextGet(KidnapMoveType[KidnapPlayerMove]), 750, 25, "white", "gray");
	DrawText(TextGet(KidnapMoveType[KidnapOpponentMove]), 1250, 25, "white", "gray");
}

// Returns TRUE if the move for that person is effective
function KidnapMoveEffective(C, MoveType) {
	if ((MoveType == 0) && (InventoryGet(C, KidnapUpperHandMoveType[MoveType]) != null)) return true;
	if ((MoveType > 0) && (InventoryGet(C, KidnapUpperHandMoveType[MoveType]) == null)) return true;
	return false;
}

// When the player select its move
function KidnapSelectMove(PlayerMove) {
	
	// Gets both moves effectiveness
	var OpponentMove = KidnapAIMove();
	var PM = KidnapMoveMap[PlayerMove][OpponentMove];
	var OM = KidnapMoveMap[OpponentMove][PlayerMove];
	KidnapDialog = "Player" + KidnapMoveType[PlayerMove] + "Opponent" + KidnapMoveType[OpponentMove];

	// Keep the move to show it later
	KidnapPlayerMove = PlayerMove;
	KidnapOpponentMove = OpponentMove;
	
	// If the move is effective, we lower the willpower and show it as text
	if (PM >= 1) {
		var Damage = parseInt(Player.KidnapStat[PlayerMove]);
		if (PlayerMove == OpponentMove) Damage = Damage - parseInt(KidnapOpponent.KidnapStat[OpponentMove]);
		if ((Damage < 0) || !KidnapMoveEffective(Player, PlayerMove)) Damage = 0;
		KidnapOpponent.KidnapWillpower = parseInt(KidnapOpponent.KidnapWillpower) - Damage;
		KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("NoLost");
	if (OM >= 1) {
		var Damage = parseInt(KidnapOpponent.KidnapStat[OpponentMove]);
		if (PlayerMove == OpponentMove) Damage = Damage - parseInt(Player.KidnapStat[PlayerMove]);
		if ((Damage < 0) || !KidnapMoveEffective(KidnapOpponent, OpponentMove)) Damage = 0;
		Player.KidnapWillpower = parseInt(Player.KidnapWillpower) - Damage;
		KidnapResultPlayer = Player.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");		
	} else KidnapResultPlayer = Player.Name + " " + TextGet("NoLost");
	
	// Builds the "Upperhand" text
	KidnapResultUpperHand = "";
	KidnapUpperHandVictim = null;
	if (PM >= 2) { KidnapUpperHandVictim = KidnapOpponent; KidnapResultUpperHand = Player.Name + " " + TextGet("UpperHand"); }
	if (OM >= 2) { KidnapUpperHandVictim = Player; KidnapResultUpperHand = KidnapOpponent.Name + " " + TextGet("UpperHand"); }
	
	// If both players have 0 willpower, they go back to 1 in a sudden death
	if (Player.KidnapWillpower < 0) Player.KidnapWillpower = 0;
	if (KidnapOpponent.KidnapWillpower < 0) KidnapOpponent.KidnapWillpower = 0;

	// Every move gets a +2
	for(var M = 0; M < 4; M++) {
		Player.KidnapStat[M] = parseInt(Player.KidnapStat[M]) + 1;
		KidnapOpponent.KidnapStat[M] = parseInt(KidnapOpponent.KidnapStat[M]) + 1;
	}

	// The move that was used is halved
	if (PlayerMove <= 3) Player.KidnapStat[PlayerMove] = Math.round(Player.KidnapStat[PlayerMove] / 2);
	if (OpponentMove <= 3) KidnapOpponent.KidnapStat[OpponentMove] = Math.round(KidnapOpponent.KidnapStat[OpponentMove] / 2);

	// Shows the move dialog
	KidnapSetMode("ShowMove");

}

// When the player select its upper hand move
function KidnapSelectMoveUpperHand(PlayerMove) {
	
	// Stripping or undoing something is automatic
	if ((PlayerMove == 0) || (PlayerMove == 4) || (PlayerMove == 5) || (PlayerMove == 6) || (PlayerMove == 7)) 
		if (KidnapUpperHandMoveAvailable(PlayerMove, true))
			KidnapSetMode("SelectMove");
		
	// Apply an item enters another mode with a focused group
	if ((PlayerMove == 1) || (PlayerMove == 2) || (PlayerMove == 3))
		if (KidnapUpperHandMoveAvailable(PlayerMove, false)) {
			for(var A = 0; A < AssetGroup.length; A++)
				if (AssetGroup[A].Name == KidnapUpperHandMoveType[PlayerMove])
					KidnapOpponent.FocusGroup = AssetGroup[A];
			if (KidnapOpponent.FocusGroup != null)
				KidnapSetMode("SelectItem");
		}
		
	// Mercy is always available
	if (PlayerMove == 8) KidnapSetMode("SelectMove");
}

// When the player surrenders to her opponent
function KidnapSurrender() {
	Player.KidnapWillpower = 0;
	KidnapSetMode("SelectMove");
}

// Starts a kidnap match
function KidnapStart(Opponent, Background, Difficulty, ReturnFunction) {
	if (Difficulty == null) Difficulty = 0;
	KidnapVictory = false;
	KidnapReturnFunction = ReturnFunction;
	KidnapPlayerCloth = InventoryGet(Player, "Cloth");
	KidnapOpponentCloth = InventoryGet(Opponent, "Cloth");
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
function KidnapDrawMove(C, Header, X) {
	DrawText(TextGet(Header), X, 50, "White", "Gray");
	for(var M = 0; M < 4; M++)
		DrawButton(X - 200, (M * 100) + 100, 400, 70, TextGet(KidnapMoveType[M]) + " ( " + ((KidnapMoveEffective(C, M)) ? C.KidnapStat[M] : 0) + " )", (C.ID == 0) ? (KidnapMoveEffective(C, M) ? "White" : "Silver") : "Pink");
	DrawButton(X - 200, 900, 400, 70, TextGet("Surrender"), (C.ID == 0) ? "White" : "Pink");
}

// Draws the upper hand moves
function KidnapDrawMoveUpperHand() {
	var X = (KidnapUpperHandVictim.ID == 0) ? 1500 : 0;
	if (KidnapUpperHandVictim.ID == 0) DrawTextWrap(TextGet("UpperHand" + KidnapUpperHandMoveType[KidnapUpperHandSelection]), 10, 300, 580, 200, "White");
	DrawText(TextGet("UpperHandMove"), X + 250, 50, "white", "gray");
	for(var M = 0; M <= 9; M++)
		DrawButton(X + 50, (M * 100) + 100, 400, 70, TextGet(KidnapUpperHandMoveType[M]), (KidnapUpperHandVictim.ID != 0) ? "White" : ((KidnapUpperHandSelection == M) ? "Aquamarine" : "Pink"));
}

// Shows a huge timer in the middle of the screen
function KidnapShowTimer() {
	if ((KidnapMode == "SelectItem") || (KidnapMode == "SelectMove") || (KidnapMode == "UpperHand") || (KidnapMode == "ShowMove")) {
		var Sec = Math.floor((KidnapTimer - CommonTime() + 1000) / 1000);
		MainCanvas.font = "italic 200px Arial Narrow"; 
		DrawText(Sec.toString(), (KidnapMode == "SelectItem") ? 500 : 1000, 500, (Sec <= 3) ? "red" : "white", "black"); 
		MainCanvas.font = "36px Arial";
	}
}

// Shows a big title in the center of the screen
function KidnapTitle(Title) {
	MainCanvas.font = "italic 200px Arial Narrow";
	DrawText(Title, 1003, 503, "White");
	DrawText(Title, 997, 497, "Red");
	MainCanvas.font = "36px Arial";
}

// Show the items
function KidnapShowItem() {
	DrawText(TextGet("SelectItemToUse"), 1500, 50, "white", "black");
}

// Run the kidnap league
function KidnapRun() {

	// Draw the kidnap elements
	var X = 500;
	if (KidnapMode == "SelectItem") X = 0;
	DrawCharacter(Player, X, 0, 1);
	DrawCharacter(KidnapLeagueTrainer, X + 500, 0, 1);
	DrawProgressBar(X + 100, 960, 300, 35, Math.round(Player.KidnapWillpower / KidnapMaxWillpower * 100));
	DrawProgressBar(X + 600, 960, 300, 35, Math.round(KidnapOpponent.KidnapWillpower / KidnapMaxWillpower * 100));
	DrawText(Player.KidnapWillpower.toString(), X + 250, 978, "white", "black");
	DrawText(KidnapOpponent.KidnapWillpower.toString(), X + 750, 978, "white", "black");
	if (KidnapMode == "Intro") KidnapTitle(Player.Name + " vs " + KidnapOpponent.Name);
	if (KidnapMode == "SuddenDeath") KidnapTitle(TextGet("SuddenDeath"));
	if (KidnapMode == "End") KidnapTitle(((KidnapVictory) ? Player.Name : KidnapOpponent.Name) + " " + TextGet("Wins"));
	if (KidnapMode == "SelectMove") { KidnapDrawMove(Player, "SelectMove", 250); KidnapDrawMove(KidnapLeagueTrainer, "OpponentMove", 1750); }
	if (KidnapMode == "UpperHand") KidnapDrawMoveUpperHand();
	if (KidnapMode == "ShowMove") KidnapShowMove();
	if (KidnapMode == "SelectItem") KidnapShowItem();

	// If the time is over, we go to the next step
	if (CommonTime() >= KidnapTimer) {
		if (KidnapMode == "SelectMove") { KidnapSelectMove(4); return; }
		if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || (KidnapMode == "UpperHand") || (KidnapMode == "SelectItem")) KidnapSetMode("SelectMove");
	} else KidnapShowTimer();

}

// When the user clicks in the kidnap mini game
function KidnapClick() {

	// If we end in a defeat
	if (KidnapMode == "End") CommonDynamicFunction(KidnapReturnFunction);

	// When the user wants to skip the result or upper hand selection from the AI
	if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0))) {
		KidnapSetMode("SelectMove");
		return;
	}
	
	// When the user selects a regular move
	if (KidnapMode == "SelectMove") {
		for(var M = 0; M < 4; M++)
			if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
				KidnapSelectMove(M);
		if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 900) && (MouseY <= 970))
			KidnapSurrender();
		return;
	}
	
	// When the user selects a upper hand move
	if ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID > 0)) {
		for(var M = 0; M <= 8; M++)
			if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
				KidnapSelectMoveUpperHand(M);
		return;
	}

}