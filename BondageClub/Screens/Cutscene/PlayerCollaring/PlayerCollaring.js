"use strict";
var PlayerCollaringBackground = "Management";
var PlayerCollaringMistress = null;
var PlayerCollaringMistressLeft = null;
var PlayerCollaringMistressRight = null;

// Loads the collaring Mistresses
function PlayerCollaringLoad() {
	CutsceneStage = 0;
	PlayerCollaringMistressLeft = CharacterLoadNPC("NPC_PlayerCollaring_MistressLeft");
	PlayerCollaringMistressRight = CharacterLoadNPC("NPC_PlayerCollaring_MistressRight");
}

// Runs the collaring cutscene
function PlayerCollaringRun() {
	ManagementLoad();
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(PlayerCollaringMistress, 1000, 0, 1);
	DrawCharacter(PlayerCollaringMistressLeft, 0, 0, 1);
	DrawCharacter(PlayerCollaringMistressLeft, 1500, 0, 1);
	for(var S = 0; S <= 8; S++)
		if (CutsceneStage >= S)
			DrawText(TextGet("PlayerCollaring" + S.toString()), 1000, 100 + S * 100, "White", "Black");
}

// When the user clicks in the management room
function PlayerCollaringClick() {
	CutsceneStage++;
	if (CutsceneStage == 2) CharacterNaked(Player);
	if (CutsceneStage == 4) CharacterSetActivePose(Player, "Kneel");
	if (CutsceneStage == 6) InventoryWear(Player, "SlaveCollar", "ItemNeck");
	if (CutsceneStage > 8) {
		CommonSetScreen("Room", "Private");	
		CharacterSetCurrent(PlayerCollaringMistress);
		PlayerCollaringMistress.CurrentDialog = DialogFind(PlayerCollaringMistress, "MistressVow");
	}
}