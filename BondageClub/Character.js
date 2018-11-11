var Character = [];

// Loads a character in the buffer
function CharacterReset(CharacterID, CharacterAssetFamily) {

	// Prepares the character sheet
	var NewCharacter = {
		ID: CharacterID,
		Name: "",
		AssetFamily: CharacterAssetFamily,
		AccountName: "",
		AccountPassword: "",
		Inventory: [],
		Appearance: [],
		Canvas: null,
		CanvasBlink: null,
		BlinkFactor: Math.round(Math.random() * 10) + 10
	}

	// If the character doesn't exist, we create it
	if (CharacterID >= Character.length)
		Character.push(NewCharacter);
	else
		Character[CharacterID] = NewCharacter;

	// Creates the inventory and default appearance
	InventoryLoad(NewCharacter, null, true);
	CharacterAppearanceSetDefault(NewCharacter);
		
	// Load the character image
	CharacterLoadCanvas(NewCharacter);

}

// Creates a random name for the character
function CharacterRandomName(C) {

	// Generates a name from the name bank 
	var NewName = CharacterName[Math.floor(Math.random() * CharacterName.length)];
	C.Name = NewName;
	
	// If the name is already taken, we generate a new one
	var C;
	for (C = 0; C < Character.length; C++)
		if ((Character[C].Name == NewName) && (Character[C].ID != C.ID)) {
			CharacterRandomName(C)
			return;
		}

}

// Loads in the NPC character in the buffer
function CharacterLoadNPC(NPCType) {

	// Checks if the NPC already exists and returns it if it's the case
	var C;
	for (C = 0; C < Character.length; C++)
		if (Character[C].AccountName == NPCType)
			return Character[C];

	// Randomzie the new character
	CharacterReset(Character.length, "Female3DCG");
	C = Character[Character.length - 1];
	C.AccountName = NPCType;
	CharacterRandomName(C);
	CharacterAppearanceFullRandom(C);
	
	// Maid archetype
	if (NPCType.indexOf("Maid") >= 0) {
		InventoryAdd(C, "MaidOutfit1", "Cloth");
		CharacterAppearanceSetItem(C, "Cloth", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Cloth");
		InventoryAdd(C, "MaidHat1", "Hat");
		CharacterAppearanceSetItem(C, "Hat", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Hat");
	}

	// Returns the new character
	return C;
	
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