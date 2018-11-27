var MaidQuartersBackground = "MaidQuarters";
var MaidQuartersMaid = null;

// Loads the maid quarters room
function MaidQuartersLoad() {

	// Creates two characters to begin with
	MaidQuartersMaid = CharacterLoadNPC("NPC_MaidQuarters_Maid");
	MaidQuartersMaid.AllowItem = false;

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