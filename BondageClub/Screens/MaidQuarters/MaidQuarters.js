var MaidQuartersBackground = "MaidQuarters";
var MaidQuartersMaid = null;
var MaidQuartersMaidInitiation = null;
var MaidQuartersPreviousClothName = null;
var MaidQuartersPreviousClothColor = "";
var MaidQuartersPreviousHatName = null;
var MaidQuartersPreviousHatColor = "";
var MaidQuartersPlayerInMaidUniform = false;
var MaidQuartersMaidReleasedPlayer = false;
var MaidQuartersCanBecomeMaid = false;
var MaidQuartersCannotBecomeMaidYet = false
var MaidQuartersCanBecomeHeadMaid = false;
var MaidQuartersCannotBecomeHeadMaidYet = false
var MaidQuartersIsMaid = false;
var MaidQuartersDominantRep = 0;

// Loads the maid quarters room
function MaidQuartersLoad() {

	// Creates the maid that gives work
	MaidQuartersMaid = CharacterLoadNPC("NPC_MaidQuarters_Maid");
	MaidQuartersMaidInitiation = CharacterLoadNPC("NPC_MaidQuarters_InitiationMaids");
	CharacterWearItem(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");
	MaidQuartersPlayerInMaidUniform = ((CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidOutfit1") && (CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1"));

}

// Run the maid quarters, draw both characters
function MaidQuartersRun() {
	MaidQuartersCanBecomeMaid = (!LogQuery("JoinedSorority", "Maid") && (ReputationGet("Maid") >= 50));
	MaidQuartersCannotBecomeMaidYet = ((ReputationGet("Maid") > 0) && (ReputationGet("Maid") < 50) && !LogQuery("JoinedSorority", "Maid"));
	MaidQuartersCanBecomeHeadMaid = ((ReputationGet("Maid") >= 100) && (ReputationGet("Dominant") >= 50) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersCannotBecomeHeadMaidYet = (((ReputationGet("Maid") < 100) || (ReputationGet("Dominant") < 50)) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersIsMaid = LogQuery("JoinedSorority", "Maid");
	MaidQuartersIsHeadMaid = LogQuery("LeadSorority", "Maid");
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(MaidQuartersMaid, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the maid quarters
function MaidQuartersClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MaidQuartersMaid);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("MainHall");
}

// The maid can ungag the player
function MaidQuartersMaidUngagPlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		CharacterRemove(Player, "ItemMouth");
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

// When the player dresses as a maid
function MaidQuartersWearMaidUniform() {
	MaidQuartersPreviousClothName = CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name");
	MaidQuartersPreviousClothColor = CharacterAppearanceGetCurrentValue(Player, "Cloth", "Color");
	MaidQuartersPreviousHatName = CharacterAppearanceGetCurrentValue(Player, "Hat", "Name");
	MaidQuartersPreviousHatColor = CharacterAppearanceGetCurrentValue(Player, "Hat", "Color");
	CharacterWearItem(Player, "MaidOutfit1", "Cloth", "Default");
	CharacterWearItem(Player, "MaidHairband1", "Hat", "Default");
}

// When the player removes the maid uniform and dresses back
function MaidQuartersRemoveMaidUniform() {
	CharacterRelease(Player);
	if ((MaidQuartersPreviousClothName != null) && (MaidQuartersPreviousClothName != "None")) CharacterWearItem(Player, MaidQuartersPreviousClothName, "Cloth", MaidQuartersPreviousClothColor);
	else CharacterRemove(Player, "Cloth");
	if ((MaidQuartersPreviousHatName != null) && (MaidQuartersPreviousHatName != "None")) CharacterWearItem(Player, MaidQuartersPreviousHatName, "Hat", MaidQuartersPreviousHatColor);
	else CharacterRemove(Player, "Hat");
	CharacterRemove(Player, "ItemMisc");
}

// When the mini game / maid chore starts
function MaidQuartersMiniGameStart(GameType, Difficulty) {
	MiniGameStart(GameType, Difficulty, "MaidQuartersMiniGameEnd");
}

// When the mini game ends, we go back to the maid
function MaidQuartersMiniGameEnd() {
	CommonSetScreen("MaidQuarters");
	CharacterSetCurrent(MaidQuartersMaid);
	if (MiniGameVictory && (MiniGameType == "MaidDrinks")) {
		MaidQuartersMaid.Stage = "281";
		MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "MaidDrinksVictory");
	}
	if (!MiniGameVictory && (MiniGameType == "MaidDrinks")) {
		MaidQuartersMaid.Stage = "282";
		MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "MaidDrinksDefeat");
	}
}

// When the mini game / maid chore is successful, the player gets paid
function MaidQuartersMiniGamePay() {
	ReputationProgress("Maid", 4);
	var M = 8;
	if (MiniGameDifficulty == "Normal") M = M * 1.5;
	if (MiniGameDifficulty == "Hard") M = M * 2;
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
}

// When the maid releases the player
function MaidQuartersMaidReleasePlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		CharacterRelease(Player);
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

// Prepares a counter that will affect the dominant reputation of the player
function MaidQuartersDominantRepChange(Value) {
	MaidQuartersDominantRep = MaidQuartersDominantRep + Value;
}

// When we switch from one maid to another in the initiation
function MaidQuartersInitiationTransition(C) {
	CharacterSetCurrent(C);
	C.CurrentDialog = DialogFind(C, "MaidInitiationTransition");
}

// Change the initiation maid appearance on the spot to simulate a new character
function MaidQuartersChangeInitiationMaid() {
	CharacterRandomName(MaidQuartersMaidInitiation);
	CharacterAppearanceFullRandom(MaidQuartersMaidInitiation);
	CharacterAppearanceSetItem(MaidQuartersMaidInitiation, "Cloth", MaidQuartersMaidInitiation.Inventory[MaidQuartersMaidInitiation.Inventory.length - 2].Asset);
	CharacterAppearanceSetItem(MaidQuartersMaidInitiation, "Hat", MaidQuartersMaidInitiation.Inventory[MaidQuartersMaidInitiation.Inventory.length - 1].Asset);
	CharacterAppearanceSetColorForGroup(MaidQuartersMaidInitiation, "Default", "Cloth");
	CharacterAppearanceSetColorForGroup(MaidQuartersMaidInitiation, "Default", "Hat");
	CharacterWearItem(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");
}

// When the player becomes a maid
function MaidQuartersBecomMaid() {
	InventoryAdd(Player, "MaidOutfit1", "Cloth");
	InventoryAdd(Player, "MaidHairband1", "Hat");
	CharacterWearItem(Player, "MaidOutfit1", "Cloth", "Default");
	CharacterWearItem(Player, "MaidHairband1", "Hat", "Default");
	CharacterAppearanceValidate(Player);
	LogAdd("JoinedSorority", "Maid");
	ReputationProgress("Dominant", MaidQuartersDominantRep);
	MaidQuartersCanBecomeMaid = false;
	MaidQuartersIsMaid = true;
}

// When the player becomes head maid
function MaidQuartersBecomHeadMaid() {
	MaidQuartersIsHeadMaid = true;
	LogAdd("LeadSorority", "Maid");
}

// Returns TRUE if the maid drink mini game is available
function MaidQuartersAllowMaidDrinks() {
	return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained());
}