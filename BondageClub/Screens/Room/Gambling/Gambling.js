"use strict";

var GamblingBackground = "Gambling";
var GamblingSub = null;

var PlayerDice = null;
var GamblingSubDice = null;
var PlayerDiceStack = [];
var GamblingSubDiceStack = [];
var PlayerTwentyOneLevel = 0;
var GamblingSubTwentyOneLevel = 0;

var PlayerPreviousHat = null;
var PlayerPreviousShoes = null;
var PlayerPreviousGloves = null;
var PlayerPreviousCloth = null;
var PlayerPreviousBra = null;
var PlayerPreviousPanties = null;
var PlayerPreviousSocks = null;
var GamblingSubPreviousHat = null;
var GamblingSubPreviousShoes = null;
var GamblingSubPreviousGloves = null;
var GamblingSubPreviousCloth = null;
var GamblingSubPreviousBra = null;
var GamblingSubPreviousPanties = null;
var GamblingSubPreviousSocks = null;

// Returns TRUE if a dialog is permitted
function ShopIsGamblingSubRestrained() { return (GamblingSub.IsRestrained() || !GamblingSub.CanTalk()) }
function GamblingCanPlay() {return (!Player.IsRestrained() && !GamblingSub.IsRestrained());}

// Loads the Gambling Hall
function GamblingLoad() {
		// Default load
	if (GamblingSub == null) {
		GamblingSub = CharacterLoadNPC("NPC_Gambling_Sub");
		GamblingSub.AllowItem = false;
	}
	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "ShibariDojo") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		CharacterNaked(GamblingSub);
		InventoryWearRandom(GamblingSub, "ItemLegs"); 
		InventoryWearRandom(GamblingSub, "ItemFeet"); 
		InventoryWearRandom(GamblingSub, "ItemArms"); 
		InventoryWearRandom(GamblingSub, "ItemMouth"); 
		InventoryWear(GamblingSub, "LeatherBlindfold", "ItemHead");
		GamblingSub.AllowItem = true;
	}

}

// Run the Gambling Hall, draw both characters
function GamblingRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(GamblingSub, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
}

// When the user clicks in the Gambling Hall
function GamblingClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(GamblingSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) CommonSetScreen("Character", "Appearance");
}

// Controller for the Simple Dice Game
function GamblingSimpleDiceController(SimpleDiceState) {
	if (SimpleDiceState == "new"){
		PlayerDiceStack = [];
		GamblingSubDiceStack = [];
		PlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
		PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		GamblingSubDice = Math.floor(Math.random() * (6 - 1)) + 1;
		GamblingSubDiceStack[GamblingSubDiceStack.length] = GamblingSubDice;
		if (PlayerDice > GamblingSubDice) {
			GamblingSub.AllowItem = true;
			GamblingSub.Stage = 81;
			}
		if (PlayerDice < GamblingSubDice) {
			GamblingSub.AllowItem = false;
			GamblingSub.Stage = 82;
			}
		if (PlayerDice == GamblingSubDice) { 
			GamblingSub.AllowItem = false;
			GamblingSub.Stage = 83;
			}
	} else if (SimpleDiceState == "win"){
			GamblingSub.Stage = 0;
	} else if (SimpleDiceState == "lost"){
			InventoryWearRandom(Player, "ItemArms");
			InventoryWearRandom(Player, "ItemLegs");
			InventoryWearRandom(Player, "ItemFeet");
			GamblingSub.Stage = 0;
	} else if (SimpleDiceState == "equal"){
			InventoryRemove(Player, "ItemArms");
			InventoryRemove(Player, "ItemLegs");
			InventoryRemove(Player, "ItemFeet");
			InventoryRemove(GamblingSub, "ItemArms");
			InventoryRemove(GamblingSub, "ItemLegs");
			InventoryRemove(GamblingSub, "ItemFeet");
			GamblingSub.Stage = 0;
	}
}

