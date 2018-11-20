var MainHallBackground = "MainHall";

// Run the main hall screen
function MainHallRun() {
	
	// Make the user wait if there's something in the account queue
	if (AccountQueueIsEmpty()) {

		// Draws the character and main hall buttons
		DrawCharacter(Player, 750, 0, 1);
		DrawButton(1765, 25, 90, 90, "", ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115)) ? "Cyan" : "White", "Icons/Dress.png");
		DrawButton(1885, 25, 90, 90, "", ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) ? "Cyan" : "White", "Icons/Exit.png");
		if (Player.CanWalk()) DrawButton(1575, 145, 400, 65, "Introduction Class", ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210) && Player.CanWalk()) ? "Cyan" : "White");

	} else DrawText("Synchronizing with account server...", 1000, 500, "White", "Black");

}

// When the user clicks in the main hall screen
function MainHallClick() {

	// We only allow clicks if the account queue is empty
	if (AccountQueueIsEmpty()) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210) && Player.CanWalk()) CommonSetScreen("Introduction");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("CharacterAppearance");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("CharacterLogin");
	}

}
