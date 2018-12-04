var ShibariBackground = "ShibariDojo";
var ShibariTeacher = null;
var ShibariStudent = null;

// Loads the shibari dojo characters
function ShibariLoad() {
	if (ShibariTeacher == null) {
		ShibariTeacher = CharacterLoadNPC("NPC_Shibari_Teacher");
		CharacterWearItem(ShibariTeacher, "ChineseDress1", "Cloth");
		ShibariStudent = CharacterLoadNPC("NPC_Shibari_Student");
		CharacterNaked(ShibariStudent);
		InventoryAdd(ShibariTeacher, "HempRope", "ItemArms");
		InventoryAdd(ShibariTeacher, "HempRope", "ItemLegs");
		InventoryAdd(ShibariTeacher, "HempRope", "ItemFeet");
		InventoryAdd(ShibariTeacher, "SuspensionHempRope", "ItemFeet");
		InventoryAdd(ShibariTeacher, "HempRopeHarness", "ItemTorso");
		InventoryAdd(ShibariTeacher, "ClothCleaveGag", "ItemMouth");
		InventoryAdd(ShibariStudent, "HempRope", "ItemArms");
		InventoryAdd(ShibariStudent, "HempRope", "ItemLegs");
		InventoryAdd(ShibariStudent, "HempRope", "ItemFeet");
		InventoryAdd(ShibariStudent, "SuspensionHempRope", "ItemFeet");
		InventoryAdd(ShibariStudent, "HempRopeHarness", "ItemTorso");
		InventoryAdd(ShibariStudent, "ClothCleaveGag", "ItemMouth");
		CharacterWearItem(ShibariStudent, "HempRope", "ItemArms");
		CharacterWearItem(ShibariStudent, "HempRope", "ItemLegs");
		CharacterWearItem(ShibariStudent, "SuspensionHempRope", "ItemFeet");
		CharacterWearItem(ShibariStudent, "HempRopeHarness", "ItemTorso");
		CharacterWearItem(ShibariStudent, "ClothCleaveGag", "ItemMouth");
	}
}

// Run the shibari dojo, draw all 3 characters
function ShibariRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(ShibariTeacher, 750, 0, 1);
	DrawCharacter(ShibariStudent, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the shibari dojo
function ShibariClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShibariTeacher);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShibariStudent);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("MainHall");
}