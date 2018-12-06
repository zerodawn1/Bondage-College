var InformationSheetBackground = "Sheet";
var InformationSheetSelection = null;
var InformationSheetPreviousModule = "";
var InformationSheetPreviousScreen = "";

// Run the character info screen
function InformationSheetRun() {

	// Draw the character base values
	var C = InformationSheetSelection;
	DrawCharacter(C, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Name") + " " + C.Name, 550, 125, "Black", "Gray");
	DrawText(TextGet("Title") + " " + TextGet("TitleNone"), 550, 200, "Black", "Gray");
	DrawText(TextGet("Owner") + " " + (((C.Owner == null) || (C.Owner == "")) ? TextGet("OwnerNone") : C.Owner.replace("NPC-", "")), 550, 275, "Black", "Gray");
	DrawText(TextGet("Lover") + " " + (((C.Lover == null) || (C.Lover == "")) ? TextGet("LoverNone") : C.Lover.replace("NPC-", "")), 550, 350, "Black", "Gray");
	DrawText(TextGet("Money") + " " + ((C.ID == 0) ? C.Money.toString() + " $" : "?"), 550, 425, "Black", "Gray");

	// Draw the reputation section
	DrawText(TextGet("Reputation"), 1000, 125, "Black", "Gray");
	var pos = 0;
	for(var R = 0; R < C.Reputation.length; R++)
		if (C.Reputation[R].Value != 0) {
			DrawText(TextGet("Reputation" + C.Reputation[R].Type + ((C.Reputation[R].Value > 0) ? "Positive" : "Negative")) + " " + Math.abs(C.Reputation[R].Value).toString(), 1000, 200 + pos * 75, "Black", "Gray");
			pos++;
		}
	if (pos == 0) DrawText(TextGet("ReputationNone"), 1000, 200, "Black", "Gray");

	// Draw the skils section
	DrawText(TextGet("Skill"), 1450, 125, "Black", "Gray");
	DrawText(TextGet("SkillNone"), 1450, 200, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

// When the user clicks on the character info screen
function InformationSheetClick() {
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) CommonSetScreen(InformationSheetPreviousModule, InformationSheetPreviousScreen);
}

// Loads the information sheet for a character
function InformationSheetLoadCharacter(C) {
	InformationSheetSelection = C;
	InformationSheetPreviousModule = CurrentModule;
	InformationSheetPreviousScreen = CurrentScreen;
	CommonSetScreen("Character", "InformationSheet");
}