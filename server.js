
let app = require('express')(),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    request = require('request'),
    sql = require('mysql');
const WebSocketLib = require('ws');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let clients = {};

app.post('/auth', function(req, res) {
    let connection = sql.createConnection({host: 'http://192.168.0.14/', user: 'root', password: '', database: 'tictac'});
    connection.connect();
    connection.query('SELECT * FROM users WHERE email = "' + req.body.email + '"', function(error, results, fields) {

    });
});

let httpp = http.createServer(app).listen(8000, function(){console.log('- http-сервер запущен');});
const WebSocket = new WebSocketLib.Server({
    port: 3000
});

console.log('- WebSocketServer запущен');

WebSocket.on('connection', ws => {
    let id = Math.random();
    clients[id] = {WebSocket: ws};
    console.log('Новое соединение ' + id);
    ws.on('message', function(message) {
        message = JSON.parse(message);
        if(message.type == 'auth') {
            console.log('Получены данные типа "auth"');
            if (message.subtype == 'authSession') {
                let connection = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                connection.connect();
                connection.query('SELECT * FROM sessions WHERE `session` = "' + message.data.session + '"', function(error, results, fields) {            
                    if(results.length != 0) {
                        clients[id].uid = results[0].uid;
                        clients[id].sid = results[0].id;
                        connection.end();
                        connection = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                        connection.connect();
                        connection.query('SELECT * FROM users WHERE `id` = ' + clients[id].uid, function(error, results, fields) {
                            clients[id].email = results[0].email;
                            let log = results[0].login;
                            connection.end();
                            ws.send(JSON.stringify({type: 'auth', total: 'successAuthSession', data: {login: log}}));
                        });
                    }
                    else {
                        ws.send(JSON.stringify({type:'auth', total: 'failed'}));
                        connection.end();
                    }
                });
            }
            if(message.subtype = 'sendAuth') {
                console.log('Пользователь нажал кнопку авторизации (сервер)');
                let connection = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                connection.connect(err => {
                    if (err) {
                        console.log('Ошибка подключения к БД' + err);
                        return err;
                    }
                    
                });
                connection.query('SELECT * FROM users WHERE `email` = "' + message.data.email + '"', function(error, results, fields) {
                    if(results.length != 0) {
                        if(message.data.password == results[0].password) {
                            console.log('Пароли совпадают');
                            clients[id].uid = results[0].id;
                            clients[id].email = results[0].email;
                            let log = results[0].login;
                            let ses = genstr();
                            console.log('Создаём куки: ' + ses);
                            ws.send(JSON.stringify({type: 'auth', total: 'successAuth', data: {session: ses, login: log}}));
                            connection.end();
                            let connectiona = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                            connectiona.connect();
                            connectiona.query('INSERT INTO sessions (session, uid) value ("'+ ses + '",' + clients[id].uid +')');
                            connectiona.end();
                        } else {
                            ws.send(JSON.stringify({type: 'auth', total: 'failedAuth'}));
                            connection.end();
                        }
                    } else {
                        ws.send(JSON.stringify({type: 'auth', total: 'failedAuth'}));
                        connection.end();
                    }
                });
            }
        } else if(message.type == 'game') {
            if(message.subtype == 'createGame') {
                let conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                conn.query('SELECT * FROM users WHERE `login` = "' + message.data.login + '"', function(error, results, fields) {
                    if(results.length != 0) {
                        idHost = results[0].id;
                        conn.end();
                        conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                        conn.connect();
                        conn.query('SELECT * FROM games WHERE `idHost` = ' + idHost, function(error, results, fields) {
                            if(results.length == 0) {
                                conn.end();
                                conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                                conn.connect();
                                conn.query('SELECT * FROM games WHERE `idGuest` = ' + idHost, function(error, results, fields) {
                                    if(results.length == 0) {
                                        conn.end();
                                        conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                                        conn.connect();
                                        conn.query('INSERT INTO games VALUES (id,' + idHost + ', 0)');
                                        conn.end();
                                        console.log('Вы можете создать комнату');
                                        ws.send(JSON.stringify({type: 'game', subtype: 'createGame', total: 'allow'}));
                                    } else {
                                        console.log('Невозможно создать комнату');
                                        ws.send(JSON.stringify({type: 'game', subtype: 'createGame', total: 'ban'}));
                                        conn.end();
                                    }
                                });
                            } else {
                                console.log('Невозможно создать комнату');
                                ws.send(JSON.stringify({type: 'game', subtype: 'createGame', total: 'ban'}));
                                conn.end();
                            }
                        });
                    }
                });
            }
        }
    });
});

function genstr() {
    let result = '';
    let words = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let max_position = words.length - 1;
    for(let i = 0; i < 30; i++) {
        position = Math.floor(Math.random() * max_position);
        result = result + words.substring(position, position + 1);
    }
    return result;
}
