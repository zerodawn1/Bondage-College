// Main game objects
var App = require('http').createServer()
var IO = require('socket.io')(App);
var BCrypt = require('bcrypt');
var Account = [];
var Database;
var DatabaseClient = require('mongodb').MongoClient;
var DatabaseURL = "mongodb://localhost:27017/BondageClubDatabase";

// Connects to the Mongo Database
DatabaseClient.connect(DatabaseURL, { useNewUrlParser: true }, function(err, db) {
	
	// Keeps the database object
	if (err) throw err;
	console.log("****************************************");
	console.log("Bondage Club database connected");
	Database = db.db("BondageClubDatabase");
	//Database.collection("Accounts").findOne({}, function(err, result) { console.log(result); });
	//Database.collection("Accounts").deleteMany({}, function(err, result) { console.log("All accounts deleted"); });
	
	// Listens for clients on port 4288
	App.listen(4288, function () {
		
		// Sets up the Client/Server events
		console.log("Bondage Club server is listening on 4288");
		console.log("****************************************");
		IO.on("connection", function (socket) {
			socket.id = Math.round(Math.random() * 1000000000000);
			socket.emit("ServerMessage", "Connected to the Bondage Club Server");
			socket.on("AccountCreate", function (data) { AccountCreate(data, socket) });
			socket.on("AccountLogin", function (data) { AccountLogin(data, socket) });
			socket.on("AccountUpdate", function (data) { AccountUpdate(data, socket) });
			socket.on("AccountDisconnect", function () { AccountRemove(socket.id) });
			socket.on('disconnect', function() { AccountRemove(socket.id) });
			AccountSendServerInfo(socket);
		});
		
		// Refreshes the server information to clients each 30 seconds
		setInterval(AccountSendServerInfo(null), 30000);
		
	});
	
});

// Sends the server info to all players or one specific player (socket)
function AccountSendServerInfo(socket) {
	var SI = {
		Time = new Date().getTime(),
		OnlinePlayers = Account.length
	}
	if (socket != null) sockets.emit("ServerInfo", SI);
	else IO.sockets.emit("ServerInfo", SI);
}

// Creates a new account by creating its file
function AccountCreate(data, socket) {

	// Makes sure the account comes with a name and a password
	if ((data.Name != null) && (data.AccountName != null) && (data.Password != null) && (data.Email != null)) {		
	
		// Makes sure the data is valid
		var LN = /^[a-zA-Z0-9 ]+$/;
		var LS = /^[a-zA-Z ]+$/;
		var E = /^[a-zA-Z0-9@.]+$/;
		if (data.Name.match(LS) && data.AccountName.match(LN) && data.Password.match(LN) && (data.Email.match(E) || data.Email == "") && (data.Name.length > 0) && (data.Name.length <= 20) && (data.AccountName.length > 0) && (data.AccountName.length <= 20) && (data.Password.length > 0) && (data.Password.length <= 20) && (data.Email.length <= 100)) {
	
			// Checks if the account already exists
			data.AccountName = data.AccountName.toUpperCase();
			Database.collection("Accounts").findOne({ AccountName : data.AccountName }, function(err, result) {

				// Makes sure the result is null so the account doesn't already exists
				if (err) throw err;
				if (result != null) {
					socket.emit("CreationResponse", "Account already exists");			
				} else {
				
					// Creates a hashed password and saves it with the account info
					BCrypt.hash(data.Password.toUpperCase(), 10, function( err, hash ) {
						if (err) throw err;
						console.log("Creating new account: " + data.AccountName + "  ID: " + socket.id.toString());
						data.Password = hash;
						data.ID = socket.id;
						Account.push(data);
						Database.collection("Accounts").insertOne(data, function(err, res) {
							if (err) throw err;
							console.log("Account created");
						});
						socket.emit("CreationResponse", "AccountCreated");
					});
					
				}
				
			});
			
		}

	} else socket.emit("CreationResponse", "Invalid account information");
	
}

// Load a single account file
function AccountLogin(data, socket) {

	// Makes sure the login comes with a name and a password
	if ((data.AccountName != null) && (data.Password != null)) {

		// Checks if there's an account that matches the name 
		data.AccountName = data.AccountName.toUpperCase();
		Database.collection("Accounts").findOne({ AccountName : data.AccountName}, function(err, result) {	
			if (err) throw err;
			if (result === null) {
				socket.emit("LoginResponse", "InvalidNamePassword");
			}
			else {

				// Compare the password to its hashed version
				BCrypt.compare(data.Password.toUpperCase(), result.Password, function( err, res ) {
					if (res) {
						
						// Logs the account
						console.log("Login account: " + result.AccountName + "  ID: " + socket.id.toString());
						socket.emit("LoginResponse", result);
						result.ID = socket.id;						
						Account.push(result);
						
						// Disconnect duplicated logged accounts
						for(var A = 0; A < Account.length; A++)
							if ((Account[A].AccountName == result.AccountName) && (Account[A].ID != socket.id)) {
								for(var S = 0; S < IO.sockets.length; S++)
									if (IO.sockets[S].id == Account[A].ID) {
										AccountRemove(Account[A].ID);
										IO.sockets[S].disconnect();
										break;
									}
								break;
							}

					} else socket.emit("LoginResponse", "InvalidNamePassword");
				});
				
			}			
		});
		
	} else socket.emit("LoginResponse", "InvalidNamePassword");
}

// Updates the account appearance
function AccountUpdate(data, socket) {
	for(var P = 0; P < Account.length; P++)
		if (Account[P].ID == socket.id) {
			console.log("Updating account: " + Account[P].AccountName + "  ID: " + socket.id.toString());
			Database.collection("Accounts").updateOne({ AccountName : Account[P].AccountName }, { $set: data }, function(err, res) {
				if (err) throw err;
				console.log("Account updated");
			});
		}
}

// Removes the account from the buffer
function AccountRemove(ID) {
	for(var P = 0; P < Account.length; P++)
		if (Account[P].ID == ID) {
			console.log("Disconnecting account: " + Account[P].AccountName + "  ID: " + ID.toString());
			Account.splice(P, 1);
			break;
		}
}