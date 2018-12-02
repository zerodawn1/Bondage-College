var DialogText = "";
var DialogTextDefault = "";
var DialogTextDefaultTimer = -1;
var DialogStruggleTimerStart = 0;
var DialogStruggleTimerEnd = 0;
var DialogInventory = [];

function DialogReputationLess(RepType, Value) { return (ReputationGet(RepType) <= Value); } // Returns TRUE if a specific reputation type is less or equal than a given value
function DialogReputationGreater(RepType, Value) { return (ReputationGet(RepType) >= Value); } // Returns FALSE if a specific reputation type is greater or equal than a given value
function DialogChangeReputation(RepType, Value) { ReputationProgress(RepType, Value); } // Change the player reputation progressively through dialog options (a reputation is easier to break than to build)
function DialogWearItem(AssetName, AssetGroup) { CharacterWearItem(Player, AssetName, AssetGroup); } // Equips a specific item on the player from dialog
function DialogWearRandomItem(AssetGroup) { CharacterWearRandomItem(Player, AssetGroup); } // Equips a random item from a given group to the player from dialog
function DialogRelease(C) { CharacterRelease(C); } // Releases a character from restraints
function DialogNaked(C) { CharacterNaked(C); } // Strips a character naked and removes the restrains
function DialogSetCharacter(C) { CharacterSetCurrent(C); } // Sets a new character as the current one in the dialog

// Returns TRUE if the dialog prerequisite condition is met
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else
		if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("Player.") == 0)
			return Player[CurrentCharacter.Dialog[D].Prerequisite.substring(7, 250).replace("()", "").trim()]();
		else 
			if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!Player.") == 0)
				return !Player[CurrentCharacter.Dialog[D].Prerequisite.substring(8, 250).replace("()", "").trim()]();
			else
				if ((CurrentCharacter.Dialog[D].Prerequisite.indexOf("Dialog") == 0) || (CurrentCharacter.Dialog[D].Prerequisite.indexOf("Dialog") == 1))
					return eval(CurrentCharacter.Dialog[D].Prerequisite);
				else
					if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
						return eval(CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite);
					else
						return !eval(CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250));
}

// Searches for an item in the player inventory to unlock a specific item
function DialogCanUnlock(C) {
	var UnlockName = "Unlock-" + CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Name");	
	for (var I = 0; I < Player.Inventory.length; I++)
		if ((Player.Inventory[I].Asset.Effect != null) && (Player.Inventory[I].Asset.Effect.indexOf(UnlockName) >= 0))
			return true;
	return false;
}

// Returns the current character dialog intro
function DialogIntro() {
	for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D)) {
			return CurrentCharacter.Dialog[D].Result;
			break;
		}
	return "";
}

// Generic dialog function to leave conversation
function DialogLeave() {
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
	DialogInventory = null;
	CurrentCharacter = null;
}

// Generic dialog function to remove a piece of the conversation that's already done
function DialogRemove() {

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
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
	DialogInventory = null;
	DialogStruggleTimerStart = 0;
	DialogStruggleTimerEnd = 0;
}

// Adds the item in the dialog list
function DialogInventoryAdd(NewInv, NewInvWorn) {

	// Make sure we do not duplicate the item
	for(var I = 0; I < DialogInventory.length; I++)
		if ((DialogInventory[I].Asset.Group.Name == NewInv.Group.Name) && (DialogInventory[I].Asset.Name == NewInv.Name))
			return;
		
	// Creates a new dialog inventory item
	var DI = {
		Asset: NewInv,
		Worn: NewInvWorn,
		Icon: ""
	};

	// Loads the correct icon and push the item in the array
	if (NewInvWorn && (NewInv.Effect != null) && (NewInv.Effect.indexOf("Lock") >= 0)) DI.Icon = "Locked";
	if (!NewInvWorn && (NewInv.Effect != null) && (NewInv.Effect.indexOf("Lock") >= 0)) DI.Icon = "Unlocked";
	DialogInventory.push(DI);

}

