var Asset = [];
var AssetGroup = [];
var AssetCurrentFamily;
var AssetCurrentGroup;

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAssetGroupName, NewAssetFatherGroupName, NewAssetGroupAllowNone, NewAssetColorSchema, NewAssetDrawingPriority, NewAssetDrawingLeft, NewAssetDrawingTop, NewAssetDrawingFullAlpha, NewAssetDrawingBlink) {
	var A = {
		Family: NewAssetFamily,
		Name: NewAssetGroupName,
		FatherGroupName: NewAssetFatherGroupName,
		AllowNone: NewAssetGroupAllowNone,
		ColorSchema: NewAssetColorSchema,
		DrawingPriority: NewAssetDrawingPriority,
		DrawingLeft: NewAssetDrawingLeft,
		DrawingTop: NewAssetDrawingTop,
		DrawingFullAlpha: NewAssetDrawingFullAlpha,
		DrawingBlink: NewAssetDrawingBlink
	}
	AssetGroup.push(A);
	AssetCurrentGroup = A;
}

// Adds a new asset to the main list
function AssetAdd(NewAssetName, NewAssetValue, NewAssetHeightModifier) {
	var A = {
		Group: AssetCurrentGroup,
		Name: NewAssetName,
		Value: NewAssetValue,
		HeightModifier: NewAssetHeightModifier
	}
	Asset.push(A);
}

// Reset and load all the assets
function AssetLoad() {
	AssetCurrentFamily = "Female3DCG";
	Asset = [];
	AssetGroup = [];
	AssetFemale3DCGLoad();	
}

