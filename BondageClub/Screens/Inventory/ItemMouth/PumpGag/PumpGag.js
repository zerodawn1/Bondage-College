"use strict";

// Loads the item extension properties
function InventoryItemMouthPumpGagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { PumpLevel: 0 };
}

// Draw the item extension screen
function InventoryItemMouthPumpGagDraw() {
	DrawText("Pump it up!", 1500, 500, "White", "Gray");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemMouthPumpGagClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
}