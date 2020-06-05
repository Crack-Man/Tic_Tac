
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
    socket.send(JSON.stringify({type: 'game', subtype: 'who'}));
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
            pushMainContent(message.data.login, message.data.win, message.data.lose, message.data.draw);
        } else if(message.total == 'failedAuth'){
            document.getElementById('blockvhod').innerHTML += '<div class="Error">Неверный E-Mail или пароль</div>';
            $('#submitAuth').click(sendDataAuth);
        } else if(message.total == 'successAuthSession') {
            pushMainContent(message.data.login, message.data.win, message.data.lose, message.data.draw);
        }
    }
    if(message.type == 'game') {
        if(message.subtype == 'gamesList') {
            field = document.getElementById('field');
            field.innerHTML = '';
            console.log('Комнат в клиенте: ' + message.data.len);
            if(message.data.len != 0) {
                let lg = document.getElementById('login').innerHTML;
                field.innerHTML = '';
                for(let i = 0; i < message.data.len; i++) {
                    socket.send(JSON.stringify({type: 'game', subtype:'getGame', data: {index: i}}));
                    // if(socket.onmessage) {
                    //     let mes = JSON.parse(event.data);
                    //     if(mes.total == 'sendGame') {
                    //         console.log('Комната: ' + mes.data.logHost);
                    //         if(lg == mes.data.logHost) {
                    //             if(mes.data.logGuest != "") {
                    //                 field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ mes.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest">' + mes.data.logGuest + '</div><img id="delete" onclick="del();" class="image" src="images/delete.png"></div>' + field.innerHTML;
                    //             } else {
                    //                 field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ mes.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest"></div><img id="delete" onclick="del();" class="image" src="images/delete.png"></div>' + field.innerHTML;
                    //             }
                    //         } else
                    //         if(lg == mes.data.logGuest) {
                    //             field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ mes.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest">' + mes.data.logGuest + '</div><img id="delete" onclick="del();" class="image" src="images/delete.png"></div>' + field.innerHTML;
                    //         } else
                    //         if(mes.data.logGuest != "") {
                    //             field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ mes.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest">' + mes.data.logGuest + '</div></div>' + field.innerHTML;
                    //         } else {
                    //             field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">' + mes.data.logHost + '</div><input class="F4" type="submit" name="pris" value="ПРИСОЕДИНИТЬСЯ" autocomplete="off"></div>' + field.innerHTML;
                    //         }
                    //     }
                    // }                    
                }
            }
        }
        if(message.subtype == 'gamesList1') {
            if(message.total == 'sendGame') {
                console.log('Комната: ' + message.data.logHost);
                let lg = document.getElementById('login').innerHTML;
                field = document.getElementById('field');
                if(lg == message.data.logHost) {
                    if(message.data.logGuest != "") {
                        field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ message.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest">' + message.data.logGuest + '</div><img id="delete" onclick="del();" class="image" src="images/delete.png"></div>' + field.innerHTML;
                    } else {
                        field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ message.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest"></div><img id="delete" onclick="del();" class="image" src="images/delete.png"></div>' + field.innerHTML;
                    }
                } else
                if(lg == message.data.logGuest) {
                    field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ message.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest">' + message.data.logGuest + '</div>' + field.innerHTML;
                } else
                if(message.data.logGuest != "") {
                    field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ message.data.logHost +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest">' + message.data.logGuest + '</div></div>' + field.innerHTML;
                } else {
                    field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">' + message.data.logHost + '</div><button id="'+ lg +'" onclick="socket.send(JSON.stringify({type: \'game\', subtype: \'joinGame\', total: \'ask\', data: {logHost: this.id, logGuest: document.getElementById(\'login\').innerHTML}}));" class="F4">ПРИСОЕДИНИТЬСЯ</button></div>' + field.innerHTML;
                }
            }
        }
        if(message.subtype == 'createGame') {
            if(message.total == 'allow') {
                lg = message.data.login;
                console.log('Игрок ' + message.data.login + ' создаёт комнату');
                field = document.getElementById('field');
                if(lg == document.getElementById('login').innerHTML) {
                    field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">'+ lg +'</div><div class="F2">ВОШЕДШИЙ</div><div class="F3" id="guest"></div><img id="delete" onclick="del();" class="image" src="images/delete.png"></div>' + field.innerHTML;
                } else {
                    field.innerHTML = '<div class="F1"><div class="F2">СОЗДАТЕЛЬ</div><div class="F3">' + lg + '</div><button id="'+ lg +'" onclick="socket.send(JSON.stringify({type: \'game\', subtype: \'joinGame\', total: \'ask\', data: {logHost: this.id, logGuest: document.getElementById(\'login\').innerHTML}}));" class="F4">ПРИСОЕДИНИТЬСЯ</button></div>' + field.innerHTML;
                }
                
            }
        }
        if(message.subtype == 'allowGame') {
            socket.send(JSON.stringify({type: 'game', subtype: 'joinGame', total: 'update', data: {logHost: message.data.logHost, logGuest: message.data.logGuest}}));
        }
        if(message.subtype == 'startGame'){
            let lg = document.getElementById('login').innerHTML;
            if((message.data.logHost == lg) || (message.data.logGuest == lg)) {
                alert('Игра началась');
            }
        }
    }
}

let btn = document.getElementsByClassName('button');
for(let i = 0; i < btn.length; i++)
    btn[i].onclick = function() {alert(this.id)};

function Out() {
    console.log('Выходим');
    $.cookie("session", null);
    location.reload();
}

$('#submitAuth').click(sendDataAuth);


function createGame() {
    let lg = document.getElementById('login').innerHTML;
    console.log('Создаём игру');
    socket.send(JSON.stringify({type: 'game', subtype: 'createGame', data: {login: lg}}));
}

function sendDataAuth() {
    console.log('Пользователь нажал кнопку авторизации (клиент)');
    socket.send(JSON.stringify({type: 'auth', subtype:'sendAuth', data: {email: $('#authEmail').val(), password: $('#authPassword').val()}}));
}

function pushMainContent(login, win, lose, draw) {
    document.getElementById('content').innerHTML = content;
    document.getElementById('vihod').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('login').innerHTML = login;
    document.getElementById('win').innerHTML = win;
    document.getElementById('lose').innerHTML = lose;
    document.getElementById('draw').innerHTML = draw;
}

function del() {
    let lg = document.getElementById('login').innerHTML;
    console.log('Удаляем комнату');
    socket.send(JSON.stringify({type: 'game', subtype: 'deleteGame', data: {login: lg}}));
}


// if(message.total == 'success') {
//     pushMainContent();
// } else if(message.total == 'failed') {
//     document.getElementById('errorauth').innerHTML += '<span>Неверно введённые данные</span>';
//     $('#submitAuth').click(sendDataAuth);
// }