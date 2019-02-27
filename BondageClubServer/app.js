// Main game objects
var fs = require('fs');
var app = require('http').createServer()
var io = require('socket.io')(app);
var bcrypt = require('bcrypt');
var Account = [];

// Listens for clients on port 4288
app.listen(4288);
console.log("*************************************");
console.log("Bondage Club Server Listening on 4288");
console.log("*************************************");

// Client/Server events
io.on("connection", function (socket) {
	socket.id = Math.round(Math.random() * 1000000000000);
	socket.emit("ServerMessage", "Connected to the Bondage Club Server");
	socket.on("AccountCreate", function (data) { AccountCreate(data, socket) });
	socket.on("AccountLogin", function (data) { AccountLogin(data, socket) });
	socket.on("AccountUpdate", function (data) { AccountUpdate(data, socket) });
	socket.on("AccountDisconnect", function () { AccountRemove(socket.id) });
	socket.on('disconnect', function() { AccountRemove(socket.id) });
});

// Return the current time
function CommonTime() {
	return new Date().getTime();
}

// Creates a new account by creating its file
function AccountCreate(data, socket) {
	
	// Checks if the file already exists
	var FileName = "accounts/" + data.AccountName + ".json";
	fs.stat(FileName, function(err, stat) {
		if(err == null) {
			socket.emit("CreationResponse", "Account already exists");
		} else if(err.code === 'ENOENT') {
		
			// Since the file doesn't exist, we create it with the hashed password
			bcrypt.hash(data.Password, 10, function( err, hash ) {
				if (err) throw err;
				console.log("Creating new account: " + data.AccountName + "  ID: " + socket.id.toString());
				data.Password = hash;
				data.ID = socket.id;
				Account.push(data);
				AccountSave(data);
				socket.emit("CreationResponse", "AccountCreated" + CommonTime().toString());
			});

			
		} else {
			socket.emit("CreationResponse", "Error: " + err.code);
		}
		
	});
}

// Load a single account file
function AccountLogin(data, socket) {
	if ((data.AccountName != null) && (data.Password != null)) {
		fs.readFile("accounts/" + data.AccountName + ".json", function(err, data) {
			if (err) {
				socket.emit("LoginResponse", "InvalidNamePassword");
			}
			else {
				var C = JSON.parse(data);
				console.log("Login account: " + C.AccountName + "  ID: " + socket.id.toString());
				socket.emit("LoginResponse", C);
				C.ID = socket.id;
				Account.push(C);
			}
		});
	} else socket.emit("LoginResponse", "InvalidNamePassword");
}

// Saves the account data to a file
function AccountSave(data) {
	fs.writeFile("accounts/" + data.AccountName + ".json", JSON.stringify(data), function (err) {
		if (err) throw err;
	});
}

// Updates the account appearance
function AccountUpdate(data, socket) {
	for(var P = 0; P < Account.length; P++)
		if (Account[P].ID == socket.id) {
			console.log("Updating account: " + Account[P].AccountName + "  ID: " + socket.id.toString());
			if (data.Appearance != null) Account[P].Appearance = data.Appearance;
			if (data.AssetFamily != null) Account[P].AssetFamily = data.AssetFamily;
			AccountSave(Account[P]);
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