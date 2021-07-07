"use strict";
var PrivateRansomBackground = "Sheet";
var PrivateRansomCharacter = null;

/**
 * Loads the private ransom note screen
 * @returns {void} - Nothing.
 */
function PrivateRansomLoad() {
}

/**
 * Draws the character and the ransom note
 * @returns {void} - Nothing.
 */
function PrivateRansomRun() {

	// Draw the ransomed character on the left
	DrawCharacter(PrivateRansomCharacter, 150, 100, 0.8);
	
	// Draw the ransom note, in 5 lines
	for (let T = 0; T <= 5; T++)
		DrawText(TextGet("Ransom" + T.toString()).replace("RansomCharacterName", PrivateRansomCharacter.Name), 1200, X * 125 + 187, "White", "Black");

	// Draw the buttons
	DrawButton(1800, 100, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1800, 215, 90, 90, "", "White", "Icons/Infiltration.png", TextGet("Infiltration"));

}

/**
 * Handles clicks in the ransom note
 * @returns {void} - Nothing.
 */
function PrivateRansomClick() {
	if (MouseIn(1800, 100, 90, 90)) PrivateRansomExit();
	if (MouseIn(1800, 215, 90, 90)) {
	}
}

/**
 * When the player leaves the note, we go back to the private room
 * @returns {void} - Nothing.
 */
function PrivateRansomExit() {
	CommonSetScreen("Room", "Private");
}