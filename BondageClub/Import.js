// Logs Sarah status from the Bondage College
function ImportBondageCollegeSarah() {
	if ((localStorage.getItem("BondageClubImportSource") != null) && (localStorage.getItem("BondageClubImportSource") == "BondageCollege"))
		if ((localStorage.getItem("BondageCollegeExportSarah") != null) && (localStorage.getItem("BondageCollegeExportSarah") != ""))
			LogAdd(localStorage.getItem("BondageCollegeExportSarah"), "NPC-Sarah");
}

// Import the inventory from the Bondage College
function ImportBondageCollegeInventory(C) {

	// If we come from the Bondage College, we translate the items from the college to the club
	if ((localStorage.getItem("BondageClubImportSource") != null) && (localStorage.getItem("BondageClubImportSource") == "BondageCollege")) {
		InventoryAdd(C, "CollegeOutfit1", "Cloth");
		if ((localStorage.getItem("BondageCollegeExportBallGag") != null) && (localStorage.getItem("BondageCollegeExportBallGag") == "true")) InventoryAdd(C, "HarnessBallGag", "ItemMouth");
		if ((localStorage.getItem("BondageCollegeExportClothGag") != null) && (localStorage.getItem("BondageCollegeExportClothGag") == "true")) InventoryAdd(C, "ClothOTMGag", "ItemMouth");
		if ((localStorage.getItem("BondageCollegeExportTapeGag") != null) && (localStorage.getItem("BondageCollegeExportTapeGag") == "true")) InventoryAdd(C, "DuctTapeGag", "ItemMouth");
		if ((localStorage.getItem("BondageCollegeExportRope") != null) && (localStorage.getItem("BondageCollegeExportRope") == "true")) InventoryAdd(C, "HempRope", "ItemArms");
		if ((localStorage.getItem("BondageCollegeExportRope") != null) && (localStorage.getItem("BondageCollegeExportRope") == "true")) InventoryAdd(C, "HempRope", "ItemLegs");
		if ((localStorage.getItem("BondageCollegeExportRope") != null) && (localStorage.getItem("BondageCollegeExportRope") == "true")) InventoryAdd(C, "HempRope", "ItemFeet");
		if ((localStorage.getItem("BondageCollegeExportCuffs") != null) && (localStorage.getItem("BondageCollegeExportCuffs") == "true")) InventoryAdd(C, "MetalCuffs", "ItemArms");
		if ((localStorage.getItem("BondageCollegeExportArmbinder") != null) && (localStorage.getItem("BondageCollegeExportArmbinder") == "true")) InventoryAdd(C, "LeatherArmbinder", "ItemArms");
		if ((localStorage.getItem("BondageCollegeExportChastityBelt") != null) && (localStorage.getItem("BondageCollegeExportChastityBelt") == "true")) InventoryAdd(C, "MetalChastityBelt", "ItemPelvis");
		if ((localStorage.getItem("BondageCollegeExportCollar") != null) && (localStorage.getItem("BondageCollegeExportCollar") == "true")) InventoryAdd(C, "LeatherCollar", "ItemNeck");
		if ((localStorage.getItem("BondageCollegeExportCrop") != null) && (localStorage.getItem("BondageCollegeExportCrop") == "true")) InventoryAdd(C, "LeatherCrop", "ItemPelvis");
		if ((localStorage.getItem("BondageCollegeExportCuffsKey") != null) && (localStorage.getItem("BondageCollegeExportCuffsKey") == "true")) InventoryAdd(C, "MetalCuffsKey", "ItemArms");
		if ((localStorage.getItem("BondageCollegeExportSleepingPill") != null) && (localStorage.getItem("BondageCollegeExportSleepingPill") == "true")) InventoryAdd(C, "RegularSleepingPill", "ItemMouth");
		if ((localStorage.getItem("BondageCollegeExportVibratingEgg") != null) && (localStorage.getItem("BondageCollegeExportVibratingEgg") == "true")) InventoryAdd(C, "RegularVibratingEgg", "ItemPelvis");
	}

}