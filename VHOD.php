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
	
	<form class="blockvhod" id="vhod" method="post">
		<input class="E-MAIL" id="authEmail" type="text" name="E-MAIL" placeholder="E-MAIL">
		<input class="PASSWORD" id="authPassword" type="text" name="PASSWORD" placeholder="PASSWORD">
		<input class="vvod" type="submit" name="submitAuth" value="ВОЙТИ" autocomplete="off">
		<div id="errorauth"></div>
	</form>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script src="index.js"></script>
</body>

</html>