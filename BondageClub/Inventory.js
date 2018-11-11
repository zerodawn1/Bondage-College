// Add a new item by group & name to character inventory
function InventoryAdd(C, NewItemName, NewItemGroup, Push) {

	// First, we check if the inventory already exists, exit if it's the case
	var I;
	for (I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == NewItemName) && (C.Inventory[I].Group == NewItemGroup))
			return;

	// Searches to find the item asset in the current character assets family
	var NewItemAsset;
	for (A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == NewItemName) && (Asset[A].Group.Name == NewItemGroup) && (Asset[A].Group.Family == C.AssetFamily)) {
			NewItemAsset = Asset[A];
			break;
		}
		
	// Creates the item and pushes it in the inventory queue
	var NewItem = {
		Name: NewItemName,
		Group: NewItemGroup,
		Asset: NewItemAsset
	}
	C.Inventory.push(NewItem);

	// Sends the new item to the server if it's for the current player
	if ((C.ID == 0) && ((Push == null) || Push))
		AccountRequest("inventory_add", "&name=" + NewItemName + "&group=" + NewItemGroup);

}

// Loads the inventory from the account
function InventoryLoad(C, Inventory, Import) {
	
	// Flush the current inventory and import items from the Bondage College
	C.Inventory = [];
	if (Import && (C.ID == 0)) ImportBondageCollegeInventory(C);
	
	// Make sure we have something to load
	if (Inventory != null) {

		// Add each items one by one
		var I;
		for (I = 0; I < Inventory.length; I++)
			InventoryAdd(C, Inventory[I].Name, Inventory[I].Group, false);

	}

}