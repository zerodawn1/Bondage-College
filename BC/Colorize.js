function hexToRgb(color) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}

function Clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function ColorizeImage(imgElement, hexaColor) {
    // create hidden canvas (using image dimensions)
    //var imgElement = document.getElementById(imgId);

    var canvas = document.createElement("canvas");
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElement,0,0);

    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

    var data = imageData.data;

    // convert image to grayscale
    var rgbColor = hexToRgb(hexaColor);
	var trans;

    for(var p = 0, len = data.length; p < len; p+=4) {
        if(data[p+3] == 0)
           continue;
	    trans = (data[p] - 100) * 2;
		data[p + 0] = rgbColor.r + trans;
		data[p + 1] = rgbColor.g + trans;
		data[p + 2] = rgbColor.b + trans;
    }
    ctx.putImageData(imageData, 0, 0);

    // replace image source with canvas data
    imgElement.src = canvas.toDataURL();
}

function ColorizeImage2(imgElement, hexaColor)
{

	var canvas = document.createElement("canvas");
	canvas.width = imgElement.width;
	canvas.height = imgElement.height;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(imgElement,0,0);

	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);

  //Declare variables
  //var imgData = imgElement.getImageData(0,0,imgElement.width,imgElement.height);
  var data = imgData.data;

  var red = new Array();    
  var green = new Array(); 
  var blue = new Array(); 
  var alpha = new Array();    

  //Read image and make changes on the fly as it's read  
  for (i = 0; i < data.length; i += 4) 
  {                     
    red[i] = imgData.data[i];
    if (red[i] == 0) red[i] = 255; 
    green[i] = imgData.data[i+1];
    if (green[i] == 0) green[i] = 255;
    blue[i] = imgData.data[i+2]; // no change, blue == 0 for black and for yellow
    alpha[i] = imgData.data[i+3]; // Again, no change
  } 

  // Write the image back to the canvas
  for (i = 0; i < data.length; i += 4)  
  {
    imgData.data[i] = red[i];
    imgData.data[i+1] = green[i];
    imgData.data[i+2] = blue[i]; 
    imgData.data[i+3] = alpha[i];   
  } 

  ctx.putImageData(imgData, 0, 0);
  imgElement.src = canvas.toDataURL();
  
} 