//Controller for fifteen and six
function GamblingTwentyOneController(TwentyOneState) {
	
	if (TwentyOneState == "new"){
		// Start a New Game
		PlayerTwentyOneLevel = 0;
		GamblingSubTwentyOneLevel = 0;
		PlayerDiceStack = [];
		GamblingSubDiceStack = [];
		GamblingReleasePlayer();
		GamblingSubDressBack();

		for (var i = 1; i <= 3; i++) {
			PlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		}
		GamblingSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack);
	
	} else if (TwentyOneState == "add"){
		//Get on more Dice
		PlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
		PlayerDiceStack[PlayerDiceStack.length] = PlayerDice; 
		GamblingSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack);
		if (GamblingDiceStackSum(PlayerDiceStack) > 21) {
			PlayerTwentyOneLevel = PlayerTwentyOneLevel +1;
			GamblingSub.Stage = 170 + PlayerTwentyOneLevel;
		}
	
	} else if (TwentyOneState == "fin") {
		//The Player is fin in this turn
		//The GamblingSub dices as she win or over 21
		while (GamblingDiceStackSum(GamblingSubDiceStack) <= GamblingDiceStackSum(PlayerDiceStack) && GamblingDiceStackSum(GamblingSubDiceStack) < 22) {
			GamblingSubDice = Math.floor(Math.random() * (6 - 1)) + 1;
			GamblingSubDiceStack[GamblingSubDiceStack.length] = GamblingSubDice; 
		}
		if (GamblingDiceStackSum(GamblingSubDiceStack) > GamblingDiceStackSum(PlayerDiceStack) && GamblingDiceStackSum(GamblingSubDiceStack) < 22){
			PlayerTwentyOneLevel = PlayerTwentyOneLevel +1;
			GamblingSub.Stage = 170 + PlayerTwentyOneLevel;
		} else {
			GamblingSubTwentyOneLevel = GamblingSubTwentyOneLevel +1;
			GamblingSub.Stage = 160 + GamblingSubTwentyOneLevel;
		}
	
	} else if (TwentyOneState == "win_next"){
		//The winner Player stiped the loser
		//the next turn started automaticly
		if (GamblingSubTwentyOneLevel == 1) {
			GamblingSubPreviousHat = InventoryGet(GamblingSub, "Hat");
			GamblingSubPreviousShoes = InventoryGet(GamblingSub, "Shoes");
			GamblingSubPreviousGloves = InventoryGet(GamblingSub, "Gloves");
			InventoryRemove(GamblingSub, "Hat"); 
			InventoryRemove(GamblingSub, "Shoes"); 
			InventoryRemove(GamblingSub, "Gloves"); 
			}
		else if (GamblingSubTwentyOneLevel == 2) {
			GamblingSubPreviousCloth = InventoryGet(GamblingSub, "Cloth");
			InventoryRemove(GamblingSub, "Cloth"); 
			}
		else if (GamblingSubTwentyOneLevel == 3) {
			GamblingSubPreviousBra = InventoryGet(GamblingSub, "Bra");
			GamblingSubPreviousPanties = InventoryGet(GamblingSub, "Panties");
			GamblingSubPreviousSocks = InventoryGet(GamblingSub, "Socks");
			InventoryRemove(GamblingSub, "Bra"); 
			InventoryRemove(GamblingSub, "Panties"); 
			InventoryRemove(GamblingSub, "Socks"); 
			}
		else if (GamblingSubTwentyOneLevel == 4) {
			InventoryWearRandom(GamblingSub, "ItemLegs"); 
			InventoryWearRandom(GamblingSub, "ItemFeet"); 
			}
		else if (GamblingSubTwentyOneLevel == 5) {
			InventoryWearRandom(GamblingSub, "ItemArms"); 
			}		
		else if (GamblingSubTwentyOneLevel == 6) {
			InventoryWearRandom(GamblingSub, "ItemMouth"); 
			GamblingReleasePlayer();
			GamblingSub.AllowItem = true;
			GamblingSub.Stage = 0; 
			}		
		
		PlayerDiceStack = [];
		GamblingSubDiceStack = [];
		for (var i = 1; i <= 3; i++) {
			PlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		}
		if (GamblingSub.Stage != 0) {GamblingSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack); }
	
	} else if (TwentyOneState == "lost_next"){
		//the loser Player ist stipped by winner
		//the next turn started automaticly
		if (PlayerTwentyOneLevel == 1) {
			PlayerPreviousHat = InventoryGet(Player, "Hat");
			PlayerPreviousShoes = InventoryGet(Player, "Shoes");
			PlayerPreviousGloves = InventoryGet(Player, "Gloves");
			InventoryRemove(Player, "Hat"); 
			InventoryRemove(Player, "Shoes"); 
			InventoryRemove(Player, "Gloves"); 
			}
		else if (PlayerTwentyOneLevel == 2) {
			PlayerPreviousCloth = InventoryGet(Player, "Cloth");
			InventoryRemove(Player, "Cloth"); 
			}
		else if (PlayerTwentyOneLevel == 3) {
			PlayerPreviousBra = InventoryGet(Player, "Bra");
			PlayerPreviousPanties = InventoryGet(Player, "Panties");
			PlayerPreviousSocks = InventoryGet(Player, "Socks");
			InventoryRemove(Player, "Bra"); 
			InventoryRemove(Player, "Panties"); 
			InventoryRemove(Player, "Socks"); 
			}
		else if (PlayerTwentyOneLevel == 4) {
			InventoryWearRandom(Player, "ItemLegs"); 
			InventoryWearRandom(Player, "ItemFeet"); 
			}
		else if (PlayerTwentyOneLevel == 5) {
			InventoryWearRandom(Player, "ItemArms"); 
			}
		else if (PlayerTwentyOneLevel == 6) {
			InventoryWearRandom(Player, "ItemMouth"); 
			InventoryRemove(GamblingSub, "ItemArms"); 
			InventoryRemove(GamblingSub, "ItemFeet"); 
			InventoryRemove(GamblingSub, "ItemLegs"); 
			GamblingSubDressBack();
			GamblingSub.Stage = 0; 
			}

		PlayerDiceStack = [];
		GamblingSubDiceStack = [];
		for (var i = 1; i <= 3; i++) {
			PlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		}
		if (GamblingSub.Stage != 0) {GamblingSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack); }
	}
}

