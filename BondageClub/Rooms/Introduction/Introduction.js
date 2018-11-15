var IntroductionMaid = null;
var IntroductionSub = null;
var IntroductionSubRestrained = false;
var IntroductionMaidOpinion = 0;
var IntroductionBodyRect = null;
var IntroductionHasBasicItems = false;

// Loads the introduction room
function Introduction_Load() {

	// Checks if the player already has the basic items
	IntroductionHasBasicItems = (InventoryAvailable(Character[0], "BeginnersRope", "ItemFeet") && InventoryAvailable(Character[0], "BeginnersRope", "ItemLegs") && InventoryAvailable(Character[0], "BeginnersRope", "ItemArms") && InventoryAvailable(Character[0], "BeginnersClothGag", "ItemMouth"));
	
	// Creates two characters to begin with
	IntroductionMaid = CharacterLoadNPC("NPC_Introduction_Maid");
	IntroductionSub = CharacterLoadNPC("NPC_Introduction_Sub");
	IntroductionMaid.AllowItem = false;

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

		// We draw the dialog setup
		DrawImage("Backgrounds/IntroductionDark.jpg", 0, 0);
		DialogDraw();
		if (IntroductionBodyRect != null) {
			DrawEmptyRect(IntroductionBodyRect[0], IntroductionBodyRect[1], IntroductionBodyRect[2], IntroductionBodyRect[3], "cyan");
			DrawEmptyRect(IntroductionBodyRect[0] + 500, IntroductionBodyRect[1], IntroductionBodyRect[2], IntroductionBodyRect[3], "cyan");
			if (CurrentCharacter.Stage == "35") {
				DrawEmptyRect(IntroductionBodyRect[0] + 300, IntroductionBodyRect[1], IntroductionBodyRect[2], IntroductionBodyRect[3], "cyan");
				DrawEmptyRect(IntroductionBodyRect[0] + 800, IntroductionBodyRect[1], IntroductionBodyRect[2], IntroductionBodyRect[3], "cyan");				
			}
		}

	}
	
}

// When the user clicks in the introduction room
function Introduction_Click() {

	// Activates the character or the interaction events
	if (CurrentCharacter == null) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = IntroductionMaid;
		if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = IntroductionSub;
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) SetScreen("MainHall");
	} else DialogClick();

}

// When the user presses a key in the introduction room
function Introduction_KeyDown() {
}

// The maid opinion will affect the global player Domme/sub reputation at the end of the first training
function Introduction_ChangeMaidOpinion(Bonus) {
	IntroductionMaidOpinion = IntroductionMaidOpinion + Bonus;
}

// Gives focus on certain body parts with rectangles
function Introduction_SetZone(NewZone) {
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == NewZone) {
			Character[0].FocusGroup = AssetGroup[A];
			CurrentCharacter.FocusGroup = AssetGroup[A];
			break;
		}
}

// Clears the body part focus rectangles
function Introduction_ClearZone() {
	Character[0].FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
}

// Loads the introduction room
function Introduction_GetBasicItems() {
	InventoryAdd(Character[0], "BeginnersRope", "ItemFeet");
	InventoryAdd(Character[0], "BeginnersRope", "ItemLegs");
	InventoryAdd(Character[0], "BeginnersRope", "ItemArms");
	InventoryAdd(Character[0], "BeginnersClothGag", "ItemMouth");
}
