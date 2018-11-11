var Asset = [];
var AssetGroup = [];
var AssetCurrentGroup;

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAsset) {
	var A = {
		Family: NewAssetFamily,
		Name: NewAsset.Group,
		ParentGroupName: (NewAsset.ParentGroup == null) ? "" : NewAsset.ParentGroup,
		Category: (NewAsset.Category == null) ? "Appearance" : NewAsset.Category,
		IsDefault: (NewAsset.Default == null) ? true : NewAsset.Default,
		AllowNone: (NewAsset.AllowNone == null) ? true : NewAsset.AllowNone,
		AllowColorize: (NewAsset.AllowColorize == null) ? true : NewAsset.AllowColorize,
		KeepNaked : (NewAsset.KeepNaked == null) ? false : NewAsset.KeepNaked,
		ColorSchema: (NewAsset.Color == null) ? ["Default"] : NewAsset.Color,
		ParentColor: (NewAsset.ParentColor == null) ? "" : NewAsset.ParentColor,
		DrawingPriority: (NewAsset.Priority == null) ? AssetGroup.length : NewAsset.Priority,
		DrawingLeft: (NewAsset.Left == null) ? 0 : NewAsset.Left,
		DrawingTop: (NewAsset.Top == null) ? 0 : NewAsset.Top,
		DrawingFullAlpha: (NewAsset.FullAlpha == null) ? true : NewAsset.FullAlpha,
		DrawingBlink: (NewAsset.Blink == null) ? false : NewAsset.Blink
	}
	AssetGroup.push(A);
	AssetCurrentGroup = A;
}

// Adds a new asset to the main list
function AssetAdd(NewAssetName, NewAssetValue, NewAssetHeightModifier) {
	var A = {
		Name: NewAssetName,
		Group: AssetCurrentGroup,
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
		AssetGroupAdd(Family, A[G]);

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
	Asset = [];
	AssetGroup = [];
	AssetLoad(AssetFemale3DCG, "Female3DCG");
}