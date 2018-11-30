var MiniGameMaidDrinksBackground = "Bar";
var MiniGameMaidDrinksCustomerLeft = null;
var MiniGameMaidDrinksCustomerRight = null;
var MiniGameMaidDrinksCustomerLeftTimer = -1;
var MiniGameMaidDrinksCustomerRightTimer = -1;
var MiniGameMaidDrinksCustomerLeftVisible = false;
var MiniGameMaidDrinksCustomerRightVisible = false;
var MiniGameMaidDrinksMaxSequence = 1000;
var MiniGameMaidDrinksMove = [];
var MiniGameMaidDrinksLastMoveType = -1;
var MiniGameMaidDrinksLastMoveTypeTimer = -1;

// The game is played using the A, S, K & L keys
var MiniGameMaidDrinksKeyUpper = [65, 83, 75, 76]; 
var MiniGameMaidDrinksKeyLower = [97, 115, 107, 108];

// Generates a full sequence
function MiniGameMaidDrinksGenerateMove(StartTime) {
	
	// Full the sequence
	var CurTimer = StartTime + 3000;
	var Seq = 0;
	MiniGameMaidDrinksMove = [];
	while (Seq < MiniGameMaidDrinksMaxSequence) {
		
		// Create a new move to do at a random position
		MiniGameMaidDrinksMove[MiniGameMaidDrinksMove.length] = { Type: Math.floor(Math.random() * 4), Time: CurTimer };
		CurTimer = CurTimer + Math.floor(Math.random() * 800) + 400;
		Seq++;
		
	}

}

// Loads the maid drinks mini game
function MiniGameMaidDrinksLoad() {
	CharacterWearItem(Player, "WoodenMaidTrayFull", "ItemMisc");
	MiniGameMaidDrinksCustomerLeftVisible = false;
	MiniGameMaidDrinksCustomerLeftTimer = -1;
	MiniGameMaidDrinksCustomerLeft = CharacterLoadNPC("NPC_Customer_Left");
	CharacterAppearanceFullRandom(MiniGameMaidDrinksCustomerLeft);
	MiniGameMaidDrinksCustomerRightVisible = false;
	MiniGameMaidDrinksCustomerRightTimer = -1;
	MiniGameMaidDrinksCustomerRight = CharacterLoadNPC("NPC_Customer_Right");
	CharacterAppearanceFullRandom(MiniGameMaidDrinksCustomerRight);
	MiniGameMaidDrinksGenerateMove(5000);
	if (MiniGameDifficulty == "Easy") MiniGameDifficultyRatio = 0.8;
	if (MiniGameDifficulty == "Normal") MiniGameDifficultyRatio = 1.2;
	if (MiniGameDifficulty == "Hard") MiniGameDifficultyRatio = 1.6;
}

// Draw the mini game icons
function MiniGameMaidDrinksDrawIcons() {

	// Scroll the icons with time
	var Seq = 0;
	while (Seq < MiniGameMaidDrinksMove.length) {

		// Draw the move from 3 seconds before to 1 second after
        if ((MiniGameMaidDrinksMove[Seq].Time <= MiniGameTimer + 3000) && (MiniGameMaidDrinksMove[Seq].Time >= MiniGameTimer - 1000))
            DrawImage("Screens/" + CurrentScreen + "/Icon" + MiniGameMaidDrinksMove[Seq].Type + ".png", 1200 + (MiniGameMaidDrinksMove[Seq].Type * 200), 666 + Math.floor((MiniGameTimer - MiniGameMaidDrinksMove[Seq].Time) / 4));

		// Remove the move from the sequence if it's past due
		if (MiniGameMaidDrinksMove[Seq].Time < MiniGameTimer - 1000) {
			MiniGameMaidDrinksMove.splice(Seq, 1);
			MiniGameMaidDrinksMiss();
		}	
		else Seq = Seq + 1;
		
		// Beyond 3 seconds forward, we exit
		if (Seq < MiniGameMaidDrinksMove.length)
			if (MiniGameMaidDrinksMove[Seq].Time > MiniGameTimer + 3000)
				return;

	}

}

// Draw the bars to tell when the moves will hit
function MiniGameMaidDrinksDrawBar(SquareType) {

	// The color changes when it's clicked or pressed
	DrawRect(1210 + (SquareType * 200), 750, 180, 50, "White");
	if ((MiniGameMaidDrinksLastMoveType == SquareType) && (MiniGameMaidDrinksLastMoveTypeTimer >= MiniGameTimer))
		DrawRect(1212 + (SquareType * 200), 752, 176, 46, "#66FF66");
	else
		DrawRect(1212 + (SquareType * 200), 752, 176, 46, "Red");
	if (!CommonIsMobile) DrawText(String.fromCharCode(MiniGameMaidDrinksKeyUpper[SquareType]), 1300 + (SquareType * 200), 775, "white");

}

