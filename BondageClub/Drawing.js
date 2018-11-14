// The main game canvas where everything will be drawn
var MainCanvas;
var TempCanvas;
var ColorCanvas;

// A bank of all the chached images
var DrawCacheImage = {};
var DrawCacheLoadedImages = 0;
var DrawCacheTotalImages = 0;
var DrawScreenWidth = -1;
var DrawScreenHeight = -1;

// Loads the drawing objects
function DrawLoad() {
	
	// Creates the objects used in the game
	MainCanvas = document.getElementById("MainCanvas").getContext("2d");
	TempCanvas = document.createElement("canvas").getContext("2d");
	ColorCanvas = document.createElement("canvas");
	document.getElementById("MainCanvas").addEventListener("keypress", KeyDown);
	document.getElementById("MainCanvas").tabIndex = 1000;	

	// Font is fixed for now, color can be set
	MainCanvas.font = "36px Arial";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	
}

// Returns the image file or build it from the source
function DrawGetImage(Source) {

    // Search in the cache to find the image
    if (!DrawCacheImage[Source]) {
        var img = new Image;
        img.src = Source;
        DrawCacheImage[Source] = img;
		
		// Reloads all character canvas once everything is loaded
		if (Source.indexOf("Assets") >= 0) {
			DrawCacheTotalImages++;
			img.onload = function () {			
				DrawCacheLoadedImages++;
				if (DrawCacheLoadedImages == DrawCacheTotalImages)
					CharacterLoadCanvasAll();				
			}			
		}
    }

    // returns the final image
    return DrawCacheImage[Source];
}

// Refreshes the character if not all images are loaded and draw the character canvas on the main game screen
function DrawCharacter(C, X, Y, Zoom) {
	
	var Height = 0;
	var A;
	for (A = 0; A < C.Appearance.length; A++)
		Height = Height + C.Appearance[A].Asset.HeightModifier;	

	// The file name changes if the player is gagged or blinks at specified intervals
	var seconds = new Date().getTime();
	var Canvas = (Math.round(seconds / 400) % C.BlinkFactor == 0) ? C.CanvasBlink : C.Canvas;
	if ((Zoom == undefined) || (Zoom == 1))
		DrawCanvas(Canvas, X, Y - Height);
    else
		DrawCanvasZoom(Canvas, X, Y - (Height * Zoom), Zoom);

	// Draw the character name below herself
	if (C.Name != "")
		DrawText(C.Name, X + 255, Y + 980, "White", "Black");
	
}
		
// Draw a zoomed image from a source to a specific canvas
function DrawImageZoomCanvas(Source, Canvas, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	Canvas.drawImage(DrawGetImage(Source), SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
}

// Draw a zoomed image from a source to a specific canvas
function DrawImageCanvas(Source, Canvas, X, Y) {
	Canvas.drawImage(DrawGetImage(Source), X, Y);
}
		
// Draw a zoomed image from a source to the screen canvas
/*function DrawImageZoom(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	MainCanvas.drawImage(DrawGetImage(Source), SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
}*/

// Draw a specific canvas on the main canvas
function DrawCanvas(Canvas, X, Y) {
	MainCanvas.drawImage(Canvas, X, Y);
}

// Draw a specific canvas with a zoom on the main canvas
function DrawCanvasZoom(Canvas, X, Y, Zoom) {
	MainCanvas.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, X, Y, Canvas.width * Zoom, Canvas.height * Zoom);
}

// Draw a zoomed image from a source to the canvas and mirrors it from left to right
function DrawImageZoomMirror(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	MainCanvas.save();
    MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(DrawGetImage(Source), X * -1, Y, Width * -1, Height);
    MainCanvas.restore();
}

// Draw an image from a source to the canvas
function DrawImage(Source, X, Y) {
	MainCanvas.drawImage(DrawGetImage(Source), X, Y);
}

