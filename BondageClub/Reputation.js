// Pushes the reputation to the server
function ReputationSave(R) {
	AccountRequest("reputation_set", "&type=" + R.Type + "&value=" + R.Value);
}

// When we need to alter a reputation (positive or negative)
function ReputationChange(RepType, RepValue, Push) {

	// Nothing will be done for a zero change
	if (RepValue != 0) {
		
		// If the reputation already exists, we update and push it
		for (var R = 0; R < Player.Reputation.length; R++)
			if (Player.Reputation[R].Type == RepType) {
				Player.Reputation[R].Value = Player.Reputation[R].Value + RepValue;
				if (Player.Reputation[R].Value > 100) Player.Reputation[R].Value = 100;
				if (Player.Reputation[R].Value < -100) Player.Reputation[R].Value = -100;
				if ((Push == null) || Push) ReputationSave(Player.Reputation[R]);
				return;
			}
		
		// Creates the new reputation
		var NewRep = {
			Type: RepType,
			Value: RepValue
		}
		if (NewRep.Value > 100) NewRep.Value = 100;
		if (NewRep.Value < -100) NewRep.Value = -100;
		Player.Reputation.push(NewRep);
		if ((Push == null) || Push) ReputationSave(NewRep);

	}

}

// Loads the reputation data
function ReputationLoad(NewRep) {

	// Make sure we have something to load
	if (NewRep != null) {

		// Add each reputation entry one by one
		for (var R = 0; R < NewRep.length; R++)
			ReputationChange(NewRep[R].Type, NewRep[R].Value, false);

	}
	
}
