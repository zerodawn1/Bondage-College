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

	// If the user clicked on the interaction character or herself, we check to use an item 
	if (CurrentCharacter.AllowItem && (MouseX >= 0) && (MouseX <= 1000) && (MouseY >= 0) && (MouseY < 1000) && ((CurrentCharacter.ID != 0) || (MouseX > 500))) {
		Character[0].FocusGroup = null;
		CurrentCharacter.FocusGroup = null;
		var C = (MouseX < 500) ? Character[0] : CurrentCharacter;
		var X = (MouseX < 500) ? 0 : 500;
		for(var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
				for(var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if ((MouseX - X >= AssetGroup[A].Zone[Z][0]) && (MouseY >= AssetGroup[A].Zone[Z][1] - C.HeightModifier) && (MouseX - X <= AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) && (MouseY <= AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - C.HeightModifier))
						C.FocusGroup = AssetGroup[A];
	}

	// In item menu mode VS text dialog mode
	if (((Character[0].FocusGroup != null) || (CurrentCharacter.FocusGroup != null)) && (CurrentCharacter.AllowItem)) {

		// If the user cancels the menu
		if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 25) && (MouseY <= 100)) {
			var C = (Character[0].FocusGroup != null) ? Character[0] : CurrentCharacter;
			CharacterAppearanceSetItem(C, C.FocusGroup.Name, null);
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
			var C = (Character[0].FocusGroup != null) ? Character[0] : CurrentCharacter;
			for(var I = 0; I < Character[0].Inventory.length; I++)
				if ((Character[0].Inventory[I].Asset != null) && (Character[0].Inventory[I].Asset.Group.Name == C.FocusGroup.Name) && (Character[0].Inventory[I].Asset.Group.Category == "Item")) {

					// If the item at position is clicked
					if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
						CharacterAppearanceSetItem(C, Character[0].Inventory[I].Asset.Group.Name, Character[0].Inventory[I].Asset);
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
						if (!Character[0].IsGagged() && !CurrentCharacter.IsGagged()) {
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
function DialogDrawItemMenu(C) {

	// Draws the top menu
	DrawText("Select an item to use", 1250, 62, "White", "Black");
	DrawButton(1500, 25, 225, 75, "Remove", "White");	
	DrawButton(1750, 25, 225, 75, "Cancel", "White");
		
	// For each items in the player inventory
	var X = 1000;
	var Y = 125;
	for(var I = 0; I < Character[0].Inventory.length; I++)
		if ((Character[0].Inventory[I].Asset != null) && (Character[0].Inventory[I].Asset.Group.Name == C.FocusGroup.Name) && (Character[0].Inventory[I].Asset.Group.Category == "Item")) {			
			DrawRect(X, Y, 225, 275, ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) ? "cyan" : "white");
			DrawImageResize("Assets/" + Character[0].Inventory[I].Asset.Group.Family + "/" + Character[0].Inventory[I].Asset.Group.Name + "/Preview/" + Character[0].Inventory[I].Name + ".png", X + 2, Y + 2, 221, 221);
			DrawTextFit(Character[0].Inventory[I].Asset.Description, X + 112, Y + 250, 221, "black");
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

}

// Garbles the speech if the character is gagged, anything between parentheses isn't touched
function DialogGarble(C, CD) {

	// Variables to build the new string and check if we are in a parentheses
	var NS = "";
	var Par = false;
		
	// Total gags always returns "..."
	if (C.Effect.indexOf("GagTotal") >= 0) {
		NS = "... ";
		for (var L = 0; L < CD.length; L++) {			
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (Par) NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Heavy garble - Almost no letter stays the same
	if (C.Effect.indexOf("GagHeavy") >= 0) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "t") NS = NS + "e";
				if (H == "c" || H == "q" || H == "x") NS = NS + "k";
				if (H == "j" || H == "k" || H == "l" || H == "r" || H == "w") NS = NS + "a";
				if (H == "s" || H == "z" || H == "h") NS = NS + "h";
				if (H == "b" || H == "p" || H == "v") NS = NS + "f";
				if (H == "d" || H == "f" || H == "g" || H == "n" || H == "m") NS = NS + "m";
				if (H == " " || H == "!") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Normal garble, keep vowels and a few letters the same
	if (C.Effect.indexOf("GagNormal") >= 0) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "v" || H == "b" || H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "w" || H == "y" || H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s" || H == "z") NS = NS + "h";
				if (H == "d" || H == "f") NS = NS + "m";
				if (H == "p") NS = NS + "f";
				if (H == "g") NS = NS + "n";
				if (H == " " || H == "!" || H == "." || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "m" || H == "n" || H == "h") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}
		
	// Light garble, half of the letters stay the same
	if (C.Effect.indexOf("GagLight") >= 0) {
		CD = CD.replace(/ *\([^)]*\) */g, "");
		var NS = "";
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s") NS = NS + "z";
				if (H == "z") NS = NS + "s";
				if (H == "d" || H == "f" || H == "m" || H == "g") NS = NS + "m";
				if (H == "b" || H == "h" || H == "n" || H == "v" || H == "w" || H == "p" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == "," || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// No gag effect, we return the regular text
	return CD;

}

// Searches in the dialog for a specific stage keyword and returns that dialog option if we find it
function DialogFind(C, KeyWord) {
	for(var D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord)
			return C.Dialog[D].Result;
	return CurrentCharacter.CurrentDialog;
}

// Draw all the possible interactions 
function DialogDraw() {

	// Draw both the player and the interaction character
	if (CurrentCharacter.ID != 0) DrawCharacter(Character[0], 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);
	
	// If we must show the item menu
	if (((Character[0].FocusGroup != null) || (CurrentCharacter.FocusGroup != null)) && (CurrentCharacter.AllowItem))
		DialogDrawItemMenu((Character[0].FocusGroup != null) ? Character[0] : CurrentCharacter);
	else {

		// Find the character intro text if we need too
		if ((CurrentCharacter.CurrentDialog == null) || (CurrentCharacter.CurrentDialog == ""))
			for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D)) {
					CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result
					break;
				}

		// Draws the intro text or dialog result
		if (Character[0].IsGagged()) {
			var D = DialogFind(CurrentCharacter, "PlayerGagged");
			DrawTextWrap(DialogGarble(CurrentCharacter, D), 1025, -10, 950, 160, "white");
		}
		else
			DrawTextWrap(DialogGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -10, 950, 160, "white");
		
		// Draws the possible answers
		var pos = 0;
		for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					DrawTextWrap(DialogGarble(Character[0], CurrentCharacter.Dialog[D].Option), 1025, 160 + 105 * pos, 950, 80, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) ? "cyan" : "white");
					pos++;
				}

	}

}
