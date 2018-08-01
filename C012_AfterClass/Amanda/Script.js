var C012_AfterClass_Amanda_CurrentStage = 0;
var C012_AfterClass_Amanda_IntroText = "";
var C012_AfterClass_Amanda_HasEgg = false;
var C012_AfterClass_Amanda_HasBelt = false;
var C012_AfterClass_Amanda_ChatAvail = false;
var C012_AfterClass_Amanda_SpankCount = 0;
var C012_AfterClass_Amanda_EnslaveCount = 0;
var	C012_AfterClass_Amanda_IsGagged = false;
var	C012_AfterClass_Amanda_IsRoped = false;
var	C012_AfterClass_Amanda_IsStrapped = false;
var C012_AfterClass_Amanda_CanMasturbate = false;
var C012_AfterClass_Amanda_PleasurePlayerAvail = false;
var C012_AfterClass_Amanda_SexAvail = false;
var C012_AfterClass_Amanda_PleasurePlayerCount = 0;
var C012_AfterClass_Amanda_PleasurePlayerSpeed = 0;
var C012_AfterClass_Amanda_MasturbateCount = 0;
var C012_AfterClass_Amanda_AllowPajamas = false;
var C012_AfterClass_Amanda_AllowSexAfterDate = false;
var C012_AfterClass_Amanda_SidneyIsOwner = false;

// Amanda can only check her notes if she's dressed
function C012_AfterClass_Amanda_CheckNotes() {
	if ((ActorGetValue(ActorCloth) == "") || (ActorGetValue(ActorCloth) == "Clothed")) ActorSetPose("CheckNotes");
	LeaveIcon = "Leave";
}

