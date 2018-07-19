var C012_AfterClass_RockShow_CurrentStage = 0;
var C012_AfterClass_RockShow_IntroText = "";

// Chapter 12 After Class - Rock Show Load
function C012_AfterClass_RockShow_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	ActorLoad("Sidney", "");
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	Common_PlayerPose = "BackWatchShow";
	ActorSetPose("BackWatchShow");

	// If we must put the previous text back
	if (C012_AfterClass_RockShow_IntroText != "") { OverridenIntroText = C012_AfterClass_RockShow_IntroText; C012_AfterClass_RockShow_IntroText = ""; }

	// No leaving from the rock show
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Rock Show Run
function C012_AfterClass_RockShow_Run() {
	BuildInteraction(C012_AfterClass_RockShow_CurrentStage);
	DrawActor("Player", 480, 0, 1);
	DrawActor(CurrentActor, 700, 0, 1);
}

// Chapter 12 After Class - Rock Show Click
function C012_AfterClass_RockShow_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_RockShow_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_RockShow_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the rock show
function C012_AfterClass_RockShow_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	GameLogAdd("BackFromRockShow");
	SetScene(CurrentChapter, "Dorm");
}