// Build the inventory listing for the dialog which is what's equipped, the player inventory and the character inventory for that group
function DialogInventoryBuild(C) {

	// Make sure there's a focused group
	DialogInventory = [];
	if (C.FocusGroup != null) {

		// First, we add anything that's currently equipped
		for(var A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				DialogInventoryAdd(C.Appearance[A].Asset, true);

		// Second, we add everything from the victim inventory
		for(var A = 0; A < C.Inventory.length; A++)
			if ((C.Inventory[A].Asset != null) && (C.Inventory[A].Asset.Group.Name == C.FocusGroup.Name))
				DialogInventoryAdd(C.Inventory[A].Asset, false);
			
		// Third, we add everything from the player inventory if the player isn't the victim
		if (C.ID != 0)
			for(var A = 0; A < Player.Inventory.length; A++)
				if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == C.FocusGroup.Name))
					DialogInventoryAdd(Player.Inventory[A].Asset, false);

	}

}

// When the user clicks on a dialog option
function DialogClick() {

	// If the user clicked on the interaction character or herself, we check to use an item 
	if ((CurrentCharacter.AllowItem || (MouseX < 500)) && (MouseX >= 0) && (MouseX <= 1000) && (MouseY >= 0) && (MouseY < 1000) && ((CurrentCharacter.ID != 0) || (MouseX > 500)) && (DialogIntro() != "")) {
		DialogLeaveItemMenu();
		var C = (MouseX < 500) ? Player : CurrentCharacter;
		var X = (MouseX < 500) ? 0 : 500;
		for(var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
				for(var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if ((MouseX - X >= AssetGroup[A].Zone[Z][0]) && (MouseY >= AssetGroup[A].Zone[Z][1] - C.HeightModifier) && (MouseX - X <= AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) && (MouseY <= AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - C.HeightModifier)) {
						C.FocusGroup = AssetGroup[A];
						DialogInventoryBuild(C);
						DialogText = DialogTextDefault;
						break;
					}
	}

	// In item menu mode VS text dialog mode
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		// If the user removes wants to remove an item
		if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 25) && (MouseY <= 100)) {

			// If the player can interact, we simply remove the item
			var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
			var Effect = CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Effect");
			if (Player.CanInteract()) {
				if ((C.FocusGroup != null) && (CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Name") != "None")) {

					// Do not allow to remove if it's locked
					if ((Effect == null) || (Effect.indexOf("Lock") < 0)) {
						C.CurrentDialog = DialogFind(C, "Remove" + C.FocusGroup.Name, "");
						CharacterAppearanceSetItem(C, C.FocusGroup.Name, null);
						DialogLeaveItemMenu();
					}

				}
			} else {
				
				// If the player can struggle out
				if ((C.ID == 0) && (Effect != null) && (Effect.indexOf("Block") >= 0) && (Effect.indexOf("Struggle") >= 0) && (DialogStruggleTimerEnd == 0)) {
					DialogStruggleTimerStart = new Date().getTime();
					DialogStruggleTimerEnd = new Date().getTime() + 30000;
				}
				
				// If the player can unlock herself
				if ((C.ID == 0) && (Effect != null) && (Effect.indexOf("Block") >= 0) && (Effect.indexOf("Lock") >= 0) && DialogCanUnlock(C)) {
					C.CurrentDialog = DialogFind(C, "Remove" + C.FocusGroup.Name, "");
					CharacterAppearanceSetItem(C, C.FocusGroup.Name, null);
					DialogLeaveItemMenu();
				}

			}
						
		}
	
		// If the user cancels the menu
		if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 100))
			DialogLeaveItemMenu();

		// If the user clicks on one of the items
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 850) && Player.CanInteract()) {

			// For each items in the player inventory
			var X = 1000;
			var Y = 125;
			var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
			for(var I = 0; I < DialogInventory.length; I++) {

				// If the item at position is clicked
				if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && DialogInventory[I].Asset.Enable) {

					// Cannot change item if the previous one is locked
					var Effect = CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Effect");
					if ((Effect == null) || (Effect.indexOf("Lock") < 0)) {
						if (DialogInventory[I].Asset.Wear) 
							if ((DialogInventory[I].Asset.Prerequisite == null) || eval(DialogInventory[I].Asset.Prerequisite.replace("CharacterObject", "C"))) {
								CharacterAppearanceSetItem(C, DialogInventory[I].Asset.Group.Name, DialogInventory[I].Asset);
								C.CurrentDialog = DialogFind(C, DialogInventory[I].Asset.Name, DialogInventory[I].Asset.Group.Name);
								DialogLeaveItemMenu();
							}
					} else {
						
						// Check if we can unlock the item
						var Name = CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Name");
						if ((DialogInventory[I].Asset.Effect != null) && (DialogInventory[I].Asset.Effect.indexOf("Unlock-" + Name) >= 0)) {
							C.CurrentDialog = DialogFind(C, "Remove" + C.FocusGroup.Name, "");
							CharacterAppearanceSetItem(C, C.FocusGroup.Name, null);
							DialogLeaveItemMenu();
							break;
						}
							
					}
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

		// If we need to leave the dialog (only allowed when there's an entry point to the dialog, not in the middle of a conversation)
		if ((DialogIntro() != "") && (MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110))
			DialogLeave();

		// If the user clicked on a text dialog option, we trigger it
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 975) && (CurrentCharacter != null)) {
			var pos = 0;
			for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) {

						// If the player is gagged, the answer will always be the same
						if (!Player.CanTalk()) CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerGagged", "");
						else CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
						
						// A dialog option can change the conversation stage, show text or launch a custom function						
						if ((Player.CanTalk() && CurrentCharacter.CanTalk()) || ((DialogGarble(Player, CurrentCharacter.Dialog[D].Option) == CurrentCharacter.Dialog[D].Option) && CurrentCharacter.CanTalk())) {
							CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
							if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
							if (CurrentCharacter.Dialog[D].Function != null) CommonDynamicFunction(CurrentCharacter.Dialog[D].Function);
						} else 
							if ((CurrentCharacter.Dialog[D].Function != null) && (CurrentCharacter.Dialog[D].Function.trim() == "DialogLeave()"))
								DialogLeave();
						break;

					}
					pos++;
				}
		}
	
	}	

}

