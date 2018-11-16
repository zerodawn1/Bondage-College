var IntroductionBackground = "MainHall";
var IntroductionMaid = null;
var IntroductionSub = null;
var IntroductionMaidOpinion = 0;
var IntroductionHasBasicItems = false;

// Loads the introduction room
function IntroductionLoad() {

	// Checks if the player already has the basic items
	IntroductionHasBasicItems = (InventoryAvailable(Player, "BeginnersRope", "ItemFeet") && InventoryAvailable(Player, "BeginnersRope", "ItemLegs") && InventoryAvailable(Player, "BeginnersRope", "ItemArms") && InventoryAvailable(Player, "BeginnersClothGag", "ItemMouth"));
	
	// Creates two characters to begin with
	IntroductionMaid = CharacterLoadNPC("NPC_Introduction_Maid");
	IntroductionSub = CharacterLoadNPC("NPC_Introduction_Sub");
	IntroductionMaid.AllowItem = false;

}

// Run the main introduction room, draw all 3 characters
function IntroductionRun() {
	DrawImage("Backgrounds/Introduction.jpg", 0, 0);
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(IntroductionMaid, 750, 0, 1);		
	DrawCharacter(IntroductionSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the introduction room
function IntroductionClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = Player;
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = IntroductionMaid;
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CurrentCharacter = IntroductionSub;
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("MainHall");
}

// The maid opinion will affect the global player Domme/sub reputation at the end of the first training
function IntroductionChangeMaidOpinion(Bonus) {
	IntroductionMaidOpinion = IntroductionMaidOpinion + Bonus;
}

// Gives focus on certain body parts with rectangles
function IntroductionSetZone(NewZone) {
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == NewZone) {
			Player.FocusGroup = AssetGroup[A];
			CurrentCharacter.FocusGroup = AssetGroup[A];
			break;
		}
}

// Clears the body part focus rectangles
function IntroductionClearZone() {
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
}

// The maid can give basic items to the player
function IntroductionGetBasicItems() {
	InventoryAdd(Player, "BeginnersRope", "ItemFeet");
	InventoryAdd(Player, "BeginnersRope", "ItemLegs");
	InventoryAdd(Player, "BeginnersRope", "ItemArms");
	InventoryAdd(Player, "BeginnersClothGag", "ItemMouth");
}
