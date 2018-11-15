// Returns TRUE if the dialog prerequisite condition is met
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else
		if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
			return eval(CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite);
		else
			return !eval(CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250));
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

// Leaves the item menu for both characters
function DialogLeaveItemMenu() {
	Character[0].FocusGroup = null;
	CurrentCharacter.FocusGroup = null;	
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
		if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 25) && (MouseY <= 100)) {
			CharacterAppearanceSetItem(CurrentCharacter, CurrentCharacter.FocusGroup.Name, null);
			DialogLeaveItemMenu();
		}
	
		// If the user cancels the menu
		if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 100))
			DialogLeaveItemMenu();

		// If the user clicks on one of the items
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 850)) {
			
			// For each items in the player inventory
			var X = 1000;
			var Y = 125;
			for(var I = 0; I < Character[0].Inventory.length; I++)
				if ((Character[0].Inventory[I].Asset != null) && (Character[0].Inventory[I].Asset.Group.Name == CurrentCharacter.FocusGroup.Name) && (Character[0].Inventory[I].Asset.Group.Category == "Item")) {
					
					// If the item at position is clicked
					if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
						CharacterAppearanceSetItem(CurrentCharacter, Character[0].Inventory[I].Asset.Group.Name, Character[0].Inventory[I].Asset);
						DialogLeaveItemMenu();
						break;
					}

					// Change the X and Y position to get the next square
					X = X + 250;
					if (X > 1800) {
						X = 1000;
						Y = Y + 300;
					}

				}

		}		

	} else {

		// If the user clicked on a text dialog option, we trigger it
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 975)) {
			var pos = 0;
			for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) {

						// A dialog option can change the conversation stage, show text or launch a custom function
						CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
						if ((CurrentCharacter.Effect.indexOf("GagLight") < 0) && (CurrentCharacter.Effect.indexOf("GagNormal") < 0) && (CurrentCharacter.Effect.indexOf("GagHeavy") < 0) && (CurrentCharacter.Effect.indexOf("GagTotal") < 0)) {
							if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
							if (CurrentCharacter.Dialog[D].Function != null) DynamicFunction(CurrentCharacter.Dialog[D].Function);
						} else 
							if ((CurrentCharacter.Dialog[D].Function != null) && (CurrentCharacter.Dialog[D].Function.trim() == "Dialog_Leave()"))
								Dialog_Leave();
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
	DrawText("Select an item to use", 1250, 62, "White", "Black");
	DrawButton(1500, 25, 225, 75, "Release", "White");	
	DrawButton(1750, 25, 225, 75, "Cancel", "White");
		
	// For each items in the player inventory
	var X = 1000;
	var Y = 125;
	for(var I = 0; I < Character[0].Inventory.length; I++)
		if ((Character[0].Inventory[I].Asset != null) && (Character[0].Inventory[I].Asset.Group.Name == CurrentCharacter.FocusGroup.Name) && (Character[0].Inventory[I].Asset.Group.Category == "Item")) {			
			DrawRect(X, Y, 225, 275, ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) ? "cyan" : "white");
			DrawImageResize("Assets/" + Character[0].Inventory[I].Asset.Group.Family + "/" + Character[0].Inventory[I].Asset.Group.Name + "/" + Character[0].Inventory[I].Name + ".png", X, Y, 225, 225);
			DrawText(Character[0].Inventory[I].Name, X + 112, Y + 250, "black");
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

}

// Garbles the speech if the character is gagged
function DialogGag(C, CD) {
	
	if (C.Effect.indexOf("GagTotal") >= 0)
		return "..."
	else
		if ((C.Effect.indexOf("GagLight") >= 0) || (C.Effect.indexOf("GagNormal") >= 0) || (C.Effect.indexOf("GagHeavy") >= 0)) {
			
			var NS = "";
			for (var L = 0; L < CD.length; L++) {
				var H = CD.charAt(L).toLowerCase();
				if (H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "t") NS = NS + "e";
				if (H == "c" || H == "q" || H == "x") NS = NS + "k";
				if (H == "j" || H == "k" || H == "l" || H == "r") NS = NS + "a";
				if (H == "m" || H == "w") NS = NS + "w";
				if (H == "s" || H == "z" || H == "h") NS = NS + "h";
				if (H == "b" || H == "p" || H == "v") NS = NS + "f";
				if (H == "d" || H == "f" || H == "g" || H == "n") NS = NS + "m";
				if (H == " " || H == "!") NS = NS + H;
			}
			return NS;			
			
		} else return CD;

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
		DrawTextWrap(DialogGag(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -10, 950, 160, "white");
		
		// Draws the possible answers
		var pos = 0;
		for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					DrawTextWrap(CurrentCharacter.Dialog[D].Option, 1025, 160 + 105 * pos, 950, 80, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) ? "cyan" : "white");
					pos++;
				}

	}

}