// Draw an image from a source to the canvas
function DrawImageCanvasColorize(Source, Canvas, X, Y, Zoom, HexColor, FullAlpha) {

	// Make sure that the starting image is loaded
	var Img = new Image();
	Img.src = DrawGetImage(Source).src;
	if ((Img != null) && (Img.width > 0)) {

		// Prepares a canvas to draw the colorized image
		ColorCanvas.width = Img.width;
		ColorCanvas.height = Img.height;
		var ctx = ColorCanvas.getContext("2d");
		ctx.drawImage(Img,0,0);
		var imageData = ctx.getImageData(0,0,ColorCanvas.width,ColorCanvas.height);
		var data = imageData.data;

		// Get the RGB color used to transform
		var rgbColor = HexToRGB(HexColor);
		var trans;

		// We transform each non transparent pixel based on the RGG value
		if (FullAlpha) {
			for(var p = 0, len = data.length; p < len; p+=4) {
				if (data[p+3] == 0)
				   continue;
				trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
				data[p + 0] = rgbColor.r * trans;
				data[p + 1] = rgbColor.g * trans;
				data[p + 2] = rgbColor.b * trans;
			}		
		} else {
			for(var p = 0, len = data.length; p < len; p+=4) {
				trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
				if ((data[p+3] == 0) || (trans < 0.8) || (trans > 1.2))
				   continue;
				data[p + 0] = rgbColor.r * trans;
				data[p + 1] = rgbColor.g * trans;
				data[p + 2] = rgbColor.b * trans;
			}
		}

		// Replace the source image with the modified canvas
		ctx.putImageData(imageData, 0, 0);
		Canvas.drawImage(ctx.canvas, 0, 0, Img.width, Img.height, X, Y, Img.width * Zoom, Img.height * Zoom);
	
	}
	
}

// Draw an image from a source to the canvas
function DrawImageMirror(Source, X, Y) {
	MainCanvas.save();
    MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(DrawGetImage(Source), X * -1, Y);
    MainCanvas.restore();
}

// Draw a text in the canvas
function DrawText(Text, X, Y, Color, BackColor) {

	// Draw a back color relief text if needed
	if ((BackColor != null) && (BackColor != "")) {

		// Split the text on two lines if there's a |
		MainCanvas.fillStyle = BackColor;
		if (Text.indexOf("|") == -1)
			MainCanvas.fillText(Text, X + 1, Y + 1);
		else {
			MainCanvas.fillText(Text.substring(0, Text.indexOf("|")), X + 1, Y + 1 - 25);
			MainCanvas.fillText(Text.substring(Text.indexOf("|") + 1, 1000), X + 1, Y + 1 + 25);
		}					
	
	}

	// Split the text on two lines if there's a |
	MainCanvas.fillStyle = Color;
	if (Text.indexOf("|") == -1)
		MainCanvas.fillText(Text, X, Y);
	else {
		MainCanvas.fillText(Text.substring(0, Text.indexOf("|")), X, Y - 19);
		MainCanvas.fillText(Text.substring(Text.indexOf("|") + 1, 1000), X, Y + 19);
	}					

}

// Draw a button
function DrawButton(Left, Top, Width, Height, Label, Color, Image) {

	// Draw the button rectangle
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = Color; 
    MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();	
	MainCanvas.lineWidth = '2';
	MainCanvas.strokeStyle = 'black';
	MainCanvas.stroke();
	MainCanvas.closePath();
	
	// Draw the text
	DrawText(Label, Left + Width / 2, Top + Height / 2, "black");
	if ((Image != null) && (Image != "")) DrawImage(Image, Left + 2, Top + 2);
	
}

// Draw a basic rectangle
function DrawRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = Color; 
    MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();	
	MainCanvas.closePath();		
}

// Draw a basic circle
function DrawCircle(CenterX, CenterY, Radius, LineWidth, LineColor) {
	MainCanvas.beginPath();
	MainCanvas.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI, false);
	MainCanvas.lineWidth = LineWidth;
	MainCanvas.strokeStyle = LineColor;
	MainCanvas.stroke();	
}

// Draw --- if zero, +value in green if positive, -value in red if negative
function DrawPosNegValue(Value, X, Y) {	
	if (Value == 0) DrawText("---", X, Y, "black");
	if (Value > 0) DrawText("+" + Value.toString(), X, Y, "#00BB00");
	if (Value < 0) DrawText(Value.toString(), X, Y, "#BB0000");	
}

