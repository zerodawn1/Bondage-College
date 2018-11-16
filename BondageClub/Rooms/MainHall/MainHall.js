// Loads the main hall screen
function MainHall_Load() {
}

// Run the main hall screen
function MainHall_Run() {

	// Draw the background and player character
	DrawImage("Backgrounds/MainHall.jpg", 0, 0);
	
	// If there's no selected character
	if (CurrentCharacter == null) {
	
		DrawCharacter(Character[0], 750, 0, 1);
		
		// If we are not waiting on the server
		if (AccountQueueIsEmpty()) {

			// Draws the main hall buttons
			DrawButton(1765, 25, 90, 90, "", "White", "Icons/Dress.png");
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
			DrawButton(1575, 145, 400, 65, "Introduction Class", "White");

		} else DrawText("Synchronizing with account server...", 1500, 500, "White", "Black");
		
	} else {

		DialogDraw();
		
	}

}

// When the user clicks in the main hall screen
function MainHall_Click() {

	if (CurrentCharacter == null) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = Character[0];
		if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210)) SetScreen("Introduction");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115)) SetScreen("CharacterAppearance");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) GameInit();
	} else DialogClick();

}

// When the user presses keys in the main hall
function MainHall_KeyDown() {
}