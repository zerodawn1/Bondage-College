var CheatBackground = "Sheet";
var CheatAllow = false;
var CheatList = ["DoubleReputation", "DoubleSkill", "DoubleMoney", "DoubleItemSpeed"];
var CheatActivated = ["DoubleReputation", "DoubleSkill", "DoubleMoney", "DoubleItemSpeed"];

// Returns TRUE if the cheat is currently active
function CheatActive(CheatName) {
	return (CheatAllow && (CheatActivated.indexOf(CheatName) >= 0));
}

// Run the character info screen
function CheatRun() {

	// List all the cheats
	MainCanvas.textAlign = "left";
	for(var C = 0; C < CheatList.length; C++) {
		DrawButton(150, 150 + (C * 100), 64, 64, "", "White", CheatActive(CheatList[C]) ? "Icons/Checked.png" : "");
		DrawText(TextGet(CheatList[C]), 250, 182 + (C * 100), "Black", "Gray");		
	}

	// Draw the exit button
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

// When the user clicks on the character info screen
function CheatClick() {
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) CommonSetScreen("Character", "Login");
}