var C013_BondageClub_Entrance_CurrentStage = 0;
var C013_BondageClub_Entrance_WithSarah = false;
var C013_BondageClub_Entrance_HasInvitation = false;
var C013_BondageClub_Entrance_IsCollared = false;
var C013_BondageClub_Entrance_BeltProblem = false;
var C013_BondageClub_Entrance_EggProblem = false;
var C013_BondageClub_Entrance_NoProblem = false;

// Chapter 13 Bondage Club - Load the entrance parameters
function C013_BondageClub_Entrance_LoadParams() {
	C013_BondageClub_Entrance_HasInvitation = GameLogQuery("", "", "BondageClubInvitation");
	C013_BondageClub_Entrance_WithSarah = GameLogQuery("", "", "VisitBondageClubWithSarah");
	C013_BondageClub_Entrance_IsCollared = (PlayerHasLockedInventory("Collar") && (Common_PlayerOwner != ""));
	C013_BondageClub_Entrance_BeltProblem = PlayerHasLockedInventory("ChastityBelt");
	C013_BondageClub_Entrance_EggProblem = (PlayerHasLockedInventory("VibratingEgg") && !PlayerHasLockedInventory("ChastityBelt"));
	C013_BondageClub_Entrance_NoProblem = (!PlayerHasLockedInventory("VibratingEgg") && !PlayerHasLockedInventory("ChastityBelt"));
}

// Chapter 13 Bondage Club - Entrance Load
function C013_BondageClub_Entrance_Load() {
	
	// Loads the entrance interactions 
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C013_BondageClub_Entrance_LoadParams();

	// No leaving from the entrance
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 13 Bondage Club - Entrance Load
function C013_BondageClub_Entrance_Run() {
	BuildInteraction(C013_BondageClub_Entrance_CurrentStage);
}

// Chapter 13 Bondage Club - Entrance Click
function C013_BondageClub_Entrance_Click() {
	ClickInteraction(C013_BondageClub_Entrance_CurrentStage);
}

// Chapter 13 Bondage Club - Unlock a specific item
function C013_BondageClub_Entrance_UnlockItem(ItemType) {
	PlayerUnlockInventory(ItemType);
	C013_BondageClub_Entrance_LoadParams();
}

// Chapter 13 Bondage Club - Ends the Bondage College and loads the Bondage Club game engine
function C013_BondageClub_Entrance_EnterClub() {
	window.location = "BondageClub/index.html";
}
