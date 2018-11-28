var MiniGameVictory = false;
var MiniGameType = "";
var MiniGameDifficulty = "";
var MiniGameReturnFunction = "";

// Starts a given mini game at a set difficulty and keeps a return function
function MiniGameStart(GameType, Difficulty, ReturnFunction) {
	MiniGameType = GameType;
	MiniGameDifficulty = Difficulty;
	MiniGameReturnFunction = ReturnFunction;
	MiniGameVictory = (Math.random() > 0.5);
	CommonDynamicFunction(ReturnFunction + "()");
}