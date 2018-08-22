var C012_AfterClass_Roommates_CurrentStage = 0;
var C012_AfterClass_Roommates_SidneyAvail = false;
var C012_AfterClass_Roommates_EmptyDorm = true;
var C012_AfterClass_Roommates_IntroText = "";
var C012_AfterClass_Roommates_CurrentActor = "";
var C012_AfterClass_Roommates_ChitChatCount = 0;
var C012_AfterClass_Roommates_ModifierLove = 0;
var C012_AfterClass_Roommates_ModifierSub = 0;
var C012_AfterClass_Roommates_IsolationAvail = true;
var C012_AfterClass_Roommates_IsolationVisit = false;

// Chapter 12 After Class - Roommates Load
function C012_AfterClass_Roommates_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	C012_AfterClass_Roommates_ChitChatCount = 0;
	C012_AfterClass_Roommates_ModifierLove = 0;
	C012_AfterClass_Roommates_ModifierSub = 0;
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Roommates_IsolationAvail = !GameLogQuery(CurrentChapter, "Sarah", "IsolationVisit");
	C012_AfterClass_Roommates_IsolationVisit = GameLogQuery(CurrentChapter, "Sarah", "IsolationVisit")

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Roommates_IntroText != "") { OverridenIntroText = C012_AfterClass_Roommates_IntroText; C012_AfterClass_Roommates_IntroText = ""; }
	if (C012_AfterClass_Roommates_CurrentActor != "") ActorLoad(C012_AfterClass_Roommates_CurrentActor, "");

	// No leaving from the roommates
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Roommates Run - The background changes based on the time of day
function C012_AfterClass_Roommates_Run() {
	BuildInteraction(C012_AfterClass_Roommates_CurrentStage);
	if (CurrentActor != "") {
		if (CurrentTime >= 18.5 * 60 * 60 * 1000) OverridenIntroImage = "KitchenNight.jpg";
		else OverridenIntroImage = "KitchenDay.jpg";
		DrawActor(CurrentActor, 600, 0, 1);
	}
}

// Chapter 12 After Class - Roommates Click
function C012_AfterClass_Roommates_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Roommates_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Roommates_IntroText = OverridenIntroText;
		C012_AfterClass_Roommates_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the roommates
function C012_AfterClass_Roommates_Leave() {
	CurrentTime = CurrentTime + 110000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - A roommate might answer when the player knocks
function C012_AfterClass_Roommates_Knock() {
	
	// Amanda is available after 21:00
	CurrentTime = CurrentTime + 50000;
	if ((CurrentTime >= 21 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromPub") && !GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromRoommates")) {
		OverridenIntroText = "";
		ActorLoad("Amanda", "Dorm");
		LeaveIcon = "";
		if (ActorGetValue(ActorLove) >= 10) ActorSetPose("Happy");
		if (ActorGetValue(ActorLove) <= -10) ActorSetPose("Angry");
		ActorSetCloth("Pajamas");
		C012_AfterClass_Roommates_CurrentStage = 100;
	}

	// Sarah is available before 20:00
	if ((CurrentTime < 20 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Sarah", "EnterDormFromRoommates")) {
		OverridenIntroText = "";
		ActorLoad("Sarah", "Dorm");
		LeaveIcon = "";
		/*if (ActorGetValue(ActorLove) >= 10) ActorSetPose("Happy");
		if (ActorGetValue(ActorLove) <= -10) ActorSetPose("Angry");
		if (ActorGetValue(ActorSubmission) >= 10) ActorSetPose("Shy");
		if (ActorGetValue(ActorSubmission) <= -10) ActorSetPose("Cocky");
		ActorSetCloth("StreetClothes");*/
		C012_AfterClass_Roommates_CurrentStage = 200;
	}
	
}

// Chapter 12 After Class - When the player chit-chats with the actor
function C012_AfterClass_Roommates_ChitChat() {

	// It slowly raises love
	C012_AfterClass_Roommates_ChitChatCount++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_Roommates_ChitChatCount % 5 == 4) ActorChangeAttitude(1, 0);
	
	// Sarah will kick the player out after 20:00
	if ((CurrentTime >= 20 * 60 * 60 * 1000) && (CurrentActor == "Sarah")) {
		OverridenIntroText = GetText("SarahKickOutAfter20");
		C012_AfterClass_Roommates_CurrentStage = 201;
	}
	
}

// Chapter 12 After Class - Tests if Amanda will follow the player to her dorm
function C012_AfterClass_Roommates_TestInviteAmanda() {
	if (ActorGetValue(ActorLove) >= 10) {
		OverridenIntroText = GetText("GoDormLoveAmanda");
		C012_AfterClass_Roommates_CurrentStage = 120;
	}
	if (ActorGetValue(ActorSubmission) >= 10) {
		OverridenIntroText = GetText("GoDormDommeAmanda");
		C012_AfterClass_Roommates_CurrentStage = 120;
	}
}

// Chapter 12 After Class - When the player leaves with Amanda
function C012_AfterClass_Roommates_LeaveWithAmanda() {
	GameLogAdd("EnterDormFromRoommates");
	GameLogAdd("AllowPajamas");
	C012_AfterClass_Roommates_Leave();
}

// Chapter 12 After Class - When the player leaves with Amanda
function C012_AfterClass_Roommates_TestIsolationSarah() {
	if (GameLogQuery(CurrentChapter, "Sarah", "IsolationTalk")) {
		OverridenIntroText = GetText("NoIsolationIntroSarah");
		C012_AfterClass_Roommates_CurrentStage = 210;
	} else GameLogAdd("IsolationTalk");
}

// Chapter 12 After Class - Tests if Sarah will follow the player to her dorm
function C012_AfterClass_Roommates_TestInviteSarah() {
	if (ActorGetValue(ActorLove) >= 10) {
		OverridenIntroText = GetText("GoDormLoveSarah");
		C012_AfterClass_Roommates_CurrentStage = 211;
	}
	if (ActorGetValue(ActorSubmission) >= 10) {
		OverridenIntroText = GetText("GoDormDommeSarah");
		C012_AfterClass_Roommates_CurrentStage = 211;
	}
	if (GameLogQuery(CurrentChapter, "Sarah", "IsolationVisit")) {
		OverridenIntroText = GetText("GoDormIsolationSarah");
		C012_AfterClass_Roommates_CurrentStage = 211;
	}
}

// Chapter 12 After Class - When the player leaves with Sarah
function C012_AfterClass_Roommates_LeaveWithSarah() {
	GameLogAdd("EnterDormFromRoommates");
	C012_AfterClass_Roommates_Leave();
}

// Chapter 12 After Class - When the player leaves with Sarah
function C012_AfterClass_Roommates_EnterIsolation() {
	CurrentTime = CurrentTime + 290000;
	GameLogAdd("IsolationVisit");
	SetScene(CurrentChapter, "Isolation");
}

// Chapter 12 After Class - Sarah might force the player to go to the isolation room
function C012_AfterClass_Roommates_TestRefuseIsolation() {
	if (ActorGetValue(ActorSubmission) <= -10) {
		ActorSetPose("Angry");
		OverridenIntroText = GetText("CannotRefuseIsolation");
		C012_AfterClass_Roommates_CurrentStage = 225;
	}
}