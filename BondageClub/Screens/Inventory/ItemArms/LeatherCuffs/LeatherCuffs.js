"use strict";

// Loads the item extension properties
function InventoryItemArmsLeatherCuffsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
}

// Draw the item extension screen
function InventoryItemArmsLeatherCuffsDraw() {
	DrawText(DialogFind(Player, "SelectBondagePosition"), 1375, 50, "white", "gray");
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "CannotUnlockIfElbowBound"), 1500, 500, "white", "gray");
	DrawButton(1000, 625, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/None.png", 1000, 625);
	DrawText(DialogFind(Player, "LeatherCuffsPoseNone"), 1125, 890, "white", "gray");
	DrawButton(1250, 625, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Wrist")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Wrist.png", 1250, 625);
	DrawText(DialogFind(Player, "LeatherCuffsPoseWrist"), 1375, 890, "white", "gray");
	DrawButton(1500, 625, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Elbow")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Elbow.png", 1500, 625);
	DrawText(DialogFind(Player, "LeatherCuffsPoseElbow"), 1625, 890, "white", "gray");
	DrawButton(1750, 625, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Both")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Both.png", 1750, 625);
	DrawText(DialogFind(Player, "LeatherCuffsPoseBoth"), 1875, 890, "white", "gray");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemArmsLeatherCuffsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 625) && (MouseY <= 850) && (DialogFocusItem.Property.Restrain != null)) InventoryItemArmsLeatherCuffsSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 625) && (MouseY <= 850) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Wrist"))) InventoryItemArmsLeatherCuffsSetPose("Wrist");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 625) && (MouseY <= 850) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Elbow"))) InventoryItemArmsLeatherCuffsSetPose("Elbow");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 625) && (MouseY <= 850) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Both"))) InventoryItemArmsLeatherCuffsSetPose("Both");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemArmsLeatherCuffsSetPose(NewPose) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Restrain = NewPose;
	if (NewPose == null) {
		delete DialogFocusItem.Property.SetPose;
		delete DialogFocusItem.Property.Effect;
		delete DialogFocusItem.Property.SelfUnlock;
	} else {
		DialogFocusItem.Property.SetPose = [(NewPose == "Wrist") ? "BackBoxTie" : "BackElbowTouch"];
		DialogFocusItem.Property.Effect = ["Block", "Prone", "Lock"];
		DialogFocusItem.Property.SelfUnlock = (NewPose == "Wrist");
	}
	CharacterRefresh(C);
	var msg = DialogFind(Player, "LeatherCuffsRestrain" + (NewPose == null) ? "None" : NewPose);
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) DialogFocusItem = null;
}