// Draw the current actor stats toward the player
function DrawActorStats(Left, Top) {
	
	// Draw the actor name and icon
	if (ActorGetValue(ActorHideName)) DrawText("Unknown", Left - 200, Top + 17, "black");
	else DrawText(CurrentActor, Left - 200, Top + 17, "black");
	if (CurrentActor == Common_PlayerLover) DrawImage("Icons/Lover.png", Left - 110, Top);
	else DrawImage("Icons/Heart.png", Left - 110, Top);
	if (ActorGetValue(ActorOwner) == "Player") DrawImage("Icons/Collared.png", Left - 10, Top);
	else if (CurrentActor == Common_PlayerOwner) DrawImage("Icons/Owner.png", Left - 10, Top);
	else DrawImage("Icons/Submission.png", Left - 10, Top);
	DrawImage("Icons/Orgasm.png", Left + 90, Top);
	DrawImage("Icons/Bondage.png", Left + 190, Top);
	DrawPosNegValue(ActorGetValue(ActorLove), Left - 50, Top + 17);
	DrawPosNegValue(ActorGetValue(ActorSubmission), Left + 50, Top + 17);
	DrawText(ActorGetValue(ActorOrgasmCount).toString(), Left + 150, Top + 17, "black");
	DrawText(ActorGetValue(ActorBondageCount).toString(), Left + 250, Top + 17, "black");

}

// Draw all the possible interactions 
function DrawInteraction() {

	// Draw both the player and the interaction character
	DrawCharacter(Character[0], 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);
	
	// Find the intro text
	var IntroText = "";
	for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null)) {
			IntroText = CurrentCharacter.Dialog[D].Result
			break;
		}

	// Draws the intro
	DrawText(CurrentCharacter.Name + ": " + IntroText, 1500, 50, "white", "black");
	
	// Draws the possible answers
	var Pos = 0;
	for(var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null)) {
			DrawButton(1200, 100 + 100 * Pos, 600, 75, CurrentCharacter.Dialog[D].Option, "white");
			Pos++;			
		}
		
}

// Find the current image file 
function FindImage(Intro, CurrentStagePosition) {
	
	// The image file is a column in the intro CSV file
	var ImageName = "";
	if (OverridenIntroImage != "")
		ImageName = OverridenIntroImage;
	else
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ImageName = Intro[I][IntroImage];
	return ImageName;

}

// Build the full character / object interaction screen
function BuildInteraction(CurrentStagePosition) {

	// Make sure the CSV files for interactions are loaded
	if ((CurrentIntro != null) && (CurrentStage != null)) {

		// Paints the background image depending on the current stage
		var ImageName = FindImage(CurrentIntro, CurrentStagePosition);
		if ((ImageName !== undefined) && (ImageName.trim() != "")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + ImageName, 600, 0);

		// Build all the options for interaction
		DrawRect(0, 0, 600, 600, "Black");
		DrawIntro(CurrentIntro, CurrentStagePosition, 0, 0);
		DrawInteraction(CurrentStage, CurrentStagePosition, 0, 0);

	}

}

// Get the player image file name
function GetPlayerIconImage() {

	// The file name changes if the player is gagged or blinks at specified intervals
	var Image = "Player";
	var seconds = new Date().getTime();
	if (PlayerHasLockedInventory("BallGag") == true) Image = Image + "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) Image = Image + "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) Image = Image + "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) Image = Image + "_DoubleOpenGag";
    if (PlayerHasLockedInventory("Blindfold") == true) Image = Image + "_Blindfold";
	if (Math.round(seconds / 500) % 15 == 0) Image = Image + "_Blink";
	return Image;

}

