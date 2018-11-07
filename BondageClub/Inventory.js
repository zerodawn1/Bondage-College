// Add a new item to character inventory
function InventoryAdd(C, NewItemAsset, NewItemUsable) {

	// First, we check if the inventory already exists
	var I;
	for (I = 0; I < C.Inventory.length; I++)
		if (C.Inventory[I].ItemName == NewItemAsset.Name)
			return;

	// Since the item doesn't exist, we add it
	var NewItem = {
		Asset: NewItemAsset
	}
	C.Inventory.push(NewItem);

	// Sends the new item to the server
	if ((C.AccountName != "") && (NewItemAsset.Value != 0))
		CharacterAccountRequest("inventory_add", "&name=" + NewItemAsset.Name + "&group=" + NewItemAsset.Group.Name + "&family=" + NewItemAsset.Group.Family);

}

// Loads the inventory from the account
function InventoryLoad(C, Inventory) {
	
	// Make sure we have something to load
	if (Inventory != null) {

		// For each items to add
		var I;
		for (I = 0; I < Inventory.length; I++) {

			// Cycles in all the assets to find the correct item to add
			var A;
			for (A = 0; A < Asset.length; A++)
				if ((Asset[A].Name == Inventory[I].Name) && (Asset[A].Group.Name == Inventory[I].Group) && (Asset[A].Group.Family == Inventory[I].Family)) {
					InventoryAdd(C, Asset[A])
					break;
				}

		}

	}

}

// Creates the player starting inventory (CharacterID zero is always the player)
function InventoryCreate(C) {
	
	// If we come from the Bondage College, we add the Bondage College items
	C.Inventory = [];
	var url = new URL(window.location.href);
	if (url.searchParams.get("Source") == "BondageCollege")
		for (A = 0; A < Asset.length; A++)
			if (Asset[A].Name.indexOf("College") >= 0)
				InventoryAdd(C, Asset[A]);

	// Adds all items with 0 value, these come by default for any character
	var A;
	for (A = 0; A < Asset.length; A++)
		if (Asset[A].Value == 0)
			InventoryAdd(C, Asset[A]);

}