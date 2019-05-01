"use strict";

// Loads the item extension properties
function InventoryItemArmsLeatherCuffsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
}

// Draw the item extension screen
function InventoryItemArmsLeatherCuffsDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawButton(1000, 575, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "Green" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/None.png");
	DrawButton(1250, 575, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Wrist")) ? "Green" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Wrist.png");
	DrawButton(1500, 575, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Elbow")) ? "Green" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Elbow.png");
	DrawButton(1750, 575, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Both")) ? "Green" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Both.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemArmsLeatherCuffsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 575) && (MouseY <= 800) && (DialogFocusItem.Property.Restrain != null)) InventoryItemArmsLeatherCuffsSetPose(null);
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 575) && (MouseY <= 800) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Wrist"))) InventoryItemArmsLeatherCuffsSetPose("Wrist");
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 575) && (MouseY <= 800) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Elbow"))) InventoryItemArmsLeatherCuffsSetPose("Elbow");
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 575) && (MouseY <= 800) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Both"))) InventoryItemArmsLeatherCuffsSetPose("Both");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemArmsLeatherCuffsSetPose(NewPose) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Restrain = NewPose;
	if (NewPose == null) {
		delete DialogFocusItem.Property.SetPose;
		delete DialogFocusItem.Property.Effect;
	} else {
		DialogFocusItem.Property.SetPose = [(NewPose == "Wrist") ? "BackBoxTie" : "BackElbowTouch"];
		DialogFocusItem.Property.Effect = ["Block", "Prone", "Lock"];
	}
	CharacterRefresh(C);
	var msg = DialogFind(Player, "LeatherCuffsRestrain" + (NewPose == null) ? "None" : NewPose);
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
}