// Returns the name of the image file to use to draw the player
function DrawGetPlayerImageName(IncludePose) {
	
	// Get the first part of the image
	var ImageCloth = "Clothed";
	if (Common_PlayerUnderwear) ImageCloth = "Underwear";
	if (Common_PlayerNaked) ImageCloth = "Naked";
	if ((Common_PlayerUnderwear || Common_PlayerNaked) && PlayerHasLockedInventory("ChastityBelt")) ImageCloth = "ChastityBelt";
	if (Common_PlayerCostume != "") ImageCloth = Common_PlayerCostume
	
	// Second part is the type of bondage
	var ImageBondage = "_NoBondage";	
	if (PlayerHasLockedInventory("Cuffs") == true) ImageBondage = "_Cuffs";
	if (PlayerHasLockedInventory("Rope") == true) ImageBondage = "_Rope";
	if (PlayerHasLockedInventory("Armbinder") == true) ImageBondage = "_Armbinder";

	// Third part is the collar, which only shows for certain clothes
	var ImageCollar = "";
	if ((ImageCloth == "Underwear") || (ImageCloth == "Naked") || (ImageCloth == "ChastityBelt") || (ImageCloth == "Damsel") || (ImageCloth == "Tennis") || (ImageCloth == "Judo") || (ImageCloth == "RedBikini")) {
		if (PlayerHasLockedInventory("Collar")) ImageCollar = "_Collar";
		else ImageCollar = "_NoCollar";
	}
	
	// Fourth part is the gag
	var ImageGag = "_NoGag";
	if (PlayerHasLockedInventory("BallGag") == true) ImageGag = "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) ImageGag = "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) ImageGag = "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) ImageGag = "_DoubleOpenGag";

	// Fifth part is the blindfold
	var ImageBlindfold = "";	
    if (PlayerHasLockedInventory("Blindfold") == true) ImageBlindfold = "_Blindfold";

	// Sixth part is the pose
	var ImagePose = "";
    if ((Common_PlayerPose != "") && IncludePose) ImagePose = "_" + Common_PlayerPose;

	// Return the constructed name
	return ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ImagePose;

}

// Draw the regular player image (600x600) (can zoom if an X and Y are provided)
function DrawPlayerImage(X, Y) {
	if ((Common_PlayerCostume == "Tennis") || (Common_PlayerCostume == "Judo") || (Common_PlayerCostume == "Teacher") || (Common_PlayerCostume == "BlackDress") || (Common_PlayerCostume == "WhiteLingerie") || (Common_PlayerCostume == "RedBikini")) {
		DrawRect(600, 0, 1200, 600, "White");
		DrawTransparentPlayerImage(600, 0, 1);
	} else {
		if ((X == 0) && (Y == 0)) DrawImage("C999_Common/Player/" + DrawGetPlayerImageName(false) + ".jpg", 600, 0);
		else DrawImageZoom("C999_Common/Player/" + DrawGetPlayerImageName(false) + ".jpg", X, Y, 600, 600, 600, 0, 1200, 1200);
	}	
}

// Draw the transparent player image (600x900) with a zoom if required
function DrawTransparentPlayerImage(X, Y, Zoom) {
	DrawImageZoom("Actors/Player/" + DrawGetPlayerImageName(true) + ".png", 0, 0, 600, 900, X, Y, 600 * Zoom, 900 * Zoom);
}

