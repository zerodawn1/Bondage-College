"use strict";
var KidnapLeagueBackground = "KidnapLeague";
var KidnapLeagueTrainer = null;

// Returns TRUE if the dialog option are available
function KidnapLeagueAllowKidnap() { return (!Player.IsRestrained() && !KidnapLeagueTrainer.IsRestrained()); }

// Loads the kidnap league NPC
function KidnapLeagueLoad() {
	KidnapLeagueTrainer = CharacterLoadNPC("NPC_KidnapLeague_Trainer");
	KidnapLeagueTrainer.AllowItem = false;
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
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// When the player starts a kidnap game against the trainer
function KidnapLeagueStartKidnap(Difficulty) {
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
	CharacterRelease(Player);
	CharacterRelease(KidnapLeagueTrainer);
	if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);
	if ((InventoryGet(KidnapLeagueTrainer, "Cloth") == null) && (KidnapOpponentCloth != null)) InventoryWear(KidnapLeagueTrainer, KidnapOpponentCloth.Asset.Name, "Cloth", KidnapOpponentCloth.Color);
}