// Loads the full set assets
function AssetFemale3DCGLoad() {
	
	var F = "Female3DCG";
	
	// Body group
	AssetGroupAdd(F, "Body", "", false, ["White", "Asian", "Black"], 1, 0, 0, true, false);
	AssetAdd("Small", 0, 0);
	AssetAdd("Normal", 0, 0);
	AssetAdd("Large", 0, 0);
	AssetAdd("XLarge", 0, 0);

	// Eyes group
	AssetGroupAdd(F, "Eyes", "", false, ["#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"], 2, 200, 150, false, true);
	AssetAdd("Eyes1", 0, 0);
	AssetAdd("Eyes2", 0, 0);
	AssetAdd("Eyes3", 0, 0);
	AssetAdd("Eyes4", 0, 0);
	AssetAdd("Eyes5", 0, 0);
	AssetAdd("Eyes6", 0, 0);
	AssetAdd("Eyes7", 0, 0);
	AssetAdd("Eyes8", 0, 0);
	AssetAdd("Eyes9", 0, 0);
	AssetAdd("Eyes10", 0, 0);
	AssetAdd("Eyes11", 0, 0);
	
	// Bra group
	AssetGroupAdd(F, "Bra", "Body", true, ["#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"], 3, 150, 200, true, false);
	AssetAdd("Bra1", 0, 0);
	AssetAdd("Bra2", 0, 0);
	AssetAdd("Bra7", 0, 0);

	// Panties group
	AssetGroupAdd(F, "Panties", "Body", true, ["#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"], 4, 150, 450, true, false);
	AssetAdd("Panties1", 0, 0);
	AssetAdd("Panties7", 0, 0);
	AssetAdd("Panties8", 0, 0);
	AssetAdd("Panties11", 0, 0);	

	// Socks group
	AssetGroupAdd(F, "Socks", "Body", true, ["#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"], 5, 125, 500, true, false);
	AssetAdd("Socks1", 0, 0);	
	AssetAdd("Socks2", 0, 0);	
	AssetAdd("Socks3", 0, 0);	
	AssetAdd("Socks4", 0, 0);	
	AssetAdd("Socks5", 0, 0);
	
	// Shoes group
	AssetGroupAdd(F, "Shoes", "Body", true, ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"], 6, 125, 500, true, false);
	AssetAdd("Shoes1", 0, 6);
	AssetAdd("Shoes2", 0, 6);
	AssetAdd("Shoes4", 0, 6);
	AssetAdd("Sneakers1", 0, 3);
	AssetAdd("Sneakers2", 0, 3);
	AssetAdd("Heels1", 0, 15);
	AssetAdd("Boots1", 0, 9);

	// Cloth group
	AssetGroupAdd(F, "Cloth", "Body", true, ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"], 7, 0, 0, true, false);
	AssetAdd("CollegeOutfit1", 100, 0);
	AssetAdd("StudentOutfit1", 0, 0);
	AssetAdd("SummerDress1", 0, 0);
	
	// Hair group
	AssetGroupAdd(F, "Hair", "", false, ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"], 8, 150, 50, true, false);
	AssetAdd("Hair1", 0, 0);
	AssetAdd("Hair2", 0, 0);
	AssetAdd("Hair3", 0, 0);
	AssetAdd("Hair4", 0, 0);
	AssetAdd("Hair5", 0, 0);
	AssetAdd("Hair6", 0, 0);
	AssetAdd("Hair7", 0, 0);
	AssetAdd("Hair8", 0, 0);
	AssetAdd("Hair9", 0, 0);	
	
}