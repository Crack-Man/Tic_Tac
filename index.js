
let socket = new WebSocket("ws://localhost:3000"), authSend;

const content = document.getElementById('content').innerHTML;
auth = '<div class="shadow"></div><form class="blockvhod" id="blockvhod"><input class="E-MAIL" id="authEmail" type="text" name="E-MAIL" placeholder="E-MAIL"><input class="PASSWORD" id="authPassword" type="password" name="PASSWORD" placeholder="PASSWORD"><div class="vvod" id="submitAuth">ВОЙТИ</div><div id="Error"></div></form></div>';

document.getElementById('content').innerHTML += auth;





socket.onopen = function() {
    console.log('- соединение с сокетом установлено');
    if($.cookie('session') != null) {
        console.log('- куки найдены');
        socket.send(JSON.stringify({type: 'auth', subtype:'authSession', data: {session: $.cookie('session')}}));
    }
};

socket.onerror = function(error) {
    console.log('Произошла ошибка: ' + error.message);
};

socket.onmessage = function(event) {
    let message = JSON.parse(event.data);
    if(message.type == 'auth') {
        if(message.total == 'successAuth') {
            console.log('Куки получены с сервера: ' + message.data.session);
            $.cookie("session", message.data.session,  {expires: 7, path: '/'});
            console.log('Куки созданы: ' + $.cookie("session"));
            pushMainContent(message.data.login);
        } else if(message.total == 'failedAuth'){
            document.getElementById('blockvhod').innerHTML += '<div class="Error">Неверный E-Mail или пароль</div>';
            $('#submitAuth').click(sendDataAuth);
        } else if(message.total == 'successAuthSession') {
            pushMainContent(message.data.login);
        }
    }
    if(message.type == 'game') {
        if(message.subtype == 'createGame') {
            if(message.total == 'allow') {
                field = document.getElementById('field');
                lg = document.getElementById('login').innerHTML;
                field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ lg +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3">НИК ВОШЕДШЕГО</div><img id="delete" class="image" src="images/delete.png"></div>' + field.innerHTML;
            }
        }
    }
}
function Out() {
    console.log('Выходим');
    $.cookie("session", null);
    location.reload();
}

$('#submitAuth').click(sendDataAuth);


function createGame() {
    lg = document.getElementById('login').innerHTML;
    console.log('Создаём игру');
    socket.send(JSON.stringify({type: 'game', subtype: 'createGame', data: {login: lg}}));
}

function sendDataAuth() {
    console.log('Пользователь нажал кнопку авторизации (клиент)');
    socket.send(JSON.stringify({type: 'auth', subtype:'sendAuth', data: {email: $('#authEmail').val(), password: $('#authPassword').val()}}));
}

function pushMainContent(login) {
    document.getElementById('content').innerHTML = content;
    document.getElementById('vihod').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('login').innerHTML = login;
}




// if(message.total == 'success') {
//     pushMainContent();
// } else if(message.total == 'failed') {
//     document.getElementById('errorauth').innerHTML += '<span>Неверно введённые данные</span>';
//     $('#submitAuth').click(sendDataAuth);
// }