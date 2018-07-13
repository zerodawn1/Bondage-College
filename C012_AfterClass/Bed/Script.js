var C012_AfterClass_Bed_CurrentStage = 0;
var C012_AfterClass_Bed_PleasureUp = 0;
var C012_AfterClass_Bed_PleasureDown = 0;
var C012_AfterClass_Bed_MasturbationRequired = 0;

// Chapter 12 After Class - Bed Load
function C012_AfterClass_Bed_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Dorm";
	LoadInteractions();
	C012_AfterClass_Bed_CurrentStage = 0;
	C012_AfterClass_Bed_PleasureUp = 0;
	C012_AfterClass_Bed_PleasureDown = 0;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Bed_MasturbationRequired = 2;
	else C012_AfterClass_Bed_MasturbationRequired = 3;
}

// Chapter 12 After Class - Bed Run
function C012_AfterClass_Bed_Run() {
	BuildInteraction(C012_AfterClass_Bed_CurrentStage);
	if (C012_AfterClass_Bed_CurrentStage == 100) { Common_PlayerPose = "LieMasturbate"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if (C012_AfterClass_Bed_CurrentStage == 110) { Common_PlayerPose = "LieMasturbateOrgasm"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if (C012_AfterClass_Bed_CurrentStage == 120) { Common_PlayerPose = "LieMasturbateOrgasm"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
}

// Chapter 12 After Class - Bed Click
function C012_AfterClass_Bed_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Bed_CurrentStage);

}

// Chapter 12 After Class - Fall asleep and ends the chapter
function C012_AfterClass_Bed_EndChapter() {	
	SetScene(CurrentChapter, "Outro");
}

// Chapter 12 After Class - Checks if there's no guest that's not related to the player (love or BDSM)
function C012_AfterClass_Bed_AllRelatedGuest() {
	
	// Loops in all guests to find one that's not related
	for (var G = 0; G < C012_AfterClass_Dorm_Guest.length; G++) {
		ActorLoad(C012_AfterClass_Dorm_Guest[G], "Dorm");
		if (!Common_ActorIsLover && !Common_ActorIsOwner && !Common_ActorIsOwned) {
			CurrentActor = "";		
			return false;			
		}	
	}
	
	// If the player Mistress is around, she might punish her for masturbating
	for (var G = 0; G < C012_AfterClass_Dorm_Guest.length; G++) {
		if (EventRandomChance("Hate") && Common_ActorIsOwner && (CurrentActor == Common_PlayerOwner)) {
			CurrentTime = CurrentTime + 50000;
			C012_AfterClass_Sidney_CurrentStage = 3810;
			SetScene(CurrentChapter, Common_PlayerOwner);
			ActorSetPose("Angry");
			LeaveIcon = "";
			return false;
		}
	}
	
	// No guest found, we allow the player to masturbate
	CurrentActor = ""
	return true;
	
}

// Chapter 12 After Class - Gets in bed to masturbate
function C012_AfterClass_Bed_StartMasturbate() {
	if (!Common_PlayerRestrained) {
		if (C012_AfterClass_Bed_AllRelatedGuest()) {
			if (Common_PlayerNaked) OverridenIntroText = GetText("LayNaked");
			else OverridenIntroText = GetText("StripNaked");
			PlayerClothes("Naked");
			C012_AfterClass_Bed_CurrentStage = 100;
			CurrentTime = CurrentTime + 50000;			
		} else if (CurrentActor == "") OverridenIntroText = GetText("CannotMasturbateWithGuest");
	}
}

// Chapter 12 After Class - Masturbate the upper body (cannot lead to orgasm but helps)
function C012_AfterClass_Bed_MasturbateUp() {
	CurrentTime = CurrentTime + 50000;		
	if (!GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm")) C012_AfterClass_Bed_PleasureUp++;
	else OverridenIntroText = GetText("NotInTheMood");
}

// Chapter 12 After Class - Masturbate the lower body
function C012_AfterClass_Bed_MasturbateDown() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm")) {
		if (Common_PlayerChaste) OverridenIntroText = GetText("Chaste");
		else {
			C012_AfterClass_Bed_PleasureDown++;
			if ((C012_AfterClass_Bed_PleasureUp >= C012_AfterClass_Bed_MasturbationRequired) && (C012_AfterClass_Bed_PleasureDown >= C012_AfterClass_Bed_MasturbationRequired)) {
				C012_AfterClass_Bed_CurrentStage = 110;
				OverridenIntroText = GetText("GettingClose");
			}
		}
	}
	else OverridenIntroText = GetText("NotInTheMood");
}

// Chapter 12 After Class - When the player stops masturbating
function C012_AfterClass_Bed_StopMasturbate() {
	C012_AfterClass_Bed_PleasureUp = 0;
	C012_AfterClass_Bed_PleasureDown = 0;
}

// Chapter 12 After Class - Player climax, it will be possible to masturbate again in 1 hour or 1/2 hour with the egg
function C012_AfterClass_Bed_Climax() {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Bed_PleasureUp = 0;
	C012_AfterClass_Bed_PleasureDown = 0;
	GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);
}
