var Character = [];
var CharacterAccountURL = [];
var CharacterAccountReady = true;

// Loads a character in the buffer
function CharacterLoad(CharacterName, CharacterInventory, CharacterAppearance) {

	// First, we check if the character already exists
	var C;
	for (C = 0; C < Character.length; C++)
		if (Character[C].CharacterName == "CharacterName") {
			Character[C].Inventory = CharacterInventory;
			Character[C].Appearance = CharacterAppearance;
			CharacterLoadCanvas(Character[C]);
			return;
		}

	// Since we could not find the character, we add a new one to the list
	var NewCharacter = {
		Name: CharacterName,
		AccountName: "",
		AccountPassword: "",
		Inventory: CharacterInventory,
		Appearance: CharacterAppearance,
		Canvas: null,
		CanvasBlink: null,
		BlinkFactor: Math.round(Math.random() * 10) + 10
	}
	Character.push(NewCharacter);
	CharacterLoadCanvas(Character[Character.length - 1]);

}

// Sorts the character appearance by priority and loads the canvas
function CharacterLoadCanvas(C) {
	
	// Sorts the full appearance arraw first
	var App = [];
	var I;
	for (I = 0; I < 101 && App.length < C.Appearance.length; I++) {
		var A;
		for (A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.Group.DrawingPriority == I)
				App.push(C.Appearance[A]);
	}	
	C.Appearance = App;
	
	// Reload the canvas
	CharacterAppearanceBuildCanvas(C);

}

// Reload all characters canvas
function CharacterLoadCanvasAll() {	
	var C;
	for (C = 0; C < Character.length; C++)
		CharacterLoadCanvas(Character[C]);
}

// Puts the URL to call in a buffer
function CharacterAccountRequest(Command, Params) {
	if ((Character[0].AccountName != "") && (Character[0].AccountPassword != ""))
		CharacterAccountURL.push("Account.php?command=" + Command + "&account=" + Character[0].AccountName + "&password=" + Character[0].AccountPassword + Params.replace(/#/g, "|"));
}

// When the queue is ready to process, we launch a new http request
function CharacterAccountProcess() {
	if (CharacterAccountReady && (CharacterAccountURL.length > 0)) {
		CharacterAccountReady = false;
		var xmlhttp = new XMLHttpRequest();
		var URL = CharacterAccountURL[0];
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				CharacterAccountURL.splice(0, 1);
				CharacterAccountReady = true;
			}
		};
		//console.log(URL);
		xmlhttp.open("GET", URL, true);
		xmlhttp.send();		
	}	
}