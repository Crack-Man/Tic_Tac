<?php
    session_start ();
	include("db.php");
	if(isset($_POST["vvod"])) {
        $Email = htmlspecialchars ($_POST["EMAIL"]);
        $Login = htmlspecialchars ($_POST["NICKNAME"]);
        $Password = htmlspecialchars ($_POST["PASSWORD1"]);
		$Password1 = htmlspecialchars ($_POST["PASSWORD2"]);
		$Mes = "";
						
		$Error_EMAIL = "";
		$Error_Login = "";
        $Error_Password = "";
        $Error_Password1 = "";
        $Error = False;	
        		
		if($Email == "" || !preg_match ("/@/", $_POST["EMAIL"])) {
			$Error_EMAIL = "Введите адрес.";
			$Error = True;
		}
						
		if($Login == "") {
			$Error_Login = "Введите логин.";
			$Error = True;
		}
        
        if($Password == "") {
			$Error_Password = "Введите пароль.";
			$Error = True;
        }
        
        if($Password != $Password1) {
			$Error_Password1 = "Пароли не совпадают.";
			$Error = True;
        }
        
        $sql_login = "SELECT * FROM users WHERE login = '$Login'";
        $result_login = mysqli_query($conn, $sql_login);
        $row_login = $result_login->fetch_array(MYSQLI_ASSOC);
        $test_login = $row_login['id'];
        if($test_login != NULL) {
            $Error_Login = "Такой логин уже существует.";
			$Error = True;
        }
        
        $sql_email = "SELECT * FROM users WHERE login = '$Email'";
        $result_email = mysqli_query($conn, $sql_email);
        $row_email = $result_email->fetch_array(MYSQLI_ASSOC);
        $test_email = $row_email['id'];
        if($test_email != NULL) {
            $Error_email = "Такой E-Mail уже существует.";
			$Error = True;
        }

		if(!$Error) {
            $options = [
                'cost' => 5,
            ];
            $Password_Hash = password_hash($Password, PASSWORD_BCRYPT, $options);
            $sql = "INSERT INTO `users` VALUES (
                id,
                '$Email',
                '$Login',
                '$Password'
				)";
			$result = mysqli_query($conn, $sql) or die("Ошибка ".mysqli_error($conn));
            $Mes = "Регистрация выполнена успешно.";
		}
	}
?>

<html>

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style_VhodReg.css" media="screen" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>КРЕСТИКИ НОЛИКИ</title>
</head>

<body>
	<div class="glavnaya"><a href="INDEX.php">ГЛАВНАЯ</a></div>	
	<div class="vhod" ><a href="VHOD.php">ВХОД</a></div>
	<div class="reg"><a href="REG.php">РЕГИСТРАЦИЯ</a></div>	

	<div class=N0>
		<div class=N1>
			КРЕСТИКИ НОЛИКИ
		</div>
	</div>
	
	<form class="blockreg" method="post">
		<input class="E-MAIL" type="text" name="NICKNAME" placeholder="NICKNAME">
		<input class="PASSWORD" type="e-mail" name="EMAIL" placeholder="E-MAIL">
		<input class="PASSWORD" type="password" name="PASSWORD1" placeholder="PASSWORD">
		<input class="PASSWORD" type="password" name="PASSWORD2" placeholder="CONFIRM PASSWORD">
		<input class="vvod" type="submit" name="vvod" value="Зарегистрироваться" autocomplete="off">
	</form>
</body>

</html>