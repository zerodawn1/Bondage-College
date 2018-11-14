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

// Generic dialog function to remove a piece of the conversation
function Dialog_RemoveOption() {

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

	// Draws the possible answers
	if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 975)) {
		var pos = 0;
		for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 240 + pos * 105)) {
						
						if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
						CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
						if (CurrentCharacter.Dialog[D].Function != null) DynamicFunction(CurrentCharacter.Dialog[D].Function);
						break;

					}
					pos++;
				}
	}
	
}

// Draw all the possible interactions 
function DialogDraw() {

	// Draw both the player and the interaction character
	DrawCharacter(Character[0], 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);
	
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
