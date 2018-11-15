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

	// The file name changes if the player is gagged or blinks at specified intervals
	var seconds = new Date().getTime();
	var Canvas = (Math.round(seconds / 400) % C.BlinkFactor == 0) ? C.CanvasBlink : C.Canvas;
	if ((Zoom == undefined) || (Zoom == 1))
		DrawCanvas(Canvas, X, Y - C.HeightModifier);
    else
		DrawCanvasZoom(Canvas, X, Y - (C.HeightModifier * Zoom), Zoom);

	// Draws the character focus zones if we need too
	if ((C.FocusGroup != null) && (C.FocusGroup.Zone != null))
		for(var Z = 0; Z < C.FocusGroup.Zone.length; Z++)
			DrawEmptyRect(C.FocusGroup.Zone[Z][0] + X, C.FocusGroup.Zone[Z][1] + Y - C.HeightModifier, C.FocusGroup.Zone[Z][2], C.FocusGroup.Zone[Z][3], "cyan");
	
	// Draw the character name below herself
	if (C.Name != "") DrawText(C.Name, X + 255, Y + 980, "White", "Black");
	
}
		
// Draw a zoomed image from a source to a specific canvas
function DrawImageZoomCanvas(Source, Canvas, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	Canvas.drawImage(DrawGetImage(Source), SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
}

// Draw a zoomed image from a source to a specific canvas
function DrawImageCanvas(Source, Canvas, X, Y) {
	Canvas.drawImage(DrawGetImage(Source), X, Y);
}

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

// Draw a word wrapped text in a rectangle
function DrawTextWrap(Text, X, Y, Width, Height, ForeColor, BackColor) {

	// Draw the rectangle if we need too
	if (BackColor != null) {
		MainCanvas.beginPath();
		MainCanvas.rect(X, Y, Width, Height);
		MainCanvas.fillStyle = BackColor; 
		MainCanvas.fillRect(X, Y, Width, Height);
		MainCanvas.fill();	
		MainCanvas.lineWidth = '2';
		MainCanvas.strokeStyle = ForeColor;
		MainCanvas.stroke();
		MainCanvas.closePath();		
	}
	
	// Split the text if it wouldn't fit in the rectangle
	MainCanvas.fillStyle = ForeColor;
	if (MainCanvas.measureText(Text).width > Width) {
		var words = Text.split(' ');
		var line = '';
		Y += 46;
		for(var n = 0; n < words.length; n++) {
		  var testLine = line + words[n] + ' ';
		  var metrics = MainCanvas.measureText(testLine);
		  var testWidth = metrics.width;
		  if (testWidth > Width && n > 0) {
			MainCanvas.fillText(line, X + Width / 2, Y);
			line = words[n] + ' ';
			Y += 46;
		  }
		  else {
			line = testLine;
		  }
		}
		MainCanvas.fillText(line, X + Width / 2, Y);
	} else MainCanvas.fillText(Text, X + Width / 2, Y + Height / 2);

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

// Draw a basic empty rectangle
function DrawEmptyRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.lineWidth = '3';
	MainCanvas.strokeStyle = Color;
	MainCanvas.stroke();
	MainCanvas.closePath();
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