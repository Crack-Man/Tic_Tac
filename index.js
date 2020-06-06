
let socket = new WebSocket("ws://localhost:3000"), authSend;

const content = document.getElementById('content').innerHTML;
auth = '<div class="shadow"></div><form class="blockvhod" id="blockvhod"><div style="color: font-size: 20px; color: #00e600; cursor: pointer;" onclick="window.open(\'http://tictac/REG.PHP\', \'_blank\');">ЗАРЕГИСТРИРОВАТЬСЯ</div><input class="E-MAIL" id="authEmail" type="text" name="E-MAIL" placeholder="E-MAIL"><input class="PASSWORD" id="authPassword" type="password" name="PASSWORD" placeholder="PASSWORD"><div class="vvod" id="submitAuth">ВОЙТИ</div><div id="Error"></div></form></div>';
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
            //document.getElementById('blockvhod').innerHTML += '<div class="Error">Неверный E-Mail или пароль</div>';
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
            let msg = document.getElementById('messageGame');
            let game = document.getElementById('game');
            msg.style.display = 'block';
            game.style.display = 'block';
            first = message.data.logHost;
            second = message.data.logGuest;
            turn = message.data.turn;
            wait = message.data.wait;
            if((first == lg) || (second == lg)) {
                if(message.data.x == lg) {
                    // alert('Игра началась');
                    msg.style.color = 'yellow'
                    msg.innerHTML="ВАШ ХОД";
                    krest = 1;
                }
                if(message.data.x != lg) {
                    // alert('Игра началась');
                    msg.style.color = 'yellow'
                    msg.innerHTML="ХОД СОПЕРНИКА";
                    krest = 2;
                }
            }
        }
        if(message.subtype == 'processGame') {
            let lg = document.getElementById('login').innerHTML;
            first = message.data.logHost;
            second = message.data.logGuest;
            turn = message.data.turn;
            wait = message.data.wait;
            let msg = document.getElementById('messageGame');
            if((first == lg) || (second == lg)) {
                if(message.data.figure == 1) {
                    document.getElementById(message.data.idField).innerHTML = '<img src="images/krest.png" width=100% height=100% />';
                } else if(message.data.figure == 2) {
                    document.getElementById(message.data.idField).innerHTML = '<img src="images/nol.png" width=100% height=100% />';
                }
                if(turn == lg) {
                    if(krest == 1) {
                        msg.style.color = 'yellow';
                    } else if(krest == 2) {
                        msg.style.color = '#00e600';
                    }
                    msg.innerHTML = 'ВАШ ХОД';
                } else if(wait == lg) {
                    if(krest == 1) {
                        msg.style.color = '#00e600';
                    } else if(krest == 2) {
                        msg.style.color = 'yellow';
                    }
                    msg.innerHTML="ХОД СОПЕРНИКА";
                }
                if(checkGame() != 'continue') {
                    document.getElementById("dele").style.display = 'block';
                    let lg = document.getElementById('login').innerHTML;
                    if(checkGame() == 'win') {
                        if(krest == 1) {
                            msg.style.color = 'yellow';
                            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
                            socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'endWin', win: lg}));
                        } else if(krest == 2) {
                            msg.style.color = '#00e600';
                            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
                            socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'endWin', win: lg}));
                        }
                    } else if(checkGame() == 'lose') {
                        if(krest == 1) {
                            msg.style.color = '#00e600';
                            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
                            socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'endLose', lose: lg}));
                        } else if(krest == 2) {
                            msg.style.color = 'yellow';
                            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
                            socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'endLose', lose: lg}));
                        }
                    } else if(checkGame() == 'draw') {
                            console.log('НИЧЬЯ');
                            msg.style.color = 'white';
                            msg.innerHTML = 'НИЧЬЯ';
                            socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'endDraw', draw: lg}));
                    }
                }
            }
        }
        if(message.subtype == 'stat') {
            document.getElementById('win').innerHTML = message.data.win;
            document.getElementById('lose').innerHTML = message.data.lose;
            document.getElementById('draw').innerHTML = message.data.draw;
        }
    }
}

function Out() {
    console.log('Выходим');
    $.cookie("session", null);
    location.reload();
}

$('#submitAuth').click(sendDataAuth);

