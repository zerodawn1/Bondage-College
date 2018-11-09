var Log = [];

// Add a new log to the server side
function LogAdd(NewLogName, NewLogGroup) {

	// Checks to make sure we don't duplicate a log
	AddToLog = true;
	var L;
	for (L = 0; L < Log.length; L++)
		if ((Log[L].Name == NewLogName) && (Log[L].Group == NewLogGroup)) {
			AddToLog = false;
			break;
		}

	// Adds a new log object if we need to
	if (AddToLog) {
		var NewLog = {
			Name: NewLogName,
			Group: NewLogGroup
		}
		Log.push(NewLog);
	}

	// Sends the log 
	if (Character[0].AccountName != "")
		CharacterAccountRequest("log_add", "&name=" + NewLogName + "&group=" + NewLogGroup);

}

// Checks if the log exists, return true if it does
function LogQuery(QueryLogName, QueryLogGroup) {
	var L;
	for (L = 0; L < Log.length; L++)
		if ((Log[L].Name == QueryLogName) && (Log[L].Group == QueryLogGroup))
			return true;
	return false;
}