// In her shorts, Amanda can have many poses when she talks
function C012_AfterClass_Amanda_SetPose() {
	if (((ActorGetValue(ActorCloth) == "") || (ActorGetValue(ActorCloth) == "Clothed")) && !ActorIsRestrained() && !ActorIsGagged()) {
		var Love = ActorGetValue(ActorLove);
		var Sub = ActorGetValue(ActorSubmission);
		if ((Sub <= -10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Point");
		if ((Sub >= 10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Shy");
		if ((Love >= 10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Love");
		if ((Love <= -10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Angry");
		if (Common_ActorIsOwned) ActorSetPose("Shy");
	} else {
		if ((ActorGetValue(ActorCloth) == "Naked") && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorSubmission) >= 10)) ActorSetPose("Shy");
		if ((ActorGetValue(ActorCloth) == "Pajamas") && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorLove) >= 10)) ActorSetPose("Happy");
		else ActorSetPose("");
	}
}

// Calculate the scene parameters
function C012_AfterClass_Amanda_CalcParams() {
	C012_AfterClass_Amanda_AllowPajamas = GameLogQuery(CurrentChapter, CurrentActor, "AllowPajamas");
	C012_AfterClass_Amanda_HasEgg = ActorHasInventory("VibratingEgg");
	C012_AfterClass_Amanda_HasBelt = ActorHasInventory("ChastityBelt");
	C012_AfterClass_Amanda_IsGagged = ActorIsGagged();	
	C012_AfterClass_Amanda_IsRoped = (ActorHasInventory("Rope") || ActorHasInventory("TwoRopes") || ActorHasInventory("ThreeRopes"));
	C012_AfterClass_Amanda_IsStrapped = ActorHasInventory("Armbinder");
	C012_AfterClass_Amanda_PleasurePlayerAvail = (!Common_PlayerChaste && !ActorIsGagged() && !ActorIsRestrained() && Common_ActorIsOwned && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm"));
	C012_AfterClass_Amanda_SexAvail = (!Common_PlayerRestrained && !Common_PlayerChaste && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm") && !GameLogQuery(CurrentChapter, "Amanda", "NextPossibleOrgasm"));
	C012_AfterClass_Amanda_CanMasturbate = (!Common_PlayerRestrained && !C012_AfterClass_Amanda_HasBelt && (ActorGetValue(ActorCloth) == "Naked"));	
	C012_AfterClass_Amanda_SidneyIsOwner = (Common_PlayerOwner == "Sidney");
	C012_AfterClass_Amanda_SetPose();
}

// Chapter 12 After Class - Amanda Load
function C012_AfterClass_Amanda_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	ActorLoad("Amanda", "Dorm");
	Common_PlayerPose = "";
	
	// Amanda's parameters
	C012_AfterClass_Amanda_CalcParams();	
	C012_AfterClass_Amanda_ChatAvail = !GameLogQuery(CurrentChapter, CurrentActor, "ChatDone");
	C012_AfterClass_Amanda_SpankMaxCount = 10 - Math.floor(ActorGetValue(ActorLove) / 7);
	if (C012_AfterClass_Amanda_SpankMaxCount < 6) C012_AfterClass_Amanda_SpankMaxCount = 6;
	if (C012_AfterClass_Amanda_SpankMaxCount > 12) C012_AfterClass_Amanda_SpankMaxCount = 12;

	// Loads the previous text if needed
	if (C012_AfterClass_Amanda_IntroText != "") {
		OverridenIntroText = C012_AfterClass_Amanda_IntroText;
		C012_AfterClass_Amanda_IntroText = "";
	} else {
		
		// If the player is grounded
		if (GameLogQuery(CurrentChapter, CurrentActor, "EventGrounded") && Common_ActorIsOwner) {
			
			// Skip to the punishment end phase, no talking while being grounded
			C012_AfterClass_Amanda_AllowLeave();
			C012_AfterClass_Amanda_CurrentStage = 3999;
			Common_PlayerPose = "HogtiePunishment";
			OverridenIntroText = GetText("StillGrounded");

		} else {

			// If there's a crossover between two actors
			if ((C012_AfterClass_Amanda_CurrentStage == 0) && !GameLogQuery(CurrentChapter, CurrentActor, "MetSidney") && (C012_AfterClass_Dorm_Guest.indexOf("Sidney") >= 0)) {
				LeaveIcon = "";
				if ((ActorGetValue(ActorCloth) == "") || (ActorGetValue(ActorCloth) == "Clothed")) ActorSetPose("Angry");
				else ActorSetPose("");
				C012_AfterClass_Amanda_CurrentStage = 700;
				GameLogAdd("MetSidney");
			}

			// A random event can be triggered when Amanda is clicked on
			if (C012_AfterClass_Amanda_CurrentStage == 0)
				if ((CurrentText != null) && (Math.floor(Math.random() * 8) == 0)) {
					if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric") && Common_ActorIsOwner)
						C012_AfterClass_Amanda_RandomAmandaDommeEvent();
					if (!GameLogQuery(CurrentChapter, CurrentActor, "AllowPajamas") && (CurrentTime >= 22 * 60 * 60 * 1000) && (C012_AfterClass_Amanda_CurrentStage == 0) && !Common_PlayerGagged && !Common_PlayerRestrained && !ActorIsRestrained() && !ActorIsGagged()) {
						C012_AfterClass_Amanda_CurrentStage = 660;
						LeaveIcon = "";
					}
					if (GameLogQuery(CurrentChapter, CurrentActor, "AllowPajamas") && (C012_AfterClass_Amanda_CurrentStage == 0) && Common_ActorIsOwner && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorCloth) != "Pajamas")) {
						C012_AfterClass_Amanda_CurrentStage = 670;
						LeaveIcon = "";
					}
				}

		}

	}

}

// Chapter 12 After Class - Amanda Run
function C012_AfterClass_Amanda_Run() {

	// Build the regular interactions
	BuildInteraction(C012_AfterClass_Amanda_CurrentStage);
	
	// Draw the actor alone or with the player depending on the stage
	if ((C012_AfterClass_Amanda_CurrentStage != 410) && (C012_AfterClass_Amanda_CurrentStage != 3931) && (C012_AfterClass_Amanda_CurrentStage != 3932) && (C012_AfterClass_Amanda_CurrentStage != 3933) && (C012_AfterClass_Amanda_CurrentStage != 632) && (C012_AfterClass_Amanda_CurrentStage != 633) && (C012_AfterClass_Amanda_CurrentStage != 634) && (C012_AfterClass_Amanda_CurrentStage != 791)) {
		if (((C012_AfterClass_Amanda_CurrentStage >= 3090) && (C012_AfterClass_Amanda_CurrentStage <= 3099)) || ((C012_AfterClass_Amanda_CurrentStage >= 3901) && (C012_AfterClass_Amanda_CurrentStage <= 3999))) {
			DrawActor("Player", 475, 0, 1);
			DrawActor(CurrentActor, 750, 0, 1);
		} else {
			DrawInteractionActor();
			if ((C012_AfterClass_Amanda_CurrentStage >= 340) && (C012_AfterClass_Amanda_CurrentStage < 400)) DrawActor("Player", 600, 100, 1);		
		}		
	}
	
}

// Chapter 12 After Class - Amanda Click
function C012_AfterClass_Amanda_Click() {

	// Regular interactions
	ClickInteraction(C012_AfterClass_Amanda_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if ((ClickInv == "Player") && (LeaveIcon == "Leave")) {
		C012_AfterClass_Amanda_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
	// Amanda can be restrained on stage 0 and 10
	if ((C012_AfterClass_Amanda_CurrentStage <= 10) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {
		
		// Amanda becomes more submissive from the crop
		if (ClickInv == "Crop") {
			if (ActorIsGagged()) OverridenIntroText = GetText("CropWhileGagged");
			else if (Common_ActorIsOwned) OverridenIntroText = GetText("CropFromMistress");
			else OverridenIntroText = GetText("Crop");
			if (!GameLogQuery(CurrentChapter, CurrentActor, "CropDone")) {
				ActorChangeAttitude(0, 1);
				GameLogAdd("CropDone");
			}
			CurrentTime = CurrentTime + 50000;
			return;
		}

		// Amanda will turn the tables on the player if -5 submission or less
		if ((ActorGetValue(ActorSubmission) <= -5) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			PlayerRandomRestrain();
			if (Common_PlayerRestrained) {
				PlayerRandomGag();
				if (Common_ActorIsOwner) {
					EventSetGenericTimer();
					OverridenIntroText = GetText("TurnTablesFromMistress");
				}
				else OverridenIntroText = GetText("TurnTables");
				CurrentTime = CurrentTime + 50000;
			} else OverridenIntroText = GetText("RefuseBondage");
			return;
		}

		// Amanda will refuse any bondage if 4 submission or less
		if ((ActorGetValue(ActorSubmission) < 5) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			OverridenIntroText = GetText("RefuseBondage");
			return;
		}
		
		// Amanda can only wear the belt if she's naked
		if (!ActorIsChaste() && (ActorGetValue(ActorCloth) != "Naked") && (ClickInv == "ChastityBelt")) {
			OverridenIntroText = GetText("NakedForBelt");
			return;
		}

		// A second rope can be applied if Amanda isn't fully clothed
		if ((ActorGetValue(ActorCloth) != "Naked") && (ActorGetValue(ActorCloth) != "Underwear") && (ActorGetValue(ActorCloth) != "Pajamas") && (ClickInv == "Rope") && (ActorHasInventory("Rope"))) {
			OverridenIntroText = GetText("StripForSecondRope");
			return;
		}
		
		// Apply the clicked restrain
		ActorApplyRestrain(ClickInv);
		C012_AfterClass_Amanda_CalcParams();

	}	

}

// Chapter 12 After Class - Amanda can make love with the player if (Love + seduction * 2) >= 12 or >= 25 on the next time or Amanda is the player girlfriend/submissive
function C012_AfterClass_Amanda_GaggedAnswer() {
	if (ActorIsGagged()) {
		var GagTalk = Math.floor(Math.random() * 8) + 1;
		OverridenIntroText = GetText("GaggedAnswer" + GagTalk.toString());		
	}
}

// Chapter 12 After Class - Amanda can make love with the player if (Love + seduction * 2) >= 12 on the next time or Amanda is the player girlfriend/submissive
function C012_AfterClass_Amanda_TestSex() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) {
			if (!ActorIsChaste()) {
				var LoveChance = ActorGetValue(ActorLove) + PlayerGetSkillLevel("Seduction") * 2;
				if ((LoveChance >= 12) || Common_ActorIsLover || Common_ActorIsOwned) {
					C012_AfterClass_Amanda_CurrentStage = 650;
					OverridenIntroText = "";
				}
			} else OverridenIntroText = GetText("UnlockBeltBeforeSex");
		} else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Amanda_GaggedAnswer();
}

// Chapter 12 After Class - Amanda can be dated at +20 love
function C012_AfterClass_Amanda_TestLove() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained() && !Common_PlayerRestrained) {
			if (!Common_PlayerNaked && (ActorGetValue(ActorCloth) != "Naked")) {
				if (ActorGetValue(ActorLove) >= 20) {
					ActorSetPose("");
					C012_AfterClass_Amanda_CurrentStage = 100;
					OverridenIntroText = "";
				}
			} else OverridenIntroText = GetText("CantDateWhileNaked");
		} else OverridenIntroText = GetText("CantDateWhileRestrained");
	} else C012_AfterClass_Amanda_GaggedAnswer();
}

// Chapter 12 After Class - Amanda can be dominated at +20 submission
function C012_AfterClass_Amanda_TestDomme() {
	if (PlayerHasInventory("Collar")) {
		if (!ActorIsGagged()) {
			if (ActorGetValue(ActorSubmission) >= 20) {
				if (!GameLogQuery(CurrentChapter, CurrentActor, "EnslaveDone")) {
					if (ActorIsRestrained()) C012_AfterClass_Amanda_EnslaveCount = 1;
					else C012_AfterClass_Amanda_EnslaveCount = 0;
					C012_AfterClass_Amanda_CurrentStage = 200;
					OverridenIntroText = "";
					LeaveIcon = "";
					GameLogAdd("EnslaveDone");
				} else OverridenIntroText = GetText("EnslaveAlreadyTried");
			}
		} else C012_AfterClass_Amanda_GaggedAnswer();
	} else OverridenIntroText = GetText("CollarToEnslave");
}

// Chapter 12 After Class - Amanda can become the player Mistress at -20 submission
function C012_AfterClass_Amanda_TestSub() {
	if (!ActorIsGagged()) {
		if (ActorGetValue(ActorSubmission) <= -20) {
			C012_AfterClass_Amanda_CurrentStage = 300;
			OverridenIntroText = "";
		}
	} else C012_AfterClass_Amanda_GaggedAnswer();
}

// Chapter 12 After Class - Tests if the player can submit (no restrains first)
function C012_AfterClass_Amanda_TestSubmit() {
	if (Common_PlayerOwner != "") {
		OverridenIntroText = GetText("AlreadyOwned");
	} else {
		if (ActorIsRestrained()) {
			OverridenIntroText = GetText("UnrestrainFirst");
		} else {
			if (ActorIsChaste()) {
				OverridenIntroText = GetText("UnchasteFirst");
			} else {
				if (PlayerHasLockedInventory("Collar")) {
					OverridenIntroText = GetText("PlayerUncollarFirst");					
				} else {					
					if (Common_PlayerRestrained) {
						OverridenIntroText = GetText("PlayerUnrestrainFirst");
					} else {
						if (Common_PlayerNaked) {
							OverridenIntroText = GetText("GetOnYourKnees");
							C012_AfterClass_Amanda_PlayerStrip();
							C012_AfterClass_Amanda_CurrentStage = 340;
						} else {
							C012_AfterClass_Amanda_CurrentStage = 330;						
						}
					}					
				}
			}
		}
	}
}

// Chapter 12 After Class - The player can strip for Amanda
function C012_AfterClass_Amanda_PlayerStrip() {
	ActorSetPose("");
	PlayerClothes("Naked");
	Common_PlayerPose = "BackShy";
}

// Chapter 12 After Class - The player can strip for Amanda
function C012_AfterClass_Amanda_SetPlayerPose(NewPose) {
	Common_PlayerPose = NewPose;
}

// Chapter 12 After Class - When the player gets collared
function C012_AfterClass_Amanda_PlayerCollared() {
	LeaveIcon = "";
	Common_PlayerOwner = CurrentActor;
	Common_ActorIsOwner = true;
	PlayerLockInventory("Collar");
	CurrentTime = CurrentTime + 50000;
	EventSetGenericTimer();
}

// Chapter 12 After Class - When the player gets collared
function C012_AfterClass_Amanda_PlayerStandUp() {
	Common_PlayerPose = "";
	if ((ActorGetValue(ActorCloth) != "") && (ActorGetValue(ActorCloth) != "Clothed")) {
		ActorSetCloth("");
		OverridenIntroText = GetText("ChangeAfterCollaring");
	}
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - The player can trigger a random Domme event from Amanda (3000 events)
function C012_AfterClass_Amanda_RandomAmandaDommeEvent() {
	
	// Makes sure the next random event can be triggered
	if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric")) {

		// 1 event per 15 minutes maximum, the event is random and drawn from the Mistress pool
		EventSetGenericTimer();
		C012_AfterClass_Amanda_CurrentStage = EventRandomPlayerSubmissive();

	}

	// If Amanda doesn't respond, she checks her notes
	if (C012_AfterClass_Amanda_CurrentStage == 0) C012_AfterClass_Amanda_CheckNotes();
	
}

// Chapter 12 After Class - As a Domme, Amanda can force the player to change
function C012_AfterClass_Amanda_ForceChangePlayer(NewCloth) {
	PlayerClothes(NewCloth);
	if (C012_AfterClass_Amanda_CurrentStage < 3900) ActorSetPose("Happy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - As a Domme, Amanda can force the player into some random bondage
function C012_AfterClass_Amanda_ForceRandomBondage(BondageType) {
	if ((BondageType == "Full") || (BondageType == "Gag")) {
		PlayerRandomGag();
		if (!Common_PlayerGagged) OverridenIntroText = GetText("CantFindRestrain");
	}
	if ((BondageType == "Full") || (BondageType == "Restrain")) {
		PlayerRandomRestrain();
		if (!Common_PlayerRestrained) OverridenIntroText = GetText("CantFindRestrain");
	}
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Amanda can unbind the player on some events
function C012_AfterClass_Amanda_TestUnbind() {

	// Before the next event time, she will always refuse (skip is owned)
	if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric") || Common_ActorIsOwned) {
		
		// Check if the event succeeds randomly (skip is owned)
		if (EventRandomChance("Love") || Common_ActorIsOwned) {
			
			// Can only release if not restrained
			if (!ActorIsRestrained()) {
				if (ActorIsGagged()) OverridenIntroText = GetText("ReleasePlayerGagged");
				else OverridenIntroText = GetText("ReleasePlayer");				
				PlayerReleaseBondage();
				CurrentTime = CurrentTime + 50000;
			} else OverridenIntroText = GetText("CannotReleasePlayer");
			
		} else EventSetGenericTimer();
		
	}
	
}

// Chapter 12 After Class - When the player disobey, she can get punished
function C012_AfterClass_Amanda_DoActivity(ActivityType, Enjoyment, BonusStage) {
	
	// Launch the activity, some can have a bonus stage
	C012_AfterClass_Amanda_CurrentStage = EventDoActivity(ActivityType, Enjoyment, C012_AfterClass_Amanda_CurrentStage, 3290, BonusStage);

}

// Chapter 12 After Class - When the player disobey, she can get punished
function C012_AfterClass_Amanda_TestPunish() {

	// The more love, the less chances the player will be punished
	if (EventRandomChance("Love")) {
		C012_AfterClass_Amanda_CheckNotes();
	} else {
		ActorSetPose("Angry");
		OverridenIntroText = "";
		C012_AfterClass_Amanda_CurrentStage = 3900;
	}

}

// Chapter 12 After Class - Allows the player to leave the scene
function C012_AfterClass_Amanda_AllowLeave() {
	C012_AfterClass_Amanda_CheckNotes();
}

// Chapter 12 After Class - Amanda can confiscate the player keys
function C012_AfterClass_Amanda_ConfiscateKeys() {
	PlayerRemoveInventory("CuffsKey", 99);
	GameLogAdd("HasCuffsKey");
	C012_AfterClass_Amanda_AllowLeave();
}

// Chapter 12 After Class - Amanda can confiscate the player crop(s)
function C012_AfterClass_Amanda_ConfiscateCrop() {
	PlayerRemoveInventory("Crop", 99);
	GameLogAdd("HasCrop");
	C012_AfterClass_Amanda_AllowLeave();
}

// Chapter 12 After Class - Amanda can confiscate the player keys
function C012_AfterClass_Amanda_BegForOrgasm() {
	
	// If the player begs for it, Amanda will do it randomly based on love, if not it's based on hate
	if (EventRandomChance("Love")) {
		ActorAddOrgasm();
		EventLogEnd();
		OverridenIntroText = GetText("MasturbatePlayerOrgasm");
		C012_AfterClass_Amanda_CurrentStage = 3223;
	}

}

// Chapter 12 After Class - Amanda will tell the player if she can change clothes or not
function C012_AfterClass_Amanda_IsChangingBlocked() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "EventBlockChanging"))
		OverridenIntroText = GetText("ChangingIsBlocked");
}