function clicked(id) {
    let lg = document.getElementById('login').innerHTML;
    if(checkGame() == 'continue') {
        if(turn == lg) {
            if(document.getElementById(id).innerHTML == '') {
                if(krest == 1) {
                    document.getElementById(id).innerHTML = '<img src="images/krest.png" width=100% height=100% />';
                    socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'addFigure', data: {logHost: first, logGuest: second, idField: id, turn: wait, wait: turn, figure: krest}}));
                } else if(krest == 2) {
                    document.getElementById(id).innerHTML = '<img src="images/nol.png" width=100% height=100% />';
                    socket.send(JSON.stringify({type: 'game', subtype: 'play', total: 'addFigure', data: {logHost: first, logGuest: second, idField: id, turn: wait, wait: turn, figure: krest}}));
                }
            }
        }
    }
}


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

function closeGame() {
    document.getElementById("1").innerHTML = '';
    document.getElementById("2").innerHTML = '';
    document.getElementById("3").innerHTML = '';
    document.getElementById("4").innerHTML = '';
    document.getElementById("5").innerHTML = '';
    document.getElementById("6").innerHTML = '';
    document.getElementById("7").innerHTML = '';
    document.getElementById("8").innerHTML = '';
    document.getElementById("9").innerHTML = '';
    document.getElementById("game").style.display = 'none';
    document.getElementById("messageGame").style.display = 'none';
    document.getElementById("dele").style.display = 'none';
}

function del() {
    let lg = document.getElementById('login').innerHTML;
    console.log('Удаляем комнату');
    socket.send(JSON.stringify({type: 'game', subtype: 'deleteGame', data: {login: lg}}));
}

function checkGame() {
    let krestik = '<img src="images/krest.png" width="100%" height="100%">';
    let nolik = '<img src="images/nol.png" width="100%" height="100%">';
    msg = document.getElementById('messageGame');
    // КРЕСТИК ВЫИГРАЛ
    if (document.getElementById("1").innerHTML == krestik && document.getElementById("2").innerHTML == krestik && document.getElementById("3").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("4").innerHTML == krestik && document.getElementById("5").innerHTML == krestik && document.getElementById("6").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("7").innerHTML == krestik && document.getElementById("8").innerHTML == krestik && document.getElementById("9").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("1").innerHTML == krestik && document.getElementById("4").innerHTML == krestik && document.getElementById("7").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("2").innerHTML == krestik && document.getElementById("5").innerHTML == krestik && document.getElementById("8").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("3").innerHTML == krestik && document.getElementById("6").innerHTML == krestik && document.getElementById("9").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("1").innerHTML == krestik && document.getElementById("5").innerHTML == krestik && document.getElementById("9").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("3").innerHTML == krestik && document.getElementById("5").innerHTML == krestik && document.getElementById("7").innerHTML == krestik) {
        if(krest == 1) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 2) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else

    // НОЛИК ВЫИГРАЛ
    if (document.getElementById("1").innerHTML == nolik && document.getElementById("2").innerHTML == nolik && document.getElementById("3").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ВЫ ПРОИГРАЛИ';
            return 'lose';
        }
    } else
    if (document.getElementById("4").innerHTML == nolik && document.getElementById("5").innerHTML == nolik && document.getElementById("6").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("7").innerHTML == nolik && document.getElementById("8").innerHTML == nolik && document.getElementById("9").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("1").innerHTML == nolik && document.getElementById("4").innerHTML == nolik && document.getElementById("7").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("2").innerHTML == nolik && document.getElementById("5").innerHTML == nolik && document.getElementById("8").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("3").innerHTML == nolik && document.getElementById("6").innerHTML == nolik && document.getElementById("9").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("1").innerHTML == nolik && document.getElementById("5").innerHTML == nolik && document.getElementById("9").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("3").innerHTML == nolik && document.getElementById("5").innerHTML == nolik && document.getElementById("7").innerHTML == nolik) {
        if(krest == 2) {
            msg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (krest == 1) {
            msg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("1").innerHTML != '' && document.getElementById("2").innerHTML != '' && document.getElementById("3").innerHTML != '' && document.getElementById("4").innerHTML != '' && document.getElementById("5").innerHTML != '' && document.getElementById("6").innerHTML != '' && document.getElementById("7").innerHTML != '' && document.getElementById("8").innerHTML != '' && document.getElementById("9").innerHTML != '') {
        msg.innerHTML = 'НИЧЬЯ';
        return 'draw';
    } else
    return 'continue';
}