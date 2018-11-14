var IntroductionMaid = null;
var IntroductionSub = null;
var IntroductionSubRestrained = false;

// Loads the introduction room
function Introduction_Load() {
	
	// Creates two characters to begin with
	IntroductionMaid = CharacterLoadNPC("NPC_Introduction_Maid");
	IntroductionSub = CharacterLoadNPC("NPC_Introduction_Sub");
	
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
	
	// If there's no selected character
	if (CurrentCharacter == null) {
		
		// We draw everyone and the exit
		DrawImage("Backgrounds/Introduction.jpg", 0, 0);
		DrawCharacter(Character[0], 250, 0, 1);
		DrawCharacter(IntroductionMaid, 750, 0, 1);
		DrawCharacter(IntroductionSub, 1250, 0, 1);
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");		
		
	} else {

		// We draw everyone and the exit
		DrawImage("Backgrounds/IntroductionDark.jpg", 0, 0);
		DrawInteraction();
		
	}
	
}

// When the user clicks in the introduction room
function Introduction_Click() {

	// Activates the character or the interaction events
	if (CurrentCharacter == null) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = IntroductionMaid;
		if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = IntroductionSub;
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) SetScreen("MainHall");
	} else Common_InteractionClick();

}

// When the user presses a key in the introduction room
function Introduction_KeyDown() {
}