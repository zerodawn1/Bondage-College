var CreateCharacter_BodySizeList = ["Small", "Normal", "Large", "XLarge"];
var CreateCharacter_SkinColorList = ["White", "Asian", "Black"];
var CreateCharacter_EyesStyleList = ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11"];
var CreateCharacter_EyesColorList = ["#6a3628", "#5e481e", "#63390f", "#666666", "#555588", "#558855", "#885555", "#222222", "#aa3333"];
var CreateCharacter_HairStyleList = ["Hair1", "Hair2", "Hair3", "Hair4", "Hair5", "Hair6", "Hair7", "Hair8", "Hair9"];
var CreateCharacter_HairColorList = ["#202020", "#6a3628", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"];
var CreateCharacter_BodySize = 0;
var CreateCharacter_SkinColor = 0;
var CreateCharacter_EyesStyle = 0;
var CreateCharacter_EyesColor = 0;
var CreateCharacter_HairStyle = 0;
var CreateCharacter_HairColor = 0;
var CreateCharacter_ClothList = ["BondageCollege1", "StudentOutfit1", "PinkDress1", "BlackDress1", ""];
var CreateCharacter_BraStyleList = ["Bra1", "Bra2", "Bra7", ""];
var CreateCharacter_BraColorList = ["#bbbbbb", "#808080", "#222222", "#bb8080", "#80bb80", "#8080bb", "#bbbb80", "#80bbbb", "#bb80bb"];
var CreateCharacter_PantiesStyleList = ["Panties1", "Panties7", "Panties8", "Panties11", ""];
var CreateCharacter_PantiesColorList = ["#bbbbbb", "#808080", "#222222", "#bb8080", "#80bb80", "#8080bb", "#bbbb80", "#80bbbb", "#bb80bb"];
var CreateCharacter_SocksStyleList = ["Socks5", "Socks1", "Socks2", "Socks3", "Socks4", ""];
var CreateCharacter_SocksColorList = ["#bbbbbb", "#808080", "#222222", "#bb8080", "#80bb80", "#8080bb", "#bbbb80", "#80bbbb", "#bb80bb"];
var CreateCharacter_ShoesStyleList = ["Shoes1", "Shoes2", "Shoes4", "Sneakers1", "Sneakers2", "Heels1", "Boots1", ""];
var CreateCharacter_ShoesColorList = ["#222222", "#808080", "#bbbbbb", "#bb8080", "#80bb80", "#8080bb", "#bbbb80", "#80bbbb", "#bb80bb", "#cc3333"];
var CreateCharacter_ShoesBaseHeight = [6, 6, 3, 3, 3, 15, 9, 0];
var CreateCharacter_Cloth = 0;
var CreateCharacter_BraStyle = 0;
var CreateCharacter_BraColor = 0;
var CreateCharacter_PantiesStyle = 0;
var CreateCharacter_PantiesColor = 0;
var CreateCharacter_SocksStyle = 0;
var CreateCharacter_SocksColor = 0;
var CreateCharacter_ShoesStyle = 0;
var CreateCharacter_ShoesColor = 0;

// Resets the character to it's default appearance
function CharacterAppearanceSetDefault(C, DefaultAssetFamily) {

	// Resets the current appearance
	C.Appearance = [];

	// For each items in the character inventory
	var I;
	for (I = 0; I < C.Inventory.length; I++)
		if (C.Inventory[I].Asset.Group.Family == DefaultAssetFamily) {

			// If there's no item in a slot, the first one becomes the default
			var MustWear = true;
			var A;
			for (A = 0; A < C.Appearance.length; A++)
				if (C.Appearance[A].Asset.Group.Name == C.Inventory[I].Asset.Group.Name)
					MustWear = false;

			// No item, we wear it with the default color
			if (MustWear) {
				var NA = {
					Asset: C.Inventory[I].Asset,
					Color: C.Inventory[I].Asset.Group.ColorSchema[0]
				}
				C.Appearance.push(NA);				
			}
			
		}
		
	// Draw the character canvas
	C.Canvas = CharacterAppearanceGetCanvas(C.Appearance);
	
}

// Gets the character 
function CharacterAppearanceGetCanvas(CA) {
	
	// Prepares the canvas (500x1000 for characters)
	var Canvas = document.createElement("canvas");
	Canvas.width = 500;
	Canvas.height = 1000;
	var CTX = Canvas.getContext("2d")
	
	// Loops in all items worn by the character
	var A;
	for (A = 0; A < CA.length; A++) {


		// If there's a father group, we must add it to find the correct image
		var G = "";
		if (CA[A].Asset.Group.FatherGroupName != "") {
			var FG;
			for (FG = 0; FG < CA.length; FG++)
				if (CA[A].Asset.Group.FatherGroupName == CA[FG].Asset.Group.Name)
					G = "_" + CA[FG].Asset.Name;
		}
	
		// Draw the item on the canvas (default or empty means no special color, # means apply a color, regular text means we apply that text)
		if ((CA[A].Color == "default") || (CA[A].Color == ""))
			DrawImageZoomCanvas("Assets/" + CA[A].Asset.Group.Family + "/" + CA[A].Asset.Group.Name + "/" + CA[A].Asset.Name + G + ".png", CTX, 0, 0, 500, 1000, 0, 0, 500, 1000);
	    else
			if (CA[A].Color.indexOf("#") != 0)
				DrawImageZoomCanvas("Assets/" + CA[A].Asset.Group.Family + "/" + CA[A].Asset.Group.Name + "/" + CA[A].Asset.Name + G + "_" + CA[A].Color + ".png", CTX, 0, 0, 500, 1000, 0, 0, 500, 1000);
			else
				DrawImageColorize("Assets/" + CA[A].Asset.Group.Family + "/" + CA[A].Asset.Group.Name + "/" + CA[A].Asset.Name + G + ".png", CTX, CA[A].Asset.Group.Left, CA[A].Asset.Group.Top, 1, CA[A].Color, true);

	}
		
	// Returns the final canvas
	return Canvas;
}

/*function DrawCharacter(X, Y, Zoom) {
	Y = Y - CreateCharacter_ShoesBaseHeight[CreateCharacter_ShoesStyle];
	var ModelPath = "Models/Female3DCG/"
	var seconds = new Date().getTime();
    TempCanvas.canvas.width = 500 * Zoom;
    TempCanvas.canvas.height = 1000 * Zoom;
	DrawImageZoomCanvas(ModelPath + "Body/" + CreateCharacter_SkinColorList[CreateCharacter_SkinColor] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", TempCanvas, 0, 0, 500, 1000, 0, 0, 500 * Zoom, 1000 * Zoom);
	if (Math.round(seconds / 500) % 15 != 0) DrawImageColorize(ModelPath + "/Eyes/" + CreateCharacter_EyesStyleList[CreateCharacter_EyesStyle] + ".png", TempCanvas, 200 * Zoom, 150 * Zoom, Zoom, CreateCharacter_EyesColorList[CreateCharacter_EyesColor], false);
	if (CreateCharacter_BraStyleList[CreateCharacter_BraStyle] != "") DrawImageColorize(ModelPath + "/Bra/" + CreateCharacter_BraStyleList[CreateCharacter_BraStyle] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", TempCanvas, 150 * Zoom, 200 * Zoom, Zoom, CreateCharacter_BraColorList[CreateCharacter_BraColor], true);
	if (CreateCharacter_PantiesStyleList[CreateCharacter_PantiesStyle] != "") DrawImageColorize(ModelPath + "/Panties/" + CreateCharacter_PantiesStyleList[CreateCharacter_PantiesStyle] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", TempCanvas, 150 * Zoom, 450 * Zoom, Zoom, CreateCharacter_PantiesColorList[CreateCharacter_PantiesColor], true);
	if (CreateCharacter_SocksStyleList[CreateCharacter_SocksStyle] != "") DrawImageColorize(ModelPath + "/Socks/" + CreateCharacter_SocksStyleList[CreateCharacter_SocksStyle] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", TempCanvas, 125 * Zoom, 500 * Zoom, Zoom, CreateCharacter_SocksColorList[CreateCharacter_SocksColor], true);
	if (CreateCharacter_ShoesStyleList[CreateCharacter_ShoesStyle] != "") DrawImageColorize(ModelPath + "/Shoes/" + CreateCharacter_ShoesStyleList[CreateCharacter_ShoesStyle] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", TempCanvas, 125 * Zoom, 500 * Zoom, Zoom, CreateCharacter_ShoesColorList[CreateCharacter_ShoesColor], true);
	if (CreateCharacter_ClothList[CreateCharacter_Cloth] != "") DrawImageZoomCanvas(ModelPath + "/Cloth/" + CreateCharacter_ClothList[CreateCharacter_Cloth] + "_" + CreateCharacter_BodySizeList[CreateCharacter_BodySize] + ".png", TempCanvas, 0, 0, 500, 1000, 0, 0, 500 * Zoom, 1000 * Zoom);
	DrawImageColorize(ModelPath + "/Hair/" + CreateCharacter_HairStyleList[CreateCharacter_HairStyle] + ".png", TempCanvas, 150 * Zoom, 50 * Zoom, Zoom, CreateCharacter_HairColorList[CreateCharacter_HairColor], true);
	MainCanvas.drawImage(TempCanvas.canvas, X, Y);
}*/

function CharacterAppearance_Run() {
	DrawImage("Backgrounds/DressingRoom.jpg", 0, 0);
	DrawCharacter(0, -500, -100, 4);
	DrawCharacter(0, 900, 0, 1);
	//DrawText(DrawCacheLoadedImages.toString(), 1000, 500, "white");
	//DrawText(DrawCacheTotalImages.toString(), 1000, 600, "white");
	/*
	DrawButton(1500, 50, 225, 75, "Randomize");
	DrawButton(1500, 150, 225, 75, "Skin Color|" + CreateCharacter_SkinColorList[CreateCharacter_SkinColor]);
	DrawButton(1500, 250, 225, 75, "Body Size|" + CreateCharacter_BodySizeList[CreateCharacter_BodySize]);
	DrawButton(1500, 350, 225, 75, "Eyes Style|" + CreateCharacter_EyesStyleList[CreateCharacter_EyesStyle]);
	DrawButton(1500, 450, 225, 75, "Eyes Color|" + CreateCharacter_EyesColorList[CreateCharacter_EyesColor]);
	DrawButton(1500, 550, 225, 75, "Hair Style|" + CreateCharacter_HairStyleList[CreateCharacter_HairStyle]);
	DrawButton(1500, 650, 225, 75, "Hair Color|" + CreateCharacter_HairColorList[CreateCharacter_HairColor]);	
	DrawButton(1500, 750, 225, 75, "Outfit|" + CreateCharacter_ClothList[CreateCharacter_Cloth]);

	DrawButton(1750, 50, 225, 75, "Bra Style|" + CreateCharacter_BraStyleList[CreateCharacter_BraStyle]);
	DrawButton(1750, 150, 225, 75, "Bra Color|" + CreateCharacter_BraColorList[CreateCharacter_BraColor]);
	DrawButton(1750, 250, 225, 75, "Panties Style|" + CreateCharacter_PantiesStyleList[CreateCharacter_PantiesStyle]);
	DrawButton(1750, 350, 225, 75, "Panties Color|" + CreateCharacter_PantiesColorList[CreateCharacter_PantiesColor]);
	DrawButton(1750, 450, 225, 75, "Socks Style|" + CreateCharacter_SocksStyleList[CreateCharacter_SocksStyle]);
	DrawButton(1750, 550, 225, 75, "Socks Color|" + CreateCharacter_SocksColorList[CreateCharacter_SocksColor]);
	DrawButton(1750, 650, 225, 75, "Shoes Style|" + CreateCharacter_ShoesStyleList[CreateCharacter_ShoesStyle]);
	DrawButton(1750, 750, 225, 75, "Shoes Color|" + CreateCharacter_ShoesColorList[CreateCharacter_ShoesColor]);*/
	
	DrawText("Select your appearance", 500, 50, "White");
	
}

function CharacterAppearance_NextItem(ÌtemPos, List) {
	ÌtemPos++;
	if (ÌtemPos >= List.length) ÌtemPos = 0;
	return ÌtemPos;
}


function CharacterAppearance_Randomize(List) {
	return Math.round(Math.random() * (List.length - 1));
}

function CharacterAppearance_RandomizeAll() {
	CreateCharacter_SkinColor = CreateCharacter_Randomize(CreateCharacter_SkinColorList);
	CreateCharacter_BodySize = CreateCharacter_Randomize(CreateCharacter_BodySizeList);
	CreateCharacter_EyesStyle = CreateCharacter_Randomize(CreateCharacter_EyesStyleList);
	CreateCharacter_EyesColor = CreateCharacter_Randomize(CreateCharacter_EyesColorList);
	CreateCharacter_HairStyle = CreateCharacter_Randomize(CreateCharacter_HairStyleList);
	CreateCharacter_HairColor = CreateCharacter_Randomize(CreateCharacter_HairColorList);
	CreateCharacter_Cloth = CreateCharacter_Randomize(CreateCharacter_ClothList);
	CreateCharacter_BraStyle = CreateCharacter_Randomize(CreateCharacter_BraStyleList);
	CreateCharacter_BraColor = CreateCharacter_Randomize(CreateCharacter_BraColorList);
	CreateCharacter_PantiesStyle = CreateCharacter_Randomize(CreateCharacter_PantiesStyleList);
	CreateCharacter_PantiesColor = CreateCharacter_Randomize(CreateCharacter_PantiesColorList);
	CreateCharacter_SocksStyle = CreateCharacter_Randomize(CreateCharacter_SocksStyleList);
	CreateCharacter_SocksColor = CreateCharacter_Randomize(CreateCharacter_SocksColorList);
	CreateCharacter_ShoesStyle = CreateCharacter_Randomize(CreateCharacter_ShoesStyleList);
	CreateCharacter_ShoesColor = CreateCharacter_Randomize(CreateCharacter_ShoesColorList);
}

function CharacterAppearance_Click() {

	/*if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 50) && (MouseY < 125)) CreateCharacter_RandomizeAll();
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 150) && (MouseY < 225)) CreateCharacter_SkinColor = CreateCharacter_NextItem(CreateCharacter_SkinColor, CreateCharacter_SkinColorList);
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 250) && (MouseY < 325)) CreateCharacter_BodySize = CreateCharacter_NextItem(CreateCharacter_BodySize, CreateCharacter_BodySizeList);
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 350) && (MouseY < 425)) CreateCharacter_EyesStyle = CreateCharacter_NextItem(CreateCharacter_EyesStyle, CreateCharacter_EyesStyleList);
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 450) && (MouseY < 525)) CreateCharacter_EyesColor = CreateCharacter_NextItem(CreateCharacter_EyesColor, CreateCharacter_EyesColorList);
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 550) && (MouseY < 625)) CreateCharacter_HairStyle = CreateCharacter_NextItem(CreateCharacter_HairStyle, CreateCharacter_HairStyleList);
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 650) && (MouseY < 725)) CreateCharacter_HairColor = CreateCharacter_NextItem(CreateCharacter_HairColor, CreateCharacter_HairColorList);	
	if ((MouseX >= 1500) && (MouseX < 1725) && (MouseY >= 750) && (MouseY < 825)) CreateCharacter_Cloth = CreateCharacter_NextItem(CreateCharacter_Cloth, CreateCharacter_ClothList);

	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 50) && (MouseY < 125)) CreateCharacter_BraStyle = CreateCharacter_NextItem(CreateCharacter_BraStyle, CreateCharacter_BraStyleList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 150) && (MouseY < 225)) CreateCharacter_BraColor = CreateCharacter_NextItem(CreateCharacter_BraColor, CreateCharacter_BraColorList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 250) && (MouseY < 325)) CreateCharacter_PantiesStyle = CreateCharacter_NextItem(CreateCharacter_PantiesStyle, CreateCharacter_PantiesStyleList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 350) && (MouseY < 425)) CreateCharacter_PantiesColor = CreateCharacter_NextItem(CreateCharacter_PantiesColor, CreateCharacter_PantiesColorList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 450) && (MouseY < 525)) CreateCharacter_SocksStyle = CreateCharacter_NextItem(CreateCharacter_SocksStyle, CreateCharacter_SocksStyleList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 550) && (MouseY < 625)) CreateCharacter_SocksColor = CreateCharacter_NextItem(CreateCharacter_SocksColor, CreateCharacter_SocksColorList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 650) && (MouseY < 725)) CreateCharacter_ShoesStyle = CreateCharacter_NextItem(CreateCharacter_ShoesStyle, CreateCharacter_ShoesStyleList);
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 750) && (MouseY < 825)) CreateCharacter_ShoesColor = CreateCharacter_NextItem(CreateCharacter_ShoesColor, CreateCharacter_ShoesColorList);*/
	
}

function CharacterAppearance_KeyDown() {
}