// Generates random customers for the mini game
function MiniGameMaidDrinksCustomers() {
	
	// Manages the left customer
	if (MiniGameTimer >= MiniGameMaidDrinksCustomerLeftTimer) {
		if (MiniGameMaidDrinksCustomerLeftVisible == false) {
			MiniGameMaidDrinksCustomerLeftVisible = true;
			MiniGameMaidDrinksCustomerLeftTimer = MiniGameTimer + 6000 + Math.random() * 8000;
		} else {
			CharacterAppearanceFullRandom(MiniGameMaidDrinksCustomerLeft);
			MiniGameMaidDrinksCustomerLeftVisible = false;
			MiniGameMaidDrinksCustomerLeftTimer = MiniGameTimer + 3000 + Math.random() * 4000;			
		}
	}

	// Manages the right customer
	if (MiniGameTimer >= MiniGameMaidDrinksCustomerRightTimer) {
		if (MiniGameMaidDrinksCustomerRightVisible == false) {
			MiniGameMaidDrinksCustomerRightVisible = true;
			MiniGameMaidDrinksCustomerRightTimer = MiniGameTimer + 6000 + Math.random() * 8000;
		} else {
			CharacterAppearanceFullRandom(MiniGameMaidDrinksCustomerRight);
			MiniGameMaidDrinksCustomerRightVisible = false;
			MiniGameMaidDrinksCustomerRightTimer = MiniGameTimer + 3000 + Math.random() * 4000;			
		}
	}

}

// Run the maid drinks mini game
function MiniGameMaidDrinksRun() {
	
	// Draw the characters
	if (MiniGameMaidDrinksCustomerLeftVisible) DrawCharacter(MiniGameMaidDrinksCustomerLeft, -50, 0, 1);
	if (MiniGameMaidDrinksCustomerRightVisible) DrawCharacter(MiniGameMaidDrinksCustomerRight, 750, 0, 1);
	DrawCharacter(Player, 350, 0, 1);
	DrawRect(1200, 0, 800, 1000, "Black");
	
	// Increments the timer (altered by the difficulty, the more difficult, the faster it goes)
	if (MiniGameTimer >= 5000) MiniGameTimer = MiniGameTimer + Math.round(CommonRunInterval * MiniGameDifficultyRatio);
	else MiniGameTimer = MiniGameTimer + Math.round(CommonRunInterval);
	
	// Starts the mini game at an even level
	if ((MiniGameProgress == -1) && (MiniGameTimer >= 5000))
		MiniGameProgress = 50;

	// Draw the mini game icons and rectangles
	MiniGameMaidDrinksDrawBar(0);
	MiniGameMaidDrinksDrawBar(1);
	MiniGameMaidDrinksDrawBar(2);
	MiniGameMaidDrinksDrawBar(3);
	
	// If there's no moves left, we full the move list again, there's no tie match
	if ((MiniGameMaidDrinksMove.length == 0) && (!MiniGameEnded))
		MiniGameMaidDrinksGenerateMove(MiniGameTimer);
	
	// Draw the mini game icons and bottom info when the game is running
	if (!MiniGameEnded) {
		if (MiniGameTimer >= 5000) {
			MiniGameMaidDrinksCustomers();
			MiniGameMaidDrinksDrawIcons();
			DrawProgressBar(1200, 975, 800, 25, MiniGameProgress);
		} 
		else {
			DrawText(TextGet("StartsIn") + " " + (5 - Math.floor(MiniGameTimer / 1000)).toString(), 1600, 910, "white");
			DrawText(TextGet("Difficulty") + " " + TextGet(MiniGameDifficulty), 1600, 955, "white");
		}
	}
	else {
		if ((MiniGameProgress >= 100) && MiniGamePerfect) DrawText(TextGet("Perfect"), 1600, 150, "white");
		if ((MiniGameProgress >= 100) && !MiniGamePerfect) DrawText(TextGet("Victory"), 1600, 150, "white");
		if (MiniGameProgress <= 0) DrawText(TextGet("Defeat"), 1600, 150, "white");
		DrawText(TextGet("ClickContinue"), 1600, 300, "white");
	}

}

