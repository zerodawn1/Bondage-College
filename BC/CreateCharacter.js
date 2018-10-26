var CreateCharacter_BodySizeList = ["Small", "Normal", "Large", "XLarge"];
var CreateCharacter_SkinColorList = ["White", "Asian", "Black"];
var CreateCharacter_BodySize = 0;
var CreateCharacter_SkinColor = 0;

function CreateCharacter_Run() {
	DrawRect(0, 0, 2000, 1000, "#888888");
	DrawImage("Model/Body/" + CreateCharacter_SkinColorList[CreateCharacter_SkinColor] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", 0, 0);
	DrawText(MouseX.toString(), 50, 50, "white");
	DrawText(MouseY.toString(), 50, 150, "white");
	DrawRect(1500, 100, 400, 100, "#123456");
	DrawRect(1500, 400, 400, 100, "#987654");
}

function CreateCharacter_Click() {
	if ((MouseX >= 1500) && (MouseX < 1900) && (MouseY >= 100) && (MouseY < 200)) {
		CreateCharacter_SkinColor++;
		if (CreateCharacter_SkinColor >= CreateCharacter_SkinColorList.length) CreateCharacter_SkinColor = 0;
	}
	if ((MouseX >= 1500) && (MouseX < 1900) && (MouseY >= 400) && (MouseY < 500)) {
		CreateCharacter_BodySize++;
		if (CreateCharacter_BodySize >= CreateCharacter_BodySizeList.length) CreateCharacter_BodySize = 0;
	}	
}

function CreateCharacter_KeyDown() {
}
