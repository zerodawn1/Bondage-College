var C012_AfterClass_Isolation_CurrentStage = 0;
var C012_AfterClass_Isolation_IntroText = "";
var C012_AfterClass_Isolation_CurrentActor = "";

// Chapter 12 After Class - Isolation Load
function C012_AfterClass_Isolation_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Isolation_IntroText != "") { OverridenIntroText = C012_AfterClass_Isolation_IntroText; C012_AfterClass_Isolation_IntroText = ""; }
	if (C012_AfterClass_Isolation_CurrentActor != "") ActorLoad(C012_AfterClass_Isolation_CurrentActor, "");

	// No leaving from the room
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Isolation Run
function C012_AfterClass_Isolation_Run() {
	BuildInteraction(C012_AfterClass_Isolation_CurrentStage);
}

// Chapter 12 After Class - Isolation Click
function C012_AfterClass_Isolation_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Isolation_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Isolation_IntroText = OverridenIntroText;
		C012_AfterClass_Isolation_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the isolation room
function C012_AfterClass_Isolation_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}