// Print the Stock of Dices and the Sum of Ponits
function GamblingShowDiceStack(){
	for (var i = 0; i < PlayerDiceStack.length ; i++) {
		DrawImageResize("Screens/Room/Gambling/dice_" + PlayerDiceStack[i] + ".png", 25, (25 + i * 60), 60, 60);
		}
	DrawText(GamblingDiceStackSum(PlayerDiceStack), 125, 55, "white", "black");
	for (var i = 0; i < GamblingSubDiceStack.length ; i++) {
		DrawImageResize("Screens/Room/Gambling/dice_" + GamblingSubDiceStack[i] + ".png", 525, (25 + i * 60), 60, 60);
		}
	DrawText(GamblingDiceStackSum(GamblingSubDiceStack), 625, 55, "white", "black");
	return true;
}

//Calculate the Summ of Points in the Stock of Dices
function GamblingDiceStackSum(DiceStack){
	var GamblingDiceStackSum = 0;
	for (var i = 0; i < DiceStack.length ; i++) {
		GamblingDiceStackSum = GamblingDiceStackSum + DiceStack[i];
	}
	return GamblingDiceStackSum;
}

// The GamblingSub blindfold the Player
function GamblingAnnoyGamblingSub(){
	InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	CharacterSetCurrent(Player);
}

//Release Player and give Cloths back
function GamblingReleasePlayer() {
	CharacterRelease(Player);
	if (PlayerPreviousSocks != null) InventoryWear(Player, PlayerPreviousSocks.Asset.Name, "Socks", PlayerPreviousSocks.Color);
	if (PlayerPreviousPanties != null) InventoryWear(Player, PlayerPreviousPanties.Asset.Name, "Panties", PlayerPreviousPanties.Color);
	if (PlayerPreviousBra != null) InventoryWear(Player, PlayerPreviousBra.Asset.Name, "Bra", PlayerPreviousBra.Color);
	if (PlayerPreviousCloth != null) InventoryWear(Player, PlayerPreviousCloth.Asset.Name, "Cloth", PlayerPreviousCloth.Color);
	if (PlayerPreviousGloves != null) InventoryWear(Player, PlayerPreviousGloves.Asset.Name, "Gloves", PlayerPreviousGloves.Color);
	if (PlayerPreviousShoes != null) InventoryWear(Player, PlayerPreviousShoes.Asset.Name, "Shoes", PlayerPreviousShoes.Color);
	if (PlayerPreviousHat != null) InventoryWear(Player, PlayerPreviousHat.Asset.Name, "Hat", PlayerPreviousHat.Color);
	ReputationProgress("Dominant", -1);
}

//Dress GamblingSub back
function GamblingSubDressBack() {
			if (GamblingSubPreviousSocks != null) InventoryWear(GamblingSub, GamblingSubPreviousSocks.Asset.Name, "Socks", GamblingSubPreviousSocks.Color);
			if (GamblingSubPreviousPanties != null) InventoryWear(GamblingSub, GamblingSubPreviousPanties.Asset.Name, "Panties", GamblingSubPreviousPanties.Color);
			if (GamblingSubPreviousBra != null) InventoryWear(GamblingSub, GamblingSubPreviousBra.Asset.Name, "Bra", GamblingSubPreviousBra.Color);
			if (GamblingSubPreviousCloth != null) InventoryWear(GamblingSub, GamblingSubPreviousCloth.Asset.Name, "Cloth", GamblingSubPreviousCloth.Color);
			if (GamblingSubPreviousGloves != null) InventoryWear(GamblingSub, GamblingSubPreviousGloves.Asset.Name, "Gloves", GamblingSubPreviousGloves.Color);
			if (GamblingSubPreviousShoes != null) InventoryWear(GamblingSub, GamblingSubPreviousShoes.Asset.Name, "Shoes", GamblingSubPreviousShoes.Color);
			if (GamblingSubPreviousHat != null) InventoryWear(GamblingSub, GamblingSubPreviousHat.Asset.Name, "Hat", GamblingSubPreviousHat.Color);
}

// When the player rescues the shop vendor
function GamblingCompleteRescue() {
	GamblingSub.AllowItem = false;
	CharacterRelease(GamblingSub);
	MaidQuartersCurrentRescueCompleted = true;
}