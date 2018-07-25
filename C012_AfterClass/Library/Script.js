var C012_AfterClass_Library_CurrentStage = 0;
var C012_AfterClass_Library_AmandaAvail = false;
var C012_AfterClass_Library_EmptyLibrary = true;
var C012_AfterClass_Library_IntroText = "";
var C012_AfterClass_Library_CurrentActor = "";
var C012_AfterClass_Library_HasSeduction = false;
var C012_AfterClass_Library_AmandaBelted = false;
var C012_AfterClass_Library_StudyTimeWithAmanda = 0;
var C012_AfterClass_Library_StudyTimeHelpedByAmanda = 0;

// Calculates who's in the library depending on the time of the day
function C012_AfterClass_Library_WhoIsInLibrary() {

	// Sets who's at the library at what time
	C012_AfterClass_Library_AmandaAvail = ((CurrentTime >= 18 * 60 * 60 * 1000) && (CurrentTime <= 21 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Amanda", "Library"));
	C012_AfterClass_Library_EmptyLibrary = (!C012_AfterClass_Library_AmandaAvail);

}

// Chapter 12 After Class - Library Load
function C012_AfterClass_Library_Load() {

	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Library_HasSeduction = (PlayerGetSkillLevel("Seduction") >= 1);
	C012_AfterClass_Library_AmandaBelted = (ActorHasInventory("ChastityBelt"));

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Library_IntroText != "") { OverridenIntroText = C012_AfterClass_Library_IntroText; C012_AfterClass_Library_IntroText = ""; }
	if (C012_AfterClass_Library_CurrentActor != "") ActorLoad(C012_AfterClass_Library_CurrentActor, "");
	if (C012_AfterClass_Library_CurrentStage == 0) C012_AfterClass_Library_WhoIsInLibrary();

	// No leaving from the library
	LeaveIcon = "";
	LeaveScreen = "";
	
}

// Chapter 12 After Class - Library Run
function C012_AfterClass_Library_Run() {
	BuildInteraction(C012_AfterClass_Library_CurrentStage);
	if (CurrentActor != "") DrawActor(CurrentActor, 600, 0, 1);
}

// Chapter 12 After Class - Library Click
function C012_AfterClass_Library_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Library_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Library_IntroText = OverridenIntroText;
		C012_AfterClass_Library_CurrentActor = CurrentActor;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
}

// Chapter 12 After Class - When the player leaves the library
function C012_AfterClass_Library_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Wait for a while and recalculate who's in the library
function C012_AfterClass_Library_Wait() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Library_WhoIsInLibrary();
}

// Chapter 12 After Class - Meet Amanda
function C012_AfterClass_Library_AmandaStart() {

	// Load Amanda data
	ActorLoad("Amanda", "");
	ActorSetCloth("");
	GameLogAdd("Library");
	LeaveIcon = "";
	var Love = ActorGetValue(ActorLove);
	var Sub = ActorGetValue(ActorSubmission);
	
	// If Amanda is dominant and more so than love/hate
	if ((Sub <= -8) && (Math.abs(Sub) >= Math.abs(Love))) {
		ActorSetPose("Domme");
		C012_AfterClass_Library_CurrentStage = 100;
		return;
	}

	// If Amanda is submissive and more so than love/hate
	if ((Sub >= 8) && (Math.abs(Sub) >= Math.abs(Love))) {
		ActorSetPose("Sub");
		C012_AfterClass_Library_CurrentStage = 110;
		return;
	}
	
	// If Amanda hates the player
	if (Love <= -8) {
		ActorSetPose("Hate");
		C012_AfterClass_Library_CurrentStage = 120;
		return;
	}

	// If Amanda loves the player
	if (Love >= 8) {
		ActorSetPose("Love");
		C012_AfterClass_Library_CurrentStage = 130;
		return;
	}
	
	// If Amanda is belted
	if (ActorHasInventory("ChastityBelt")) {
		ActorSetPose("Hate");
		C012_AfterClass_Library_CurrentStage = 140;
		return;
	}
	
	// If Amanda has the egg
	if (ActorHasInventory("VibratingEgg")) {
		ActorSetPose("Sub");
		C012_AfterClass_Library_CurrentStage = 150;
		return;
	}
	
	// If the player was locked in the locker in chapter 10
	if (GameLogQuery("C010_Revenge", "Player", "Locker")) {
		ActorSetPose("Domme");
		C012_AfterClass_Library_CurrentStage = 160;
		return;
	}

	// If Amanda was locked in the locker in chapter 10
	if (GameLogQuery("C010_Revenge", "Amanda", "Locker")) {
		ActorSetPose("Sub");
		C012_AfterClass_Library_CurrentStage = 170;
		return;
	}

	// If the player tied up Mildred in chapter 2
	if (GameLogQuery("C002_FirstClass", "Mildred", "Subdue")) {
		ActorSetPose("Love");
		C012_AfterClass_Library_CurrentStage = 180;
		return;
	}
	
	// No special feelings and conversation
	C012_AfterClass_Library_CurrentStage = 190;

}

// Chapter 12 After Class - Leave Amanda
function C012_AfterClass_Library_AmandaEnd() {
	C012_AfterClass_Library_WhoIsInLibrary();
	CurrentActor = "";
}

// Chapter 12 After Class - When the current actor changes pose
function C012_AfterClass_Library_SetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - When the player leaves with Amanda
function C012_AfterClass_Library_LeaveWithAmanda() {
	CurrentTime = CurrentTime + 290000;
	GameLogAdd("EnterDormFromLibrary");
}

// Chapter 12 After Class - When the player searches, 1 random item can be found
function C012_AfterClass_Library_Search() {
	CurrentTime = CurrentTime + 110000;
	if (!GameLogQuery(CurrentChapter, "Player", "LibraryFindItem")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "LibraryFindItem");
		OverridenIntroText = GetText("FindItem");
		PlayerAddRandomItem();
	}
}
