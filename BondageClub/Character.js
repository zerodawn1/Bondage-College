var Character = [];

// Loads a character in the buffer
function CharacterLoad(CharacterName, CharacterInventory, CharacterAppearance) {

	// First, we check if the character already exists
	var C;
	for (C = 0; C < Character.length; C++)
		if (Character[C].CharacterName == "CharacterName") {
			Character[C].Inventory = CharacterInventory;
			Character[C].Appearance = CharacterAppearance;
			CharacterLoadCanvas(Character[C]);
			return;
		}

	// Since we could not find the character, we add a new one to the list
	var NewCharacter = {
		Name: CharacterName,
		Inventory: CharacterInventory,
		Appearance: CharacterAppearance,
		Canvas: null,
		CanvasBlink: null,
		BlinkFactor: Math.round(Math.random() * 10) + 10
	}
	Character.push(NewCharacter);
	CharacterLoadCanvas(Character[Character.length - 1]);

}

// Sorts the character appearance by priority and loads the canvas
function CharacterLoadCanvas(C) {
	
	// Sorts the full appearance arraw first
	var App = [];
	var I;
	for (I = 0; I < 101 && App.length < C.Appearance.length; I++) {
		var A;
		for (A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.Group.DrawingPriority == I)
				App.push(C.Appearance[A]);
	}	
	C.Appearance = App;
	
	// Reload the canvas
	CharacterAppearanceBuildCanvas(C);

}

// Reload all characters canvas
function CharacterLoadCanvasAll() {	
	var C;
	for (C = 0; C < Character.length; C++)
		CharacterLoadCanvas(Character[C]);
}
