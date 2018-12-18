"use strict";
var KidnapLeagueBackground = "KidnapLeague";
var KidnapLeagueTrainer = null;

// Returns TRUE if the dialog option are available
function KidnapLeagueAllowKidnap() { return (!Player.IsRestrained() && !KidnapLeagueTrainer.IsRestrained()); }

// Loads the kidnap league NPC
function KidnapLeagueLoad() {
	KidnapLeagueTrainer = CharacterLoadNPC("NPC_KidnapLeague_Trainer");
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
	KidnapStart(KidnapLeagueTrainer, "KidnapLeagueDark", Difficulty);
}