var LoginBackground = "Dressing";
var LoginMessage = "";
var LoginCredits = null;
var LoginCreditsPosition = 0;
var LoginThankYou = "";
var LoginThankYouList = ["Alvin", "Bryce", "Christian", "Designated", "Dick", "EugeneTooms", "Ilsyra", "Jyeoh", "Laioken", "Michal", "Mindtie", "Nick", "Overlord", "Rashiash", "Ryner", "Shadow", "Simeon", "Simon", "Sky", "Terry", "Winterisbest", "Xepherio", "Zack"];
var LoginThankYouNext = 0;

// Loads the next thank you bubble
function LoginDoNextThankYou() {
	LoginThankYou = CommonRandomItemFromList(LoginThankYou, LoginThankYouList);
	CharacterAppearanceFullRandom(Player);
	LoginThankYouNext = CommonTime() + 4000;
}

// Draw the credits 
function LoginDrawCredits() {

	// For each credits in the list
	LoginCreditsPosition++;
	for(var C = 0; C < LoginCredits.length; C++) {

		// Sets the Y position (it scrolls from bottom to top)
		var Y = 800 - Math.floor(LoginCreditsPosition * CommonRunInterval / 10) + (C * 50);

		// Draw the text if it's in drawing range
		if ((Y > 0) && (Y <= 999)) {

			// The "CreditTypeRepeat" starts scrolling again, other credit types are translated
			var Cred = LoginCredits[C][0].trim();
			if (Cred == "CreditTypeRepeat") {
				LoginCreditsPosition = 0;
				return;
			} else {
				if (Cred.substr(0, 10) == "CreditType") DrawText(TextGet(Cred), 370, Y, "white");
				else {
					if (Cred.indexOf("|") == -1) DrawText(Cred, 370, Y, "white");
					else {
						DrawText(Cred.substring(0, Cred.indexOf("|")), 220, Y, "white");
						DrawText(Cred.substring(Cred.indexOf("|") + 1, 1000), 520, Y, "white");
					}
				}
			}

		}

	}

}

// Loads the character login screen
function LoginLoad() {

	// Resets the player and other characters
	Character = [];
	CharacterReset(0, "Female3DCG");
	LoginDoNextThankYou();
	CharacterLoadCSVDialog(Player);
	LoginMessage = "";
	if (LoginCredits == null) CommonReadCSV("LoginCredits", CurrentModule, CurrentScreen, "GameCredits");

	// Creates a text box to enter the player name
	var InputName = document.createElement('input');
	InputName.setAttribute("ID", "InputName");
	InputName.setAttribute("name", "InputName");
	InputName.setAttribute("type", "text");
	InputName.setAttribute("value", "");
	InputName.setAttribute("maxlength", "20");
	InputName.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputName);

	// Creates a text box to enter the player name
	var InputPassword = document.createElement('input');
	InputPassword.setAttribute("ID", "InputPassword");
	InputPassword.setAttribute("name", "InputPassword");
	InputPassword.setAttribute("type", "password");
	InputPassword.setAttribute("value", "");
	InputPassword.setAttribute("maxlength", "20");
	InputPassword.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputPassword);

}

// Run the character login screen 
function LoginRun() {
	
	// Position the login fields on the screen
	document.getElementById("InputName").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:65%; top:" + (window.innerHeight / 2 - MainCanvas.height / 4) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:65%; top:" + (window.innerHeight / 2 - MainCanvas.height / 10) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
		
	// Draw the character and labels
	if (LoginMessage == "") LoginMessage = TextGet("EnterNamePassword");
	if (LoginCredits != null) LoginDrawCredits();
	DrawCharacter(Player, 725, 100, 0.9);
	DrawText(TextGet("Welcome"), 1565, 50, "White", "Black");
	DrawText(LoginMessage, 1565, 100, "White", "Black");
	DrawText(TextGet("AccountName"), 1565, 217, "White", "Black");
	DrawText(TextGet("Password"), 1565, 368, "White", "Black");
	DrawButton(1500, 500, 130, 60, TextGet("Login"), "White", "");
	DrawText(TextGet("CreateNewCharacter"), 1565, 670, "White", "Black");
	DrawButton(1425, 740, 280, 60, TextGet("NewCharacter"), "White", "");
	if (CheatAllow) DrawButton(1425, 870, 280, 60, TextGet("Cheats"), "White", "");

	// Draw the credits and thank you bubble, a new character is shown every 5 seconds
	if (LoginThankYouNext < CommonTime()) LoginDoNextThankYou();
	DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 725, 16);
	DrawText(TextGet("ThankYou") + " " + LoginThankYou, 950, 53, "Black", "Gray");

}

// When the character logs, we analyze the data
function LoginResponse(CharacterData) {
	var C = JSON.parse(CharacterData);
	if ((C.CharacterName != null) && (C.AccountName != null)) {
		Player.Name = C.CharacterName;
		Player.AccountName = C.AccountName;
		Player.AccountPassword = document.getElementById("InputPassword").value.trim();
		Player.AssetFamily = C.AssetFamily;
		if (CommonIsNumeric(C.Money)) Player.Money = C.Money;
		Player.Owner = C.Owner;
		Player.Lover = C.Lover;
		CharacterAppearanceLoadFromAccount(Player, C.Appearance);
		InventoryRemove(Player, "ItemMisc");
		InventoryLoad(Player, C.Inventory, false);
		LogLoad(C.Log);
		ReputationLoad(C.Reputation);
		SkillLoad(C.Skill);
		CharacterLoadCSVDialog(Player);
		CharacterAppearanceValidate(Player);
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CommonSetScreen("Room", "MainHall");
	} else LoginMessage = TextGet("ErrorLoadingCharacterData");
}

// When the user clicks on the character login screen
function LoginClick() {
	
	if (CheatAllow) {
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CommonSetScreen("Character", "Cheat");
	}
	
	// If we must create a new character
	if ((MouseX >= 1425) && (MouseX <= 1705) && (MouseY >= 740) && (MouseY <= 800)) {
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CharacterAppearanceSetDefault(Player);
		CommonSetScreen("Character", "Appearance");
	}
	
	// If we must try to login
	if ((MouseX >= 1500) && (MouseX <= 1600) && (MouseY >= 500) && (MouseY <= 560)) {
		var Name = document.getElementById("InputName").value.trim();
		var Password = document.getElementById("InputPassword").value.trim();
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {

			// Calls the PHP page to check if the login is correct
			LoginMessage = TextGet("ValidatingNamePassword");
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				   if (xmlhttp.status == 200) {
					   if (xmlhttp.responseText.trim().substring(0, 1) == "{") LoginResponse(xmlhttp.responseText);
					   else LoginMessage = TextGet("InvalidNamePassword");
				   } else LoginMessage = TextGet("Error") + " " + xmlhttp.status.toString();
				}
			};
			xmlhttp.open("GET", AccountAddress + "?command=account_log&account=" + Name + "&password=" + Password, true);
			xmlhttp.send();

		} else LoginMessage = TextGet("InvalidNamePassword");
	}
	
}
