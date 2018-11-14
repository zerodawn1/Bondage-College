// Loads the character login screen
function MainHall_Load() {


}

// Run the main hall screen
function MainHall_Run() {

	// Draw the background and character
	DrawImage("Backgrounds/MainHall.jpg", 0, 0);
	DrawCharacter(Character[0], 750, 0, 1);
	
	// Draws the buttons
	DrawButton(1765, 25, 90, 90, "", "White", "Icons/Dress.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1575, 145, 400, 65, "Introduction Class", "White");
	
}

// When the user clicks in the main hall screen
function MainHall_Click() {

	if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210)) SetScreen("Introduction");
	if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115)) SetScreen("CharacterAppearance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) GameInit();

}

function MainHall_KeyDown() {
	
}
