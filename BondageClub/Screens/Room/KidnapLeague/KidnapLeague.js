"use strict";
var KidnapLeagueBackground = "KidnapLeague";
var KidnapLeagueTrainer = null;
var KidnapLeagueRandomKidnapper = null;
var KidnapLeagueRandomKidnapperScenario = 0;
var KidnapLeagueRandomKidnapperDifficulty = 0;
var KidnapLeagueRandomKidnapperTimer = 0;

// Returns TRUE if the dialog option are available
function KidnapLeagueAllowKidnap() { return (!Player.IsRestrained() && !KidnapLeagueTrainer.IsRestrained()); }
function KidnapLeagueIsTrainerRestrained() { return KidnapLeagueTrainer.IsRestrained(); }

// Loads the kidnap league NPC
function KidnapLeagueLoad() {
	KidnapLeagueBackground = "KidnapLeague";
	KidnapLeagueTrainer = CharacterLoadNPC("NPC_KidnapLeague_Trainer");
	KidnapLeagueTrainer.AllowItem = ((KidnapLeagueTrainer.Stage == "100") || (KidnapLeagueTrainer.Stage == "110"));
}

// Run the kidnap league
function KidnapLeagueRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(KidnapLeagueTrainer, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the kidnap league room
function KidnapLeagueClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(KidnapLeagueTrainer);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);
		CommonSetScreen("Room", "MainHall");
	}
}

// When the player gets in a random kidnap match
function KidnapLeagueRandomKidnap() {
	KidnapLeagueBackground = "MainHall";
	KidnapLeagueRandomKidnapper = null;
	CharacterDelete("NPC_KidnapLeague_RandomKidnapper");
	KidnapLeagueRandomKidnapper = CharacterLoadNPC("NPC_KidnapLeague_RandomKidnapper");
	CharacterSetCurrent(KidnapLeagueRandomKidnapper);
	KidnapLeagueRandomKidnapperScenario = 0
	if (Player.CanInteract()) {
		KidnapLeagueRandomKidnapper.Stage = KidnapLeagueRandomKidnapperScenario.toString();
		KidnapLeagueRandomKidnapper.CurrentDialog = TextGet("RandomKidnapIntro" + KidnapLeagueRandomKidnapperScenario.toString());
	} else {
		KidnapLeagueRandomKidnapper.Stage = "200";
		KidnapLeagueRandomKidnapper.CurrentDialog = TextGet("RandomKidnapAutomatic" + KidnapLeagueRandomKidnapperScenario.toString());
	}
}

// When a random kidnap match ends
function KidnapLeagueEndRandomKidnap(Surrender) {
	KidnapLeagueRandomKidnapper.AllowItem = KidnapVictory;
	KidnapLeagueRandomKidnapper.Stage = (KidnapVictory) ? "100" : "200";
	if (!KidnapVictory) CharacterRelease(KidnapLeagueRandomKidnapper);
	CommonSetScreen("Room", "MainHall");
	CharacterSetCurrent(KidnapLeagueRandomKidnapper);
	if ((Surrender != null) && (Surrender == true)) {
		InventoryWearRandom(Player, "ItemArms");
		KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "KidnapSurrender" + KidnapLeagueRandomKidnapperScenario.toString());
	} else KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, ((KidnapVictory) ? "KidnapVictory" : "KidnapDefeat") + KidnapLeagueRandomKidnapperScenario.toString());
}

// When the player starts a kidnap game against the trainer (an easy fight will lower the player dominant reputation)
function KidnapLeagueStartKidnap(Difficulty) {
	if (Difficulty < 0) ReputationProgress("Dominant", -2);
	KidnapStart(KidnapLeagueTrainer, "KidnapLeagueDark", Difficulty, "KidnapLeagueEndKidnap()");
}

// When the kidnap match ends
function KidnapLeagueEndKidnap() {
	KidnapLeagueTrainer.AllowItem = KidnapVictory;
	KidnapLeagueTrainer.Stage = (KidnapVictory) ? "100" : "200";
	if (!KidnapVictory) CharacterRelease(KidnapLeagueTrainer);
	CommonSetScreen("Room", "KidnapLeague");
	CharacterSetCurrent(KidnapLeagueTrainer);
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, (KidnapVictory) ? "KidnapVictory" : "KidnapDefeat");
}

// Resets the player and teacher for another kidnapping
function KidnapLeagueResetTrainer() {
	KidnapLeagueTrainer.AllowItem = false;
	CharacterRelease(Player);
	CharacterRelease(KidnapLeagueTrainer);
	if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);
	if ((InventoryGet(KidnapLeagueTrainer, "Cloth") == null) && (KidnapOpponentCloth != null)) InventoryWear(KidnapLeagueTrainer, KidnapOpponentCloth.Asset.Name, "Cloth", KidnapOpponentCloth.Color);
}