// Sets the dialog 5 seconds text
function DialogSetText(NewText) {
	DialogTextDefaultTimer = new Date().getTime() + 5000;
	DialogText = DialogFind(Player, NewText);
}

// Draw the item menu dialog
function DialogDrawItemMenu(C) {

	// Gets the default text that will reset after 5 seconds
	if (DialogTextDefault == "") DialogTextDefault = DialogFind(Player, "SelectItem");
	if (DialogTextDefaultTimer < new Date().getTime()) DialogText = DialogTextDefault;

	// Inventory is only accessible if the player can interact
	if (Player.CanInteract()) {

		// Builds the item dialog if we need too
		if (DialogInventory == null) DialogInventoryBuild(C);
	
		// Draws the top menu
		if ((C.FocusGroup != null) && (CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Name") != "None")) {
			DrawText(DialogText, 1250, 62, "White", "Black");
			DrawButton(1500, 25, 225, 75, "Remove", "White");
		} else DrawText(DialogText, 1375, 62, "White", "Black");
		DrawButton(1750, 25, 225, 75, "Cancel", "White");

		// For each items in the player inventory
		var X = 1000;
		var Y = 125;
		for(var I = 0; I < DialogInventory.length; I++) {
			DrawRect(X, Y, 225, 275, ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile) ? "cyan" : DialogInventory[I].Worn ? "pink" : "white");
			DrawImageResize("Assets/" + DialogInventory[I].Asset.Group.Family + "/" + DialogInventory[I].Asset.Group.Name + "/Preview/" + DialogInventory[I].Asset.Name + ".png", X + 2, Y + 2, 221, 221);
			DrawTextFit(DialogInventory[I].Asset.Description, X + 112, Y + 250, 221, "black");
			if (DialogInventory[I].Icon != "") DrawImage("Icons/" + DialogInventory[I].Icon + ".png", X + 2, Y + 110);
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}
	
	} else {
				
		// If we must draw the struggle/unlock dialog
		var A = CharacterAppearanceGetCurrentValue(C, C.FocusGroup.Name, "Asset");
		DrawButton(1750, 25, 225, 75, "Cancel", "White");
		if ((A != null) && (A != "None")) {

			// Draw it
			DrawRect(1400, 250, 225, 275, "pink");
			DrawImageResize("Assets/" + A.Group.Family + "/" + A.Group.Name + "/Preview/" + A.Name + ".png", 1402, 252, 221, 221);
			DrawTextFit(A.Description, 1512, 500, 221, "black");

			// Draw the struggle option
			if ((C.ID == 0) && (A.Effect != null) && (A.Effect.indexOf("Block") >= 0) && (A.Effect.indexOf("Struggle") >= 0)) {
				DrawText("Struggle to free yourself", 1250, 62, "White", "Black");
				DrawButton(1500, 25, 225, 75, "Struggle", "White");			
			}

			// Draw the unlock option
			if ((C.ID == 0) && (A.Effect != null) && (A.Effect.indexOf("Block") >= 0) && (A.Effect.indexOf("Lock") >= 0)) {
				if (DialogCanUnlock(C)) {
					DrawText("You can unlock yourself", 1250, 62, "White", "Black");
					DrawButton(1500, 25, 225, 75, "Unlock", "White");
				} else DrawText("You don't have the proper key", 1350, 62, "White", "Black");
			}

			// Draw the no struggle option
			if ((C.ID == 0) && (A.Effect != null) && (A.Effect.indexOf("Block") >= 0) && (A.Effect.indexOf("Lock") < 0) && (A.Effect.indexOf("Struggle") < 0))
				DrawText("You'll need help to get out", 1250, 62, "White", "Black");
		}
		
		// If the player is struggling
		if (DialogStruggleTimerEnd > 0) {
			var Progress = (new Date().getTime() - DialogStruggleTimerStart) / (DialogStruggleTimerEnd - DialogStruggleTimerStart);
			DrawText("Struggling...", 1500, 650, "White", "Black");
			DrawProgressBar(1200, 700, 600, 100, Progress * 100);
			if (Progress >= 1) {
				Player.CurrentDialog = DialogFind(Player, "Struggle" + Player.FocusGroup.Name, "");
				CharacterAppearanceSetItem(Player, Player.FocusGroup.Name, null);
				DialogInventoryBuild(C);
			}
		}
		else DrawText("You cannot access your items", 1500, 700, "White", "Black");
		
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
function DialogFind(C, KeyWord1, KeyWord2) {
	for(var D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord1)
			return C.Dialog[D].Result;
	for(var D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord2)
			return C.Dialog[D].Result;
	return CurrentCharacter.CurrentDialog;
}

// Draw all the possible interactions 
function DialogDraw() {

	// Draw both the player and the interaction character
	if (CurrentCharacter.ID != 0) DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);
	
	// If we must show the item menu
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != ""))
		DialogDrawItemMenu((Player.FocusGroup != null) ? Player : CurrentCharacter);
	else {

		// Draws the intro text or dialog result
		if (DialogIntro() != "") {
			DrawTextWrap(DialogGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -10, 840, 160, "white");
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else DrawTextWrap(DialogGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -10, 950, 160, "white");

		// Draws the possible answers
		var pos = 0;
		for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					DrawTextWrap(DialogGarble(Player, CurrentCharacter.Dialog[D].Option), 1025, 160 + 105 * pos, 950, 80, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105) && !CommonIsMobile) ? "cyan" : "white");
					pos++;
				}

	}

}