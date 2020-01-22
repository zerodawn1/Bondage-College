"use strict";

// Loads the item extension properties
function InventoryItemArmsHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemArmsHempRopeDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible positions and their requirements
	DrawText(DialogFind(Player, "SelectBondagePosition"), 1500, 500, "white", "gray");
	DrawButton(1050, 550, 225, 225, "", (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/BoxTie.png", 1050, 550);
	DrawText(DialogFind(Player, "RopeBondageBoxTie"), 1163, 800, "white", "gray");
	DrawText(DialogFind(Player, "NoRequirement"), 1163, 850, "white", "gray");
	DrawButton(1387, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Hogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Hogtied.png", 1387, 550);
	DrawText(DialogFind(Player, "RopeBondageHogtied"), 1500, 800, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1500, 850, "white", "gray");
	DrawButton(1725, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "SuspensionHogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 8) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/SuspensionHogtied.png", 1725, 550);
	DrawText(DialogFind(Player, "RopeBondageSuspensionHogtied"), 1838, 800, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "8"), 1838, 850, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsHempRopeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1050) && (MouseX <= 1275) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsHempRopeSetPose(null);
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Hogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemArmsHempRopeSetPose("Hogtied");
	if ((MouseX >= 1725) && (MouseX <= 1950) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "SuspensionHogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 8)) InventoryItemArmsHempRopeSetPose("SuspensionHogtied");
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemArmsHempRopeSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsHempRopeLoad();
	}

	// Make sure the character can be restrained in that fashion
	if ((NewPose != null) && !InventoryAllow(C, ["NotKneeling", "NotSuspended", "NotMounted", "NotChained"], true)) return;

	// Sets the new pose with it's effects
	DialogFocusItem.Property.Type = NewPose;
	DialogFocusItem.Property.Effect = (NewPose == null) ? [] : "Freeze";
	DialogFocusItem.Property.Block = (NewPose == null) ? null : ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"];
	if (NewPose == null) { DialogFocusItem.Property.SetPose = ["BackBoxTie"]; DialogFocusItem.Property.Difficulty = 0; }
	if (NewPose == "Hogtied") { DialogFocusItem.Property.SetPose = ["Hogtied"]; DialogFocusItem.Property.Difficulty = 2; CharacterSetFacialExpression(C, "Blush", "Medium"); TimerInventoryRemoveSet(C, "Blush", 10); }
	if (NewPose == "SuspensionHogtied") { DialogFocusItem.Property.SetPose = ["SuspensionHogtied"]; DialogFocusItem.Property.Difficulty = 6; CharacterSetFacialExpression(C, "Blush", "Medium"); TimerInventoryRemoveSet(C, "Blush", 20); }

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "HempRopePosition" + ((NewPose == null) ? "BoxTie" : NewPose);
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}