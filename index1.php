<!doctype html>
<html>
    
    <head>
    
        <meta charset="utf-8">
        <title>Login</title>
        <style type="text/css">
  h1{text-align: center;
  }
  table{
    width: 25%;
    background-color:#FFC;
    border: 2px dotted #F00;
    margin: auto; 
  }
  .izq{text-align: right;

  }
  .der{
    text-align: left;
  }
  td{
    text-align: center;
    padding: 10px;
  } 
  



</style>  
        
    </head>
    
    <body>
          <?php 
          if(isset($_GET['logout']))
          {
            
            
          }
        ?>
    
       
         <?php
        if(isset($_GET['error'])==true){
          $message = "Username and/or Password incorrect.\\nTry again.";
          echo "<script type='text/javascript'>alert('$message');</script>";
        }  



        ?>
        <script type="text/javascript">
  $(document).on('click', '.formsubmitbutton', function(e) {
      e.preventDefault();
      $.ajax({
          type: "POST",
          url: $(".form").attr('action'),
          data: $(".form").serialize(),
          success: function(response) {
               if (response === "success") {
                   
               } else {
                     alert("invalid username/password.  Please try again");
               }
          }
      });
  });
      </script>  
<h1> Introduce your data </h1>
<form action="pagina_datos_perfiles.php " method="get" >
<table>
<tr>
<td class="izq">
Login:</td> <td class="der" ><input type="email" name="usu"   ></td></tr> 
<tr><td class="izq ">password:</td>
<td class="der"><input type="password" name="con">
<tr><td colspan="2" ><input type="submit" name="enviando" value="Login"></td></tr>
 <tr><td colspan="2" ><input type="button" onClick="location.href='Formulario_inserta_perfiles.php'" value="register"></td></tr> 
</td> 
</tr>
</table>
<p>
  
</p>

<table>
<h1> Game </h1>
 <tr> <td class="izq"> 
  Когда игра заканчивается, вы можете начать снова, если вы нажмете пробел или если вы хотите закончить, нажмите ESC.
  <p>чтобы начать, игрок 1 и игрок 2 должны быть связаны</p>    </td> <td class="der" > </td></tr> 
  <tr><td colspan="2" ><input type="button" onClick="location.href='server.php'" value="Player 1"></td></tr>
 <tr><td colspan="2" ><input type="button" onClick="location.href='client.php'" value="PLayer2"></td></tr> 
 
</table>
    
</form>    
    </body>
    
</html>