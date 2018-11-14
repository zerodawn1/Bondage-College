// Main variables
var CurrentScreen;
var CurrentCharacter = null;
var MouseX = 0;
var MouseY = 0;
var KeyPress = "";
var Common_IsMobile = false;
var Common_CurrentTimer = 0;
var Common_RunInterval = 20;
var Common_CSVCache = {};

// Returns TRUE if the variable is a number
function Common_IsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Returns the current date and time in a yyyy-mm-dd hh:mm:ss format
function Common_GetFormatDate() {
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
	var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	return "".concat(yyyy).concat("-").concat(mm).concat("-").concat(dd).concat(" ").concat(hh).concat(":").concat(min).concat(":").concat(ss);
}

// Used to detect whether the users browser is an mobile browser
function Common_DetectMobile() {

	// First check
    if (sessionStorage.desktop) return false;
    else if (localStorage.mobile) return true;

    // Alternative check
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile','mobile/'];
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    // If nothing is found, we assume desktop
    return false;
}

// Parse a CSV file
function Common_ParseCSV(str) {
		
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline and we're not in a quoted field, move on to the next
        // row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

// Read a CSV file from the web site
function Common_ReadCSV(Array, Path, Screen, File) {
	
    // Changed from a single path to various arguments and internally concatenate them
    // This ternary operator is used to keep backward compatibility
    var FullPath = Path + "/" + Screen + "/" + File + "_" + Common_GetWorkingLanguage() + ".csv";    
    if (Common_CSVCache[FullPath]) {
		window[Array] = Common_CSVCache[FullPath];
        return;
    }
    
    // Opens the file, parse it and returns the result in an Object
    Common_Get(FullPath, function() {
        if (this.status == 200) {
            Common_CSVCache[FullPath] = Common_ParseCSV(this.responseText);
			window[Array] = Common_CSVCache[FullPath];
        }
    });
}

// Returns a working language if translation isn't fully ready
function Common_GetWorkingLanguage() {
	return "EN";
}

// AJAX utility
function Common_Get(Path, Callback) {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", Path);
    xhr.onreadystatechange = function() { if (this.readyState == 4) Callback.bind(this)(); };
    xhr.send(null);
}

// Shuffles all array elements at random
function ArrayShuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// Calls a dynamic function (if it exists)
function DynamicFunction(FunctionName) {
	if (typeof window[FunctionName.substr(0, FunctionName.indexOf("("))] == "function") {
		var Fct = new Function(FunctionName);
		Fct();
	} else console.log("Trying to launch invalid function: " + FunctionName);
}

// Returns the text for the current scene associated with the tag
function GetText(Tag) {

	// Make sure the text CSV file is loaded
	if (CurrentText != null) {
		
		// Cycle the text to find a matching tag and returns the text content
		Tag = Tag.trim().toUpperCase();
		for (var T = 0; T < CurrentText.length; T++)
			if (CurrentText[T][TextTag].trim().toUpperCase() == Tag)
				return CurrentText[T][TextContent].trim();
		
		// Returns an error message
		return "MISSING TEXT FOR TAG: " + Tag.trim();

	} else return "";

}

// Returns the text for a specific CSV associated with the tag
function GetCSVText(CSVText, Tag) {

	// Make sure the text CSV file is loaded
	if (CSVText != null) {
		
		// Cycle the text to find a matching tag and returns the text content
		Tag = Tag.trim().toUpperCase();
		for (var T = 0; T < CSVText.length; T++)
			if (CSVText[T][TextTag].trim().toUpperCase() == Tag)
				return CSVText[T][TextContent].trim();
		
		// Returns an error message
		return "MISSING TEXT FOR TAG: " + Tag.trim();

	} else return "";

}

// Creates a path from the supplied paths parts
function GetPath(paths) {
    var path = arguments[0];
    for (var index = 1; index < arguments.length; index++) {
        path += "/" + arguments[index];
    }
    return path;
}

// Convert a hex color string to a RGB color
function HexToRGB(color) {
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

// Returns the hex value of a RGB data
function RGBToHex(rgb){
	var rgb = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)  
};

// Sets the current screen and calls the loading
function SetScreen(NewScreen) {
	CurrentScreen = NewScreen;
	DynamicFunction(CurrentScreen + "_Load()");
}

// Sorts a list of objects based on a key property
function SortObjectList(list, key) {
    function compare(a, b) {
        a = a[key];
        b = b[key];
        var type = (typeof(a) === 'string' ||
                    typeof(b) === 'string') ? 'string' : 'number';
        var result;
        if (type === 'string') result = a.localeCompare(b);
        else result = a - b;
        return result;
    }
    return list.sort(compare);
}