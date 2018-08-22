var C012_AfterClass_Isolation_CurrentStage = 0;
var C012_AfterClass_Isolation_IntroText = "";
var C012_AfterClass_Isolation_CurrentActor = "";
var C012_AfterClass_Isolation_IsolationEscape = false;
var C012_AfterClass_Isolation_IsolationStuck = false;
var C012_AfterClass_Isolation_SarahOnCross = false;
var C012_AfterClass_Isolation_SarahOnPillory = false;
var C012_AfterClass_Isolation_SarahOnHorse = false;
var C012_AfterClass_Isolation_SarahRestrained = false;

// Chapter 12 After Class - Isolation Load
function C012_AfterClass_Isolation_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	ActorLoad("Sarah", "");
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Isolation_IsolationEscape = GameLogQuery("C006_Isolation", "", "Escape");
	C012_AfterClass_Isolation_IsolationStuck = (GameLogQuery("C006_Isolation", "", "Pillory") || GameLogQuery("C006_Isolation", "", "Cross"));

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

	// The image can switch if Sarah is stranded
	OverridenIntroImage = "";
	if ((C012_AfterClass_Isolation_CurrentStage >= 20) && (C012_AfterClass_Isolation_CurrentStage < 100)) {
		if (C012_AfterClass_Isolation_SarahOnCross) OverridenIntroImage = "IsolationSarahCross.jpg";
		if (C012_AfterClass_Isolation_SarahOnPillory) OverridenIntroImage = "IsolationSarahPillory.jpg";
		if (C012_AfterClass_Isolation_SarahOnHorse) OverridenIntroImage = "IsolationSarahHorse.jpg";
	}

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Isolation_IntroText = OverridenIntroText;
		C012_AfterClass_Isolation_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the isolation room
function C012_AfterClass_Isolation_Leave(LeaveType) {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	if (LeaveType == "Sarah") GameLogAdd("EnterDormFromRoommates");
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - When the player searches, a collar and cuffs can be found
function C012_AfterClass_Isolation_Search() {
	CurrentTime = CurrentTime + 110000;
	if (!GameLogQuery(CurrentChapter, "Player", "IsolationFindCollar")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "IsolationFindCollar");
		OverridenIntroText = GetText("FindCollar");
		PlayerAddInventory("Collar", 1);
	} else {
		if (!GameLogQuery(CurrentChapter, "Player", "IsolationFindCuffs")) {
			GameLogSpecificAdd(CurrentChapter, "Player", "IsolationFindCuffs");
			OverridenIntroText = GetText("FindCuffs");
			PlayerAddInventory("Cuffs", 1);
		}
	}
}