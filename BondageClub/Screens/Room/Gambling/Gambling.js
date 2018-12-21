var GamblingBackground = "Gambling";
var GamblingPlayer = null;
var PlayerDice = null;
var GamblingPlayerDice = null;
var GameResultState = null;
var PlayerTwentyOneLevel = 0;
var GamblingPlayerTwentyOneLevel = 0;
var PlayerTwentyOnePoints = 0;
var GamblingTwentyOnePoints = 0;
var PlayerPreviousHat = null;
var PlayerPreviousShoes = null;
var PlayerPreviousGloves = null;
var PlayerPreviousCloth = null;
var PlayerPreviousBra = null;
var PlayerPreviousPanties = null;
var PlayerPreviousSocks = null;
var GamblingPlayerPreviousHat = null;
var GamblingPlayerPreviousShoes = null;
var GamblingPlayerPreviousGloves = null;
var GamblingPlayerPreviousCloth = null;
var GamblingPlayerPreviousBra = null;
var GamblingPlayerPreviousPanties = null;
var GamblingPlayerPreviousSocks = null;

/* 
1 Cloth
2 Underware
3 Feet + Legs
4 Mounth + Arms
*/

function GamblingCanPlay() {return (!Player.IsRestrained() && !GamblingPlayer.IsRestrained());}

// Loads the Gambling Hall
function GamblingLoad() {
	GamblingPlayer = CharacterLoadNPC("NPC_Gambling_Sub");
}

// Run the Gambling Hall, draw both characters
function GamblingRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(GamblingPlayer, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");

}

// When the user clicks in the Gambling Hall
function GamblingClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(GamblingPlayer);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) CommonSetScreen("Character", "Appearance");
}