// Chapter 12 After Class - Amanda will tell the player if she can change clothes or not
function C012_AfterClass_Amanda_TestBlockChanging() {
	
	// The less love, the higher the chances Amanda will block changing
	if (EventRandomChance("Hate")) {
		OverridenIntroText = "";
		GameLogAddTimer("EventBlockChanging", CurrentTime + 1000000 + Math.floor(Math.random() * 10000000));
		C012_AfterClass_Amanda_CurrentStage = 3091;
	} else C012_AfterClass_Amanda_AllowLeave();

}

// Chapter 12 After Class - Amanda will tell the player if she can change clothes or not
function C012_AfterClass_Amanda_ReleaseBeforePunish() {
	ActorSetPose("ReadyToPunish");
	if (Common_PlayerRestrained || Common_PlayerGagged) {
		if (Common_PlayerNaked) {
			C012_AfterClass_Amanda_CurrentStage = 3903;		
			OverridenIntroText = GetText("ReleaseBeforePunishAlreadyNaked");
		}
		else OverridenIntroText = GetText("ReleaseBeforePunishNotNaked");
		PlayerReleaseBondage();
		CurrentTime = CurrentTime + 50000;
	} else {
		if (Common_PlayerNaked) {
			C012_AfterClass_Amanda_CurrentStage = 3903;		
			OverridenIntroText = GetText("PunishSinceNaked");
		}		
	}
}

