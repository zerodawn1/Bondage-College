var MainHallBackground = "MainHall";

// Run the main hall screen
function MainHallRun() {

	// Make the user wait if there's something in the account queue
	if (AccountQueueIsEmpty()) {

		// Draws the character and main hall buttons
		DrawCharacter(Player, 750, 0, 1);
		DrawButton(1525, 25, 90, 90, "", "White", "Icons/Character.png");
		DrawButton(1645, 25, 90, 90, "", "White", "Icons/Dress.png");
		if (Player.CanWalk()) DrawButton(1765, 25, 90, 90, "", "White", "Icons/Shop.png");
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		if (Player.CanWalk()) DrawButton(1525, 145, 450, 65, TextGet("IntroductionClass"), "White");

	} else DrawText(TextGet("SyncWithServer"), 1000, 500, "White", "Black");

}

// When the user clicks in the main hall screen
function MainHallClick() {

	// We only allow clicks if the account queue is empty
	if (AccountQueueIsEmpty()) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210) && Player.CanWalk()) CommonSetScreen("Introduction");
		if ((MouseX >= 1525) && (MouseX < 1615) && (MouseY >= 25) && (MouseY < 115)) { CharacterInformationSelection = Player; CommonSetScreen("CharacterInformation"); }
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("CharacterAppearance");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Shop");		  
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("CharacterLogin");
	}

}