// Controller for the Simple Dice Game
function GamblingSimpleDiceController(SimpleDiceState) {
	if (SimpleDiceState == "new"){
		PlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
		GamblingPlayerDice = Math.floor(Math.random() * (6 - 1)) + 1;
		CurrentCharacter.Stage = "" + PlayerDice + GamblingPlayerDice;
	} else if (SimpleDiceState == "result"){
		if (PlayerDice > GamblingPlayerDice) {
			GamblingPlayer.AllowItem = true;
			CurrentCharacter.Stage = 81;
			}
		if (PlayerDice < GamblingPlayerDice) {
			GamblingPlayer.AllowItem = false;
			CurrentCharacter.Stage = 82;
			}
		if (PlayerDice == GamblingPlayerDice) { 
			GamblingPlayer.AllowItem = false;
			CurrentCharacter.Stage = 83;
			}
	} else if (SimpleDiceState == "win"){
			CurrentCharacter.Stage = 0;
	} else if (SimpleDiceState == "lost"){
			InventoryWearRandom(Player, "ItemArms");
			InventoryWearRandom(Player, "ItemLegs");
			InventoryWearRandom(Player, "ItemFeet");
			CurrentCharacter.Stage = 0;
	} else if (SimpleDiceState == "equal"){
			InventoryRemove(Player, "ItemArms");
			InventoryRemove(Player, "ItemLegs");
			InventoryRemove(Player, "ItemFeet");
			InventoryRemove(GamblingPlayer, "ItemArms");
			InventoryRemove(GamblingPlayer, "ItemLegs");
			InventoryRemove(GamblingPlayer, "ItemFeet");
			CurrentCharacter.Stage = 0;
	}
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

//Controller for fifteen and six
function GamblingTwentyOneController(TwentyOneState) {
	
	if (TwentyOneState == "new"){
		// Start a New Game
		PlayerTwentyOneLevel = 0;
		GamblingPlayerTwentyOneLevel = 0;
		PlayerTwentyOnePoints = Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + 3;
		CurrentCharacter.Stage = 100 + PlayerTwentyOnePoints;
	
	} else if (TwentyOneState == "add"){
		//Get on more Dice
		PlayerTwentyOnePoints = PlayerTwentyOnePoints + Math.floor(Math.random() * (6 - 1)) + 1;
		CurrentCharacter.Stage = 100 + PlayerTwentyOnePoints;
	
	} else if (TwentyOneState == "fin") {
		//The Player is fin in this turn
		//The GamblingPlayer dices as she win or over 21
		GamblingTwentyOnePoints = Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + 3;
		while (GamblingTwentyOnePoints <= PlayerTwentyOnePoints && GamblingTwentyOnePoints < 22) {
			GamblingTwentyOnePoints = GamblingTwentyOnePoints + Math.floor(Math.random() * (6 - 1)) + 1;
		}
		CurrentCharacter.Stage = 130 + GamblingTwentyOnePoints;
	
	} else if (TwentyOneState == "lost") {
		//The Player lost the Turn
		PlayerTwentyOneLevel = PlayerTwentyOneLevel +1;
		CurrentCharacter.Stage = 170 + PlayerTwentyOneLevel;
	
	} else if (TwentyOneState == "win") {
		//The Player win the Turn
		GamblingPlayerTwentyOneLevel = GamblingPlayerTwentyOneLevel +1;
		CurrentCharacter.Stage = 160 + GamblingPlayerTwentyOneLevel;
	
	} else if (TwentyOneState == "win_next"){
		//The winner Player stiped the loser
		//the next turn started automaticly
		if (GamblingPlayerTwentyOneLevel == 1) {
			GamblingPlayerPreviousHat = InventoryGet(GamblingPlayer, "Hat");
			GamblingPlayerPreviousShoes = InventoryGet(GamblingPlayer, "Shoes");
			GamblingPlayerPreviousGloves = InventoryGet(GamblingPlayer, "Gloves");
			InventoryRemove(GamblingPlayer, "Hat"); 
			InventoryRemove(GamblingPlayer, "Shoes"); 
			InventoryRemove(GamblingPlayer, "Gloves"); 
			}
		if (GamblingPlayerTwentyOneLevel == 2) {
			GamblingPlayerPreviousCloth = InventoryGet(GamblingPlayer, "Cloth");
			InventoryRemove(GamblingPlayer, "Cloth"); 
			}
		else if (GamblingPlayerTwentyOneLevel == 3) {
			GamblingPlayerPreviousBra = InventoryGet(GamblingPlayer, "Bra");
			GamblingPlayerPreviousPanties = InventoryGet(GamblingPlayer, "Panties");
			GamblingPlayerPreviousSocks = InventoryGet(GamblingPlayer, "Socks");
			InventoryRemove(GamblingPlayer, "Bra"); 
			InventoryRemove(GamblingPlayer, "Panties"); 
			InventoryRemove(GamblingPlayer, "Socks"); 
			}
		else if (GamblingPlayerTwentyOneLevel == 4) {
			InventoryWearRandom(GamblingPlayer, "ItemLegs"); 
			InventoryWearRandom(GamblingPlayer, "ItemFeet"); 
			}
		else if (GamblingPlayerTwentyOneLevel == 5) {
			InventoryWearRandom(GamblingPlayer, "ItemArms"); 
			}		
		else if (GamblingPlayerTwentyOneLevel == 6) {
			InventoryWearRandom(GamblingPlayer, "ItemMouth"); 
			InventoryRemove(Player, "ItemArms"); 
			InventoryRemove(Player, "ItemFeet"); 
			InventoryRemove(Player, "ItemLegs"); 
			if (PlayerPreviousSocks != null) InventoryWear(Player, PlayerPreviousSocks.Asset.Name, "Socks", PlayerPreviousSocks.Color);
			if (PlayerPreviousPanties != null) InventoryWear(Player, PlayerPreviousPanties.Asset.Name, "Panties", PlayerPreviousPanties.Color);
			if (PlayerPreviousBra != null) InventoryWear(Player, PlayerPreviousBra.Asset.Name, "Bra", PlayerPreviousBra.Color);
			if (PlayerPreviousCloth != null) InventoryWear(Player, PlayerPreviousCloth.Asset.Name, "Cloth", PlayerPreviousCloth.Color);
			if (PlayerPreviousGloves != null) InventoryWear(Player, PlayerPreviousGloves.Asset.Name, "Gloves", PlayerPreviousGloves.Color);
			if (PlayerPreviousShoes != null) InventoryWear(Player, PlayerPreviousShoes.Asset.Name, "Shoes", PlayerPreviousShoes.Color);
			if (PlayerPreviousHat != null) InventoryWear(Player, PlayerPreviousHat.Asset.Name, "Hat", PlayerPreviousHat.Color);
			GamblingPlayer.AllowItem = true;
			CurrentCharacter.Stage = 0; 
			}		
		PlayerTwentyOnePoints = Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + 3;
		if (CurrentCharacter.Stage != 0) {CurrentCharacter.Stage = 100 + PlayerTwentyOnePoints; }
	
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
			InventoryRemove(GamblingPlayer, "ItemArms"); 
			InventoryRemove(GamblingPlayer, "ItemFeet"); 
			InventoryRemove(GamblingPlayer, "ItemLegs"); 
			if (GamblingPlayerPreviousSocks != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousSocks.Asset.Name, "Socks", GamblingPlayerPreviousSocks.Color);
			if (GamblingPlayerPreviousPanties != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousPanties.Asset.Name, "Panties", GamblingPlayerPreviousPanties.Color);
			if (GamblingPlayerPreviousBra != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousBra.Asset.Name, "Bra", GamblingPlayerPreviousBra.Color);
			if (GamblingPlayerPreviousCloth != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousCloth.Asset.Name, "Cloth", GamblingPlayerPreviousCloth.Color);
			if (GamblingPlayerPreviousGloves != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousGloves.Asset.Name, "Gloves", GamblingPlayerPreviousGloves.Color);
			if (GamblingPlayerPreviousShoes != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousShoes.Asset.Name, "Shoes", GamblingPlayerPreviousShoes.Color);
			if (GamblingPlayerPreviousHat != null) InventoryWear(GamblingPlayer, GamblingPlayerPreviousHat.Asset.Name, "Hat", GamblingPlayerPreviousHat.Color);
			CurrentCharacter.Stage = 0; 
			}
		PlayerTwentyOnePoints = Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + Math.floor(Math.random() * (6 - 1)) + 3;
		if (CurrentCharacter.Stage != 0) {CurrentCharacter.Stage = 100 + PlayerTwentyOnePoints; }
	}
}