// Chapter 12 After Class - Set Amanda Pose
function C012_AfterClass_Amanda_ActorSetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - Starts the punishment
function C012_AfterClass_Amanda_StartPunishment() {
	C012_AfterClass_Amanda_CurrentStage = EventRandomPlayerPunishment();
}

// Chapter 12 After Class - Amanda can tie up the player with her own rope
function C012_AfterClass_Amanda_RopePlayer() {
	PlayerLockInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Amanda can gag the player with her stuff
function C012_AfterClass_Amanda_GagPlayer() {
	PlayerRandomGag();
	if (!Common_PlayerGagged) PlayerLockInventory("ClothGag");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Amanda can use the egg on the player
function C012_AfterClass_Amanda_InsertEgg() {
	PlayerLockInventory("VibratingEgg");
	PlayerRemoveInventory("VibratingEgg", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Ends the punishment and sets the duration between 30 minutes and 1.5 hours
function C012_AfterClass_Amanda_EndPunishment(PunishmentType) {
	GameLogAddTimer("Event" + PunishmentType, CurrentTime + 1800000 + Math.floor(Math.random() * 3600000));
	EventSetGenericTimer();
	C012_AfterClass_Amanda_AllowLeave();
}

// Chapter 12 After Class - Ends any bondage and resets the pose
function C012_AfterClass_Amanda_ReleasePlayer() {
	Common_PlayerPose = "";
	EventSetGenericTimer();
	PlayerReleaseBondage();
	C012_AfterClass_Amanda_AllowLeave();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Flags the chat as done and doesn't allow the player to leave
function C012_AfterClass_Amanda_StartChat() {
	if (!ActorIsGagged()) {
		ActorSetPose("");
		GameLogAdd("ChatDone");
		LeaveIcon = "";
		C012_AfterClass_Amanda_ChatAvail = false;
	} else C012_AfterClass_Amanda_GaggedAnswer();
}

// Chapter 12 After Class - Ends the chat with Amanda
function C012_AfterClass_Amanda_EndChat() {
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - When Amanda locks the belt on the player
function C012_AfterClass_Amanda_LockChastityBelt() {
	PlayerLockInventory("ChastityBelt");
	PlayerRemoveInventory("ChastityBelt", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Amanda spanks the player
function C012_AfterClass_Amanda_AmandaSpankPlayer() {
	C012_AfterClass_Amanda_SpankCount++;
	if (C012_AfterClass_Amanda_SpankCount > C012_AfterClass_Amanda_SpankMaxCount) {
		C012_AfterClass_Amanda_CurrentStage = 3933;
		OverridenIntroText = "";
		OverridenIntroImage = "";
	} else {
		OverridenIntroText = GetText("SpankPlayer" + C012_AfterClass_Amanda_SpankCount.toString());
		var Img = (C012_AfterClass_Amanda_SpankCount % 2).toString();
		if ((C012_AfterClass_Amanda_SpankCount < 5) && !Common_PlayerChaste) OverridenIntroImage = "AmandaSpankPlayer" + Img + ".jpg";
		if ((C012_AfterClass_Amanda_SpankCount >= 5) && !Common_PlayerChaste) OverridenIntroImage = "AmandaSpankPlayerRedButt" + Img + ".jpg";
		if ((C012_AfterClass_Amanda_SpankCount < 5) && Common_PlayerChaste) OverridenIntroImage = "AmandaSpankPlayerChastity" + Img + ".jpg";
		if ((C012_AfterClass_Amanda_SpankCount >= 5) && Common_PlayerChaste) OverridenIntroImage = "AmandaSpankPlayerChastityRedButt" + Img + ".jpg";
	}
}

// Chapter 12 After Class - The player can ask Amanda to change clothes
function C012_AfterClass_Amanda_TestChange() {
	if (!ActorIsRestrained()) {
		if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10) || Common_ActorIsOwned || Common_ActorIsLover) {
			if (Common_ActorIsOwned) OverridenIntroText = GetText("AcceptChangeFromMistress");
			else 
				if (Common_ActorIsLover) OverridenIntroText = GetText("AcceptChangeFromLover");
				else OverridenIntroText = GetText("AcceptChange");
			C012_AfterClass_Amanda_CurrentStage = 600;
		}
		C012_AfterClass_Amanda_GaggedAnswer();
	} else OverridenIntroText = GetText("CannotActWhileRestrained");
}

// Chapter 12 After Class - Amanda can change clothes when the player asks for it
function C012_AfterClass_Amanda_ForceChangeActor(NewCloth) {
	if (ActorGetValue(ActorCloth) != NewCloth) {
		ActorSetCloth(NewCloth);
		C012_AfterClass_Amanda_CalcParams();
		CurrentTime = CurrentTime + 50000;
	} else OverridenIntroText = GetText("NoNeedToChange");
	C012_AfterClass_Amanda_GaggedAnswer();
}

// Chapter 12 After Class - Increases the slavery count for Amanda, 5 is required to collar her
function C012_AfterClass_Amanda_EnslaveAmandaCount() {
	C012_AfterClass_Amanda_EnslaveCount++;
}

// Chapter 12 After Class - Check if Amanda wants to be collared, 5 counts are required
function C012_AfterClass_Amanda_TestEnslaveAmanda() {
	if (C012_AfterClass_Amanda_EnslaveCount >= 5) {
		if (ActorIsRestrained()) C012_AfterClass_Amanda_CurrentStage = 285;
		else if (ActorGetValue(ActorCloth) == "Naked") { C012_AfterClass_Amanda_CurrentStage = 291; ActorSetPose("Shy"); }
		else C012_AfterClass_Amanda_CurrentStage = 290;
		OverridenIntroText = GetText("AcceptCollar");
	} else LeaveIcon = "";
}

// Chapter 12 After Class - When the player gives up on enslaving Amanda
function C012_AfterClass_Amanda_EndEnslaveAmanda() {
	C012_AfterClass_Amanda_CalcParams();
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Release Amanda from any restrain before her collaring
function C012_AfterClass_Amanda_EnslaveRelease() {
	ActorUntie();
	if (ActorHasInventory("Cuffs")) { PlayerAddInventory("Cuffs", 1); ActorRemoveInventory("Cuffs"); }
	if (ActorGetValue(ActorCloth) == "Naked") {
		C012_AfterClass_Amanda_CurrentStage = 291;
		ActorSetPose("Shy");
	}
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Amanda gets naked for her collaring
function C012_AfterClass_Amanda_EnslaveStrip() {
	ActorSetCloth("Naked");
	ActorSetPose("Shy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Amanda can be ungagged
function C012_AfterClass_Amanda_Ungag() {
	ActorUngag();
	C012_AfterClass_Amanda_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Amanda can be untied
function C012_AfterClass_Amanda_Untie() {
	ActorUntie();
	C012_AfterClass_Amanda_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Amanda gets collared
function C012_AfterClass_Amanda_LockCollarAmanda() {
	ActorSetOwner("Player");
	PlayerRemoveInventory("Collar", 1);
	C012_AfterClass_Amanda_CalcParams();
	ActorSetPose("Kneel");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - The player can decide how Amanda will spend her evening
function C012_AfterClass_Amanda_SetCurfew(CurfewType) {
	GameLogAddTimer("CurfewStay", -1);
	GameLogAddTimer("Curfew22", -1);
	GameLogAddTimer("Curfew24", -1);
	GameLogAddTimer("CurfewNone", -1);
	GameLogAdd("Curfew" + CurfewType);
}

// Chapter 12 After Class - The player can decide how Amanda will spend her evening
function C012_AfterClass_Amanda_BackToDorm() {
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Many parts of Amanda interactions are not accessible if she's gagged
function C012_AfterClass_Amanda_TestGagged() {
	if (C012_AfterClass_Amanda_IsGagged) {
		C012_AfterClass_Amanda_GaggedAnswer();
		C012_AfterClass_Amanda_CurrentStage = 0;
	}
}

// Chapter 12 After Class - Starts the pleasure player scene
function C012_AfterClass_Amanda_TestPleasurePlayer() {
	LeaveIcon = "";
	if (ActorGetValue(ActorCloth) == "Naked") C012_AfterClass_Amanda_CurrentStage = 631;
}

// Chapter 12 After Class - When Amanda starts pleasuring the player (starts to count at 2 with a vibrating egg)
function C012_AfterClass_Amanda_StartPleasurePlayer() {
	PlayerClothes("Naked");
	if (ActorIsChaste()) OverridenIntroImage = "AmandaPleasurePlayerChastity.jpg";
	else OverridenIntroImage = "AmandaPleasurePlayer.jpg";
	CurrentTime = CurrentTime + 50000;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Amanda_PleasurePlayerCount = 2;
	else C012_AfterClass_Amanda_PleasurePlayerCount = 0;
	C012_AfterClass_Amanda_PleasurePlayerSpeed = 0;
}

// Chapter 12 After Class - When Amanda pleasures the player
function C012_AfterClass_Amanda_PleasurePlayer() {
	
	// The more it progresses, the faster Amanda must go
	CurrentTime = CurrentTime + 50000;
	var StartCount = C012_AfterClass_Amanda_PleasurePlayerCount;
	if ((C012_AfterClass_Amanda_PleasurePlayerCount >= 0) && (C012_AfterClass_Amanda_PleasurePlayerCount <= 1) && (C012_AfterClass_Amanda_PleasurePlayerSpeed == 0)) C012_AfterClass_Amanda_PleasurePlayerCount++;
	if ((C012_AfterClass_Amanda_PleasurePlayerCount >= 2) && (C012_AfterClass_Amanda_PleasurePlayerCount <= 3) && (C012_AfterClass_Amanda_PleasurePlayerSpeed == 1)) C012_AfterClass_Amanda_PleasurePlayerCount++;
	if ((C012_AfterClass_Amanda_PleasurePlayerCount >= 4) && (C012_AfterClass_Amanda_PleasurePlayerCount <= 9) && (C012_AfterClass_Amanda_PleasurePlayerSpeed == 2)) C012_AfterClass_Amanda_PleasurePlayerCount++;
	
	// At 6 counts, an orgasm is achieved, the next one will be slower
	if (C012_AfterClass_Amanda_PleasurePlayerCount >= 6) {
		OverridenIntroText = GetText("OrgasmFromAmandaPleasure");
		ActorAddOrgasm();
		GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);
		if (ActorIsChaste()) OverridenIntroImage = "AmandaPleasurePlayerChastityOrgasm.jpg";
		else OverridenIntroImage = "AmandaPleasurePlayerOrgasm.jpg";
		C012_AfterClass_Amanda_CurrentStage = 634;
		C012_AfterClass_Amanda_PleasurePlayerCount = 0;
		C012_AfterClass_Amanda_PleasurePlayerSpeed = 0;
	} else {
		if (StartCount == C012_AfterClass_Amanda_PleasurePlayerCount) OverridenIntroText = GetText("PleasureFromAmandaNoProgress");
	}
	
}

// Chapter 12 After Class - When Amanda pleasures the player and is forced in a new position or speed
function C012_AfterClass_Amanda_PleasurePlayerSetSpeed(SpeedFactor) {
	C012_AfterClass_Amanda_PleasurePlayerSpeed = C012_AfterClass_Amanda_PleasurePlayerSpeed + SpeedFactor;
	if (C012_AfterClass_Amanda_PleasurePlayerSpeed < 0) C012_AfterClass_Amanda_PleasurePlayerSpeed = 0;
	if (C012_AfterClass_Amanda_PleasurePlayerSpeed > 2) C012_AfterClass_Amanda_PleasurePlayerSpeed = 2;
}

// Chapter 12 After Class - When Amanda stops pleasuring the player
function C012_AfterClass_Amanda_StopPleasureFromAmanda() {
	OverridenIntroImage = "";
}

// Chapter 12 After Class - When Amanda pleasures for the player ends
function C012_AfterClass_Amanda_EndPleasureFromAmanda(LoveFactor, SubFactor) {
	if (!GameLogQuery(CurrentChapter, CurrentActor, "PleasureFromAmanda")) {
		GameLogAdd("PleasureFromAmanda");
		ActorChangeAttitude(LoveFactor, SubFactor);
	}
	C012_AfterClass_Amanda_EndEnslaveAmanda();
}

// Chapter 12 After Class - When the player kisses Amanda
function C012_AfterClass_Amanda_Kiss() {
	CurrentTime = CurrentTime + 50000;	
	if (Common_ActorIsOwner) OverridenIntroText = GetText("KissAmandaOwner");
	else if (C012_AfterClass_Amanda_IsGagged) OverridenIntroText = GetText("KissAmandaGagged");
	else if (!GameLogQuery(CurrentChapter, CurrentActor, "Kiss")) {
		GameLogAdd("Kiss");
		if (PlayerGetSkillLevel("Seduction") > 0) {
			ActorChangeAttitude(PlayerGetSkillLevel("Seduction"), 0);
			OverridenIntroText = GetText("KissAmandaSeduction");
		}
	}
}

// Chapter 12 After Class - When the player spanks Amanda, with the fighting skill it can affect her submission level
function C012_AfterClass_Amanda_Spank() {
	CurrentTime = CurrentTime + 50000;
	if (PlayerGetSkillLevel("Fighting") > 0) {
		OverridenIntroText = GetText("SpankWithStrength");
		if (!GameLogQuery(CurrentChapter, CurrentActor, "Spank")) {
			GameLogAdd("Spank");
			ActorChangeAttitude(0, PlayerGetSkillLevel("Fighting"));
		}
	}
}

// Chapter 12 After Class - When the player tickles Amanda, it doesn't affect her
function C012_AfterClass_Amanda_Tickle() {
	if ((Common_ActorIsOwner || (ActorGetValue(ActorSubmission) <= -5)) && !ActorIsRestrained()) OverridenIntroText = GetText("DoubleTickling");
	else CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When the player starts to masturbate Amanda
function C012_AfterClass_Amanda_StartMasturbate() {
	if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10) || (ActorIsRestrained())) {
		CurrentTime = CurrentTime + 50000;
		if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
			C012_AfterClass_Amanda_MasturbateCount = 0;
			C012_AfterClass_Amanda_CurrentStage = 640;
			OverridenIntroText = GetText("StartMasturbateAmanda");
			LeaveIcon = "";
			if (!ActorIsGagged() && !ActorIsRestrained()) ActorSetPose("StandPleasure");
		} else OverridenIntroText = GetText("MasturbateNotInTheMood");
	}
}

// Chapter 12 After Class - When the player masturbates Amanda
function C012_AfterClass_Amanda_Masturbate(Factor) {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Amanda_MasturbateCount = C012_AfterClass_Amanda_MasturbateCount + Factor;
	if (C012_AfterClass_Amanda_MasturbateCount < 0) C012_AfterClass_Amanda_MasturbateCount = 0;
	if (C012_AfterClass_Amanda_MasturbateCount >= 5) {
		C012_AfterClass_Amanda_CurrentStage = 641;
		OverridenIntroText = GetText("ReadyForOrgasm");
	}
}

// Chapter 12 After Class - When Amanda is masturbated to an orgasm
function C012_AfterClass_Amanda_AmandaOrgasm() {
	CurrentTime = CurrentTime + 50000;
	ActorAddOrgasm();
	if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
		GameLogSpecificAddTimer(CurrentChapter, CurrentActor, "NextPossibleOrgasm", ActorHasInventory("VibratingEgg") ? CurrentTime + 3600000 : CurrentTime + 7200000);
		ActorChangeAttitude(2, -1);
	}
}

// Chapter 12 After Class - When Amanda is masturbated to an orgasm
function C012_AfterClass_Amanda_AmandaDeniedOrgasm() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, CurrentActor, "OrgasmDeniedFromMasturbation")) {
		GameLogAdd("OrgasmDeniedFromMasturbation");
		ActorChangeAttitude(-2, 1);
	}
	C012_AfterClass_Amanda_EndEnslaveAmanda();
}

// Chapter 12 After Class - Tests if the player is already dating someone else
function C012_AfterClass_Amanda_TestRelationship() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "LoverBreakUp")) {
		OverridenIntroText = GetText("AlreadyBrokeUp");
		C012_AfterClass_Amanda_CurrentStage = 0;
	} else {
		if (Common_PlayerLover != "") {
			OverridenIntroText = GetText("AlreadyLoved");
			C012_AfterClass_Amanda_CurrentStage = 105;
		}
	}
}

// Chapter 12 After Class - Start Dating Amanda
function C012_AfterClass_Amanda_StartDating() {
	CurrentTime = CurrentTime + 50000;
	Common_PlayerLover = "Amanda";
	Common_ActorIsLover = true;
	C012_AfterClass_Amanda_AllowSexAfterDate = (!Common_PlayerChaste && !ActorIsChaste());
}

// Chapter 12 After Class - Start Dating Amanda
function C012_AfterClass_Amanda_BothNaked() {
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Amanda_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Get in bed with Amanda to make love
function C012_AfterClass_Amanda_MakeLove() {
	CurrentTime = CurrentTime + 50000;
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Bed_Partner = "Amanda";
	SetScene(CurrentChapter, "Bed");
}

// Chapter 12 After Class - Test if the player can start the break up dialog
function C012_AfterClass_Amanda_TestTalkBreakUp() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) C012_AfterClass_Amanda_CurrentStage = 190;
		else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Amanda_GaggedAnswer();	
}

// Chapter 12 After Class - When the player breaks up with Amanda
function C012_AfterClass_Amanda_BreakUp() {
	GameLogAdd("LoverBreakUp");
	Common_PlayerLover = "";
	Common_ActorIsLover = false;
	ActorSetPose("");
	LeaveIcon = "";
}

// Chapter 12 After Class - When Amanda leaves the room after the break up
function C012_AfterClass_Amanda_AmandaLeave() {
	CurrentActor = "";
	LeaveIcon = "Leave";
	C012_AfterClass_Dorm_Guest.splice("Amanda");
}

// Chapter 12 After Class - When Amanda go get her pajamas
function C012_AfterClass_Amanda_FetchPajamas() {
	GameLogAdd("AllowPajamas");
	CurrentTime = CurrentTime + 110000;
	ActorSetCloth("Pajamas");
	ActorSetPose("Happy");
	C012_AfterClass_Amanda_AllowPajamas = true;
}

// Chapter 12 After Class - When Amanda forces the player to kick someone out
function C012_AfterClass_Amanda_KickActor(KickedActor) {
	if (KickedActor == "Sidney") C012_AfterClass_Sidney_CurrentStage = 790;
	SetScene(CurrentChapter, KickedActor);
}

// Chapter 12 After Class - When Amanda is kicked for another actor
function C012_AfterClass_Amanda_KickForActor(KickedForActor) {
	ActorSpecificChangeAttitude(KickedForActor, 2, 1);
}

// Chapter 12 After Class - When Amanda is kicked out, it can destroy the players couple
function C012_AfterClass_Amanda_KickedOut() {
	GameLogAdd("KickedOutFromDorm");
	if (CurrentActor == Common_PlayerLover) {
		ActorChangeAttitude(-5, 0);
		C012_AfterClass_Amanda_BreakUp();
	}
	CurrentActor = "";
}
