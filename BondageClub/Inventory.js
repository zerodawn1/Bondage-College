// Add a new item to character inventory
function InventoryAdd(CharacterID, NewItemAsset, NewItemQuantity, NewItemUsable) {

	// First, we check if the inventory already exists
	var I;
	for (I = 0; I < Character[CharacterID].Inventory.length; I++)
		if (Character[CharacterID].Inventory[I].ItemName == NewItemAsset.Name) {
			Character[CharacterID].Inventory[I].Quantity = Character[CharacterID].Inventory[I].Quantity + NewItemQuantity;
			return;
		}
	
	// Since the item doesn't exist, we add it
	var NewItem = {
		Asset: NewItemAsset,
		Quantity: NewItemQuantity,
		Usable: NewItemUsable
	}	
	Character[CharacterID].Inventory.push(NewItem);
	
}

// Creates the player starting inventory (CharacterID zero is always the player)
function InventoryCreate() {
	
	// Adds all items with 0 value, these come by default for any character
	var A;
	for (A = 0; A < Asset.length; A++)
		if (Asset[A].Value == 0)
			InventoryAdd(0, Asset[A], 1, false);

	// If we come from the Bondage College, we add the Bondage College items
	var url = new URL(window.location.href);
	if (url.searchParams.get("Source") == "BondageCollege")
		for (A = 0; A < Asset.length; A++)
			if (Asset[A].Name.indexOf("College") >= 0)
				InventoryAdd(0, Asset[A], 1, false);

}