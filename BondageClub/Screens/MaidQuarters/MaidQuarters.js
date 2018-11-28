var MaidQuartersBackground = "MaidQuarters";
var MaidQuartersMaid = null;
var MaidQuartersPreviousClothName = null;
var MaidQuartersPreviousClothColor = "";
var MaidQuartersPreviousHatName = null;
var MaidQuartersPreviousHatColor = "";
var MaidQuartersPlayerInMaidUniform = false;
var MaidQuartersMaidReleasedPlayer = false;

// Loads the maid quarters room
function MaidQuartersLoad() {

	// Creates the maid that gives work
	MaidQuartersMaid = CharacterLoadNPC("NPC_MaidQuarters_Maid");
	MaidQuartersMaid.AllowItem = false;
	MaidQuartersPlayerInMaidUniform = ((CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidOutfit1") && (CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1"));

}

// Run the maid quarters, draw both characters
function MaidQuartersRun() {
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
	if (!MaidQuartersMaidReleasedPlayer) {
		ReputationProgress("Dominant", -1);
		MaidQuartersMaidReleasedPlayer = true;
	}
	CharacterRemove(Player, "ItemMouth");
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
	Player.Money = parseInt(Player.Money) + parseInt(M);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	AccountSync();
}

// When the maid releases the player
function MaidQuartersMaidReleasePlayer() {
	if (!MaidQuartersMaidReleasedPlayer) {
		ReputationProgress("Dominant", -1);
		MaidQuartersMaidReleasedPlayer = true;
	}
	CharacterRelease(Player);
}