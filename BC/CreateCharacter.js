var CreateCharacter_ClothList = ["StudentOutfit", ""];
var CreateCharacter_BodySizeList = ["Small", "Normal", "Large", "XLarge"];
var CreateCharacter_SkinColorList = ["White", "Asian", "Black"];
var CreateCharacter_EyesStyleList = ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11"];
var CreateCharacter_EyesColorList = ["#6a3628", "#5e481e", "#63390f", "#666666", "#555588", "#558855", "#885555", "#111111"];
var CreateCharacter_HairStyleList = ["Hair1", "Hair2", "Hair3", "Hair4", "Hair5", "Hair6", "Hair7", "Hair8", "Hair9"];
var CreateCharacter_HairColorList = ["#202020", "#6a3628", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#dddd00", "#dd0000", "#dd00dd"];
var CreateCharacter_Cloth = 0;
var CreateCharacter_BodySize = 0;
var CreateCharacter_SkinColor = 0;
var CreateCharacter_EyesStyle = 0;
var CreateCharacter_EyesColor = 0;
var CreateCharacter_HairStyle = 0;
var CreateCharacter_HairColor = 0;

function DrawCharacter(X, Y, Zoom) {
	var seconds = new Date().getTime();
	DrawImageZoom("Model/Body/" + CreateCharacter_SkinColorList[CreateCharacter_SkinColor] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", 0, 0, 500, 1000, X, Y, 500 * Zoom, 1000 * Zoom);
	if (Math.round(seconds / 500) % 15 != 0) DrawImageColorize("Model/Eyes/" + CreateCharacter_EyesStyleList[CreateCharacter_EyesStyle] + ".png", X + 200 * Zoom, Y + 150 * Zoom, Zoom, CreateCharacter_EyesColorList[CreateCharacter_EyesColor], false);
	if (CreateCharacter_ClothList[CreateCharacter_Cloth] != "") DrawImageZoom("Model/Cloth/" + CreateCharacter_ClothList[CreateCharacter_Cloth] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", 0, 0, 500, 1000, X, Y, 500 * Zoom, 1000 * Zoom);
	DrawImageColorize("Model/Hair/" + CreateCharacter_HairStyleList[CreateCharacter_HairStyle] + ".png", X + 150 * Zoom, Y + 50 * Zoom, Zoom, CreateCharacter_HairColorList[CreateCharacter_HairColor], true);
}

function CreateCharacter_Run() {
	DrawRect(0, 0, 2000, 1000, "#888888");
	DrawCharacter(1000, 0, 1);
	DrawCharacter(-700, -250, 5);
	DrawButton(1500, 50, 300, 75, "Randomize");
	DrawButton(1500, 150, 300, 75, "Outfit " + CreateCharacter_Cloth.toString());
	DrawButton(1500, 250, 300, 75, "Skin Color " + CreateCharacter_SkinColor.toString());
	DrawButton(1500, 350, 300, 75, "Body Size " + CreateCharacter_BodySize.toString());
	DrawButton(1500, 450, 300, 75, "Eyes Style " + CreateCharacter_EyesStyle.toString());
	DrawButton(1500, 550, 300, 75, "Eyes Color " + CreateCharacter_EyesColor.toString());
	DrawButton(1500, 650, 300, 75, "Hair Style " + CreateCharacter_HairStyle.toString());
	DrawButton(1500, 750, 300, 75, "Hair Color " + CreateCharacter_HairColor.toString());	
}

function CreateCharacter_NextItem(ÌtemPos, List) {
	ÌtemPos++;
	if (ÌtemPos >= List.length) ÌtemPos = 0;
	return ÌtemPos;
}


function CreateCharacter_Randomize(List) {
	return Math.round(Math.random() * (List.length - 1));
}

function CreateCharacter_RandomizeAll() {
	CreateCharacter_Cloth = CreateCharacter_Randomize(CreateCharacter_ClothList);
	CreateCharacter_SkinColor = CreateCharacter_Randomize(CreateCharacter_SkinColorList);
	CreateCharacter_BodySize = CreateCharacter_Randomize(CreateCharacter_BodySizeList);
	CreateCharacter_EyesStyle = CreateCharacter_Randomize(CreateCharacter_EyesStyleList);
	CreateCharacter_EyesColor = CreateCharacter_Randomize(CreateCharacter_EyesColorList);
	CreateCharacter_HairStyle = CreateCharacter_Randomize(CreateCharacter_HairStyleList);
	CreateCharacter_HairColor = CreateCharacter_Randomize(CreateCharacter_HairColorList);
}

function CreateCharacter_Click() {
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 50) && (MouseY < 125)) CreateCharacter_RandomizeAll();
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 150) && (MouseY < 225)) CreateCharacter_Cloth = CreateCharacter_NextItem(CreateCharacter_Cloth, CreateCharacter_ClothList);
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 250) && (MouseY < 325)) CreateCharacter_SkinColor = CreateCharacter_NextItem(CreateCharacter_SkinColor, CreateCharacter_SkinColorList);
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 350) && (MouseY < 425)) CreateCharacter_BodySize = CreateCharacter_NextItem(CreateCharacter_BodySize, CreateCharacter_BodySizeList);
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 450) && (MouseY < 525)) CreateCharacter_EyesStyle = CreateCharacter_NextItem(CreateCharacter_EyesStyle, CreateCharacter_EyesStyleList);
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 550) && (MouseY < 625)) CreateCharacter_EyesColor = CreateCharacter_NextItem(CreateCharacter_EyesColor, CreateCharacter_EyesColorList);
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 650) && (MouseY < 725)) CreateCharacter_HairStyle = CreateCharacter_NextItem(CreateCharacter_HairStyle, CreateCharacter_HairStyleList);
	if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 750) && (MouseY < 825)) CreateCharacter_HairColor = CreateCharacter_NextItem(CreateCharacter_HairColor, CreateCharacter_HairColorList);
}

function CreateCharacter_KeyDown() {
}
