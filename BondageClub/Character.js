var Character = [];

// Loads a character in the buffer
function CharacterLoad(CharacterName, CharacterInventory, CharacterAppearance) {

	// First, we check if the character already exists
	var C;
	for (C = 0; C < Character.length; C++)
		if (Character[C].CharacterName == "CharacterName") {
			Character.Inventory = CharacterInventory;
			Character.Appearance = CharacterAppearance;
			Character.Canvas = CharacterAppearanceGetCanvas(CharacterAppearance);
			return;
		}

	// Since we could not find the character, we add a new one to the list
	var NewCharacter = {
		Name: CharacterName,
		Inventory: CharacterInventory,
		Appearance: CharacterAppearance,
		Canvas: CharacterAppearanceGetCanvas(CharacterAppearance)
	}
	Character.push(NewCharacter);

}