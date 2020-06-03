<?php
	$servername = "tictac";
	$username = "root";
	$password = "";
	$db = "tictac";
	$conn = mysqli_connect($servername,$username,$password,$db);
	if (!$conn) {
		die("connection failed: ".mysqli_connect_error());
		}
	$conn -> set_charset("utf8");
?>