// Draw the transparent actor over the current background
function DrawActor(ActorToDraw, X, Y, Zoom) {
	
	// Validate first if we must draw the transparent player image
	if (ActorToDraw == "Player") {
		DrawTransparentPlayerImage(X, Y, Zoom);		
	} else {

		// First, we retrieve the current clothes
		var ImageCloth = ActorSpecificGetValue(ActorToDraw, ActorCloth);
		if (ImageCloth == "") ImageCloth = "Clothed";
		if (((ImageCloth == "Underwear") || (ImageCloth == "Naked")) && ActorSpecificHasInventory(ActorToDraw, "ChastityBelt")) ImageCloth = "ChastityBelt";

		// Second part is the type of bondage
		var ImageBondage = "_NoBondage";	
		if (ActorSpecificHasInventory(ActorToDraw, "Cuffs")) ImageBondage = "_Cuffs";
		if (ActorSpecificHasInventory(ActorToDraw, "Rope")) ImageBondage = "_Rope";
		if (ActorSpecificHasInventory(ActorToDraw, "TwoRopes")) ImageBondage = "_TwoRopes";
		if (ActorSpecificHasInventory(ActorToDraw, "ThreeRopes")) ImageBondage = "_ThreeRopes";
		if (ActorSpecificHasInventory(ActorToDraw, "Armbinder")) ImageBondage = "_Armbinder";

		// Third part is the collar, which only shows for certain clothes
		var ImageCollar = "";
		if ((ImageCloth == "Underwear") || (ImageCloth == "Naked") || (ImageCloth == "ChastityBelt") || (ImageCloth == "Damsel") || (ImageCloth == "Shorts") || (ImageCloth == "Swimsuit") || (ImageCloth == "Tennis") || (ImageCloth == "BrownDress")) {
			if (ActorSpecificHasInventory(ActorToDraw, "Collar")) ImageCollar = "_Collar";
		}

		// Fourth part is the gag
		var ImageGag = "_NoGag";
		if (ActorSpecificHasInventory(ActorToDraw, "BallGag")) ImageGag = "_BallGag";
		if (ActorSpecificHasInventory(ActorToDraw, "TapeGag")) ImageGag = "_TapeGag";
		if (ActorSpecificHasInventory(ActorToDraw, "ClothGag")) ImageGag = "_ClothGag";

		// Fifth part is the blindfold
		var ImageBlindfold = "";	
		if (ActorSpecificHasInventory(ActorToDraw, "Blindfold")) ImageBlindfold = "_Blindfold";

		// Fourth part is the pose
		var ImagePose = "";
		if (ActorSpecificGetValue(ActorToDraw, ActorPose) != "") ImagePose = "_" + ActorSpecificGetValue(ActorToDraw, ActorPose);

		// Draw the full image from all parts
		DrawImageZoom("Actors/" + ActorToDraw + "/" + ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ImagePose + ".png", 0, 0, 600, 900, X, Y, 600 * Zoom, 900 * Zoom);
		
	}

}

// Draw the current interaction actor (if there's no actor, we draw the player)
function DrawInteractionActor() {
	if (CurrentActor == "") {
		DrawTransparentPlayerImage(600, 0, 1);
	} else {
		if (ActorHasInventory("TwoRopes") || ActorHasInventory("ThreeRopes")) DrawActor(CurrentActor, 600, -250, 1);
		else DrawActor(CurrentActor, 600, 0, 1);
	}
}

// Draw a ramdom image of the player as transition from chapter to chapter
function DrawPlayerTransition() {
	var ImgRnd = (Math.round(new Date().getTime() / 5000) % 8) + 1;
	DrawImage("Actors/PlayerTransition/Player0" + ImgRnd.toString() + ".png", 900, 0);
}

// Returns a the path to a icon.  IconName can be preceeded by additional paths.
function GetIconPath(IconName) {
    return GetPath.apply(undefined, arguments) + ".png";
}

// Returns a the path to an icon for the current screen.  IconName can be preceeded by additional paths.
function GetIconScreenPath(IconName) {
    return GetIconPath(GetPath.apply(undefined, [CurrentChapter, CurrentScreen].concat(Array.from(arguments))));
}

// Makes sure the screen is at the proper size
function DrawResize() {
	
	// Gets the Width and Height differently on mobile and regular browsers
	var W = (Common_IsMobile) ? document.documentElement.clientWidth : window.innerWidth;
	var H = (Common_IsMobile) ? document.documentElement.clientHeight : window.innerHeight;

	// If we need to resize, we keep the 2x1 ratio
	if ((DrawScreenWidth != W) || (DrawScreenHeight != H)) {
		DrawScreenWidth = W;
		DrawScreenHeight = H;
		if (W <= H * 2) {
			MainCanvas.width = W;
			MainCanvas.height = MainCanvas.width / 2;
			MainCanvas.canvas.style.width = "100%"; 
			MainCanvas.canvas.style.height = "";
		} else {
			MainCanvas.height = H;
			MainCanvas.width = MainCanvas.height * 2;
			MainCanvas.canvas.style.width = ""; 
			MainCanvas.canvas.style.height = "100%";
		}
	}

}