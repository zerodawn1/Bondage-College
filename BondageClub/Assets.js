var Asset = [];
var AssetGroup = [];
var AssetCurrentFamily;
var AssetCurrentGroup;

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAssetGroupName, NewAssetFatherGroupName, NewAssetGroupAllowNone, NewAssetColorSchema, NewAssetDrawingPriority, NewAssetDrawingLeft, NewAssetDrawingTop, NewAssetDrawingFullAlpha, NewAssetDrawingBlink) {
	var A = {
		Family: NewAssetFamily,
		Name: NewAssetGroupName,
		FatherGroupName: (NewAssetFatherGroupName == null) ? "" : NewAssetFatherGroupName,
		AllowNone: (NewAssetGroupAllowNone == null) ? true : NewAssetGroupAllowNone,
		ColorSchema: (NewAssetColorSchema == null) ? ["Default"] : NewAssetColorSchema,
		DrawingPriority: (NewAssetDrawingPriority == null) ? 0 : NewAssetDrawingPriority,
		DrawingLeft: (NewAssetDrawingLeft == null) ? 0 : NewAssetDrawingLeft,
		DrawingTop: (NewAssetDrawingTop == null) ? 0 : NewAssetDrawingTop,
		DrawingFullAlpha: (NewAssetDrawingFullAlpha == null) ? true : NewAssetDrawingFullAlpha,
		DrawingBlink: (NewAssetDrawingBlink == null) ? false : NewAssetDrawingBlink
	}
	AssetGroup.push(A);
	AssetCurrentGroup = A;
}

// Adds a new asset to the main list
function AssetAdd(NewAssetName, NewAssetValue, NewAssetHeightModifier) {
	var A = {
		Group: AssetCurrentGroup,
		Name: NewAssetName,
		Value: (NewAssetValue == null) ? 0 : NewAssetValue,
		HeightModifier: (NewAssetHeightModifier == null) ? 0 : NewAssetHeightModifier
	}
	Asset.push(A);
}

// Loads a specific asset file
function AssetLoad(A, Family) {
	
	// For each group in the asset file
	var G;
	for (G = 0; G < A.length; G++) {
		
		// Creates the asset group
		AssetGroupAdd(Family, A[G].Group, A[G].FatherGroup, A[G].AllowNone, A[G].Color, G, A[G].Left, A[G].Top, A[G].FullAlpha, A[G].Blink);

		// Add each assets in the group 1 by 1
		var I;
		for (I = 0; I < A[G].Asset.length; I++)
			if (A[G].Asset[I].Name == null)
				AssetAdd(A[G].Asset[I], 0, 0)
			else
				AssetAdd(A[G].Asset[I].Name, A[G].Asset[I].Value, A[G].Asset[I].Height);

	}
	
}

// Reset and load all the assets
function AssetLoadAll() {
	AssetCurrentFamily = "Female3DCG";
	Asset = [];
	AssetGroup = [];
	AssetLoad(AssetFemale3DCG, "Female3DCG");
}