// Ends the game and sends the result back to the screen
function MiniGameMaidDrinksEnd(Victory) {
	MiniGameMaidDrinksLastMoveType = -1;
	MiniGameMaidDrinksCustomerLeft = null;
	MiniGameMaidDrinksCustomerRight = null;
	CharacterWearItem(Player, "WoodenMaidTray", "ItemMisc");
	if (Victory) MiniGameProgress = 100;
	else MiniGameProgress = 0;
	MiniGameVictory = Victory;
	MiniGameEnded = true;
}

// When the player hits
function MiniGameMaidDrinksHit() {
	MiniGameProgress = MiniGameProgress + 2;
	if (MiniGameProgress >= 100)
		MiniGameMaidDrinksEnd(true);
}

// When the player misses (the penalty is greater on higher difficulties)
function MiniGameMaidDrinksMiss() {
	MiniGamePerfect = false;
	if (MiniGameDifficulty == "Easy") MiniGameProgress = MiniGameProgress - 2;
	if (MiniGameDifficulty == "Normal") MiniGameProgress = MiniGameProgress - 3;
	if (MiniGameDifficulty == "Hard") MiniGameProgress = MiniGameProgress - 4;
	if (MiniGameProgress <= 0) MiniGameMaidDrinksEnd(false);
}

// When the player tries a specific move type
function MiniGameMaidDrinksDoMove(MoveType) {
	
	// Below zero is always a miss
	var Hit = false;
	if ((MoveType >= 0) && (MiniGameMaidDrinksMove.length > 0)) {

		// For each moves in the list
		var Seq = 0;
		while (Seq < MiniGameMaidDrinksMove.length) {
			
			// If the move connects (good timing and good type)
			if ((MiniGameMaidDrinksMove[Seq].Time <= MiniGameTimer + 400) && (MiniGameMaidDrinksMove[Seq].Time >= MiniGameTimer - 400) && (MoveType == MiniGameMaidDrinksMove[Seq].Type)) {
				MiniGameMaidDrinksMove.splice(Seq, 1);
				Hit = true;				
			} 
			else Seq++;

			// Beyond 0.5 seconds forward, we give up
			if (Seq < MiniGameMaidDrinksMove.length)
				if (MiniGameMaidDrinksMove[Seq].Time > MiniGameTimer + 400) 
					Seq = MiniGameMaidDrinksMove.length;

		}
		
	}

	// Depending on hit or miss, we change the progress of the mini game
	MiniGameMaidDrinksLastMoveType = MoveType;
	MiniGameMaidDrinksLastMoveTypeTimer = MiniGameTimer + 200;
	if (Hit) MiniGameMaidDrinksHit();
	else MiniGameMaidDrinksMiss();

}

// When a key is pressed while in the mini game (for both keyboard and mobile)
function MiniGameMaidDrinksKeyDown() {

	// If the game has started, we check the key pressed and send it as a move
	if ((MiniGameTimer > 5000) && (MiniGameProgress != -1) && !MiniGameEnded) {
		var MoveType = -1;
		if ((KeyPress == MiniGameMaidDrinksKeyUpper[0]) || (KeyPress == MiniGameMaidDrinksKeyLower[0])) MoveType = 0;
		if ((KeyPress == MiniGameMaidDrinksKeyUpper[1]) || (KeyPress == MiniGameMaidDrinksKeyLower[1])) MoveType = 1;
		if ((KeyPress == MiniGameMaidDrinksKeyUpper[2]) || (KeyPress == MiniGameMaidDrinksKeyLower[2])) MoveType = 2;
		if ((KeyPress == MiniGameMaidDrinksKeyUpper[3]) || (KeyPress == MiniGameMaidDrinksKeyLower[3])) MoveType = 3;
		MiniGameMaidDrinksDoMove(MoveType);
	}
	
}

// When the user clicks in the maid drinks mini game (only works on mobile)
function MiniGameMaidDrinksClick() {

	// If the game is over, clicking on the image will end it
	if (MiniGameEnded && (MouseX >= 350) && (MouseX <= 849) && (MouseY >= 0) && (MouseY <= 999))
		CommonDynamicFunction(MiniGameReturnFunction + "()");

	// If the game has started, we check the click position and send it as a move
	if ((MiniGameTimer > 5000) && (MiniGameProgress != -1) && !MiniGameEnded && CommonIsMobile) {
		var MoveType = -1;
		if ((MouseX >= 1200) && (MouseX < 1400) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 0;
		if ((MouseX >= 1400) && (MouseX < 1600) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 1;
		if ((MouseX >= 1600) && (MouseX < 1800) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 2;
		if ((MouseX >= 1800) && (MouseX < 2000) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 3;
		MiniGameMaidDrinksDoMove(MoveType);
	}

}