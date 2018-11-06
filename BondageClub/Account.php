<?php header("content-type: text/plain; charset=utf-8"); ?>

<?php

// There needs to be a command first
if (isset($_GET["command"])) {

	// Checks if all the parameters are there to create an account
	if ($_GET["command"] == "create_account")
		if (isset($_GET["name"]) && isset($_GET["password"]) && ($_GET["name"] != "") && ($_GET["password"] != "")) {
			
			// The character file is named like her, we check if it already exists
			$file = 'Characters/'.$_GET["name"].'.json';	
			if (!file_exists($file)) {
				$arr = array('Name' => $_GET["name"], 'Password' => password_hash($_GET["password"], PASSWORD_DEFAULT));
				$handle = fopen($file, 'w') or die('Cannot open file:  '.$file);
				fwrite($handle, json_encode($arr));
				fclose($handle);
				echo "account_created";		
			} else echo "account_already_exist";

		} else echo "parameter_error";

	// Checks if all the parameters are there to log in
	if ($_GET["command"] == "log_account") 
		if (isset($_GET["name"]) && isset($_GET["password"]) && ($_GET["name"] != "") && ($_GET["password"] != "")) {
			
			// The character file is named like her, we check if it already exists
			$file = 'Characters/'.$_GET["name"].'.json';	
			if (file_exists($file)) {
				$myfile = fopen($file, "r") or die("Unable to open file!");
				$data = fread($myfile, filesize($file));
				fclose($myfile);
				$arr = json_decode($data);
				if (password_verify($_GET["password"], $arr->Password)) {
					echo $data;
				} else echo "invalid_password";
			} else echo "account_doesnt_exist";

		} else echo "parameter_error";
	
} else echo "no_command_error";

?>