var Asset = [];
var AssetGroup = [];
var AssetCurrentGroup;

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAssetGroupName, NewAssetFatherGroupName, NewAssetColorSchema, NewAssetDrawingPriority) {
	var A = {
		Family: NewAssetFamily,
		Name: NewAssetGroupName,
		FatherGroupName: NewAssetFatherGroupName,
		ColorSchema: NewAssetColorSchema,
		DrawingPriority: NewAssetDrawingPriority
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
	Asset = [];
	AssetGroup = [];
	AssetFemale3DCGLoad();	
}

