// Returns TRUE if the dialog prerequisite condition is met
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else
		if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
			return window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite];
		else
			return !window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250)];
}

// Generic dialog function to leave conversation
function Dialog_Leave() {
	CurrentCharacter = null;
}

// Generic dialog function to remove a piece of the conversation that's already done
function Dialog_Remove() {

	// Finds the dialog spot and removes it
	var pos = 0;
	for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
			if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) {
				CurrentCharacter.Dialog.splice(D, 1);
				break;
			}
			pos++;
		}

}

// When the user clicks on a dialog option
function DialogClick() {

	// If the user clicked on the interaction character, we check to use an item 
	if (CurrentCharacter.AllowItem && (MouseX >= 500) && (MouseX <= 1000) && (MouseY >= 0) && (MouseY < 1000)) {
		Character[0].FocusGroup = null;
		CurrentCharacter.FocusGroup = null;
		for(var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
				for(var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if ((MouseX - 500 >= AssetGroup[A].Zone[Z][0]) && (MouseY >= AssetGroup[A].Zone[Z][1] - CurrentCharacter.HeightModifier) && (MouseX - 500 <= AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) && (MouseY <= AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - CurrentCharacter.HeightModifier))
						CurrentCharacter.FocusGroup = AssetGroup[A];
	}

	// In item menu mode VS text dialog mode
	if ((CurrentCharacter.FocusGroup != null) && (CurrentCharacter.AllowItem)) {

		// If the user cancels the menu
		if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 100)) {
			Character[0].FocusGroup = null;
			CurrentCharacter.FocusGroup = null;
		}
	
	} else {

		// If the user clicked on a text dialog option, we trigger it
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 975)) {
			var pos = 0;
			for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) {

						// A dialog option can change the conversation stage, show text or launch a custom function
						if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
						CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
						if (CurrentCharacter.Dialog[D].Function != null) DynamicFunction(CurrentCharacter.Dialog[D].Function);
						break;

					}
					pos++;
				}
		}
	
	}	

}

// Draw the item menu dialog
function DialogDrawItemMenu() {

	// Draws the top menu
	DrawText("Select an item to use", 1275, 62, "White", "Black");
	DrawButton(1475, 25, 225, 75, "Release", "White");	
	DrawButton(1750, 25, 225, 75, "Cancel", "White");
	
	var X = 1000;
	var Y = 125;
	
	// For each items in the player inventory
	for(var I = 0; I < Character[0].Inventory.length; I++)
		if ((Character[0].Inventory[I].Asset != null) && (Character[0].Inventory[I].Asset.Group.Name == CurrentCharacter.FocusGroup.Name) && (Character[0].Inventory[I].Asset.Group.Category == "Item")) {
			DrawRect(X, Y, 225, 225, "white");
			DrawText(Character[0].Inventory[I].Name, X + 112, Y + 200, "black");
			X = X + 250;
			if (X > 1700) {
				X = 1000;
				Y = Y + 250;
			}
		}

}

// Draw all the possible interactions 
function DialogDraw() {

	// Draw both the player and the interaction character
	DrawCharacter(Character[0], 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);
	
	// If we must show the item menu
	if ((CurrentCharacter.FocusGroup != null) && (CurrentCharacter.AllowItem)) DialogDrawItemMenu();
	else {

		// Find the character intro text if we need too
		if ((CurrentCharacter.CurrentDialog == null) || (CurrentCharacter.CurrentDialog == ""))
			for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D)) {
					CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result
					break;
				}

		// Draws the intro text or dialog result
		DrawTextWrap(CurrentCharacter.CurrentDialog, 1025, -10, 950, 160, "white");
		
		// Draws the possible answers
		var pos = 0;
		for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					DrawTextWrap(CurrentCharacter.Dialog[D].Option, 1025, 160 + 105 * pos, 950, 80, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) ? "cyan" : "white");
					pos++;
				}

	}

}
