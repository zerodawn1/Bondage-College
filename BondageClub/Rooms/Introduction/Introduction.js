var IntroductionDomme = null;
var IntroductionSub = null;
var IntroductionSubRestrained = false;

// Loads the introduction room
function Introduction_Load() {
	
	// Creates two characters to begin with
	IntroductionDomme = CharacterLoadNPC("NPC-Introduction-Maid");
	IntroductionSub = CharacterLoadNPC("NPC-Introduction-Sub");
	
	// Restrain the sub
	if (!IntroductionSubRestrained) {
		IntroductionSubRestrained = true;
		InventoryAdd(IntroductionSub, "ClothOTMGag", "Gag");
		CharacterAppearanceSetItem(IntroductionSub, "Gag", IntroductionSub.Inventory[IntroductionSub.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(IntroductionSub, "Default", "Cloth");
	}
	
}

// Run the main introduction room
function Introduction_Run() {

	// Draw the background and character
	DrawImage("Backgrounds/Introduction.jpg", 0, 0);
	DrawCharacter(Character[0], 250, 0, 1);
	DrawCharacter(IntroductionDomme, 750, 0, 1);
	DrawCharacter(IntroductionSub, 1250, 0, 1);
	
	// Draws the buttons
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	
}

// When the user clicks in the introduction room
function Introduction_Click() {

	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) SetScreen("MainHall");

}

// When the user presses a key in the introduction room
function Introduction_KeyDown() {
}