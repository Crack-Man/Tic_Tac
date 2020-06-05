
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
                            ws.send(JSON.stringify({type: 'auth', total: 'successAuthSession', data: {login: log, win: results[0].win, lose: results[0].lose, draw: results[0].draw}}));
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
                            ws.send(JSON.stringify({type: 'auth', total: 'successAuth', data: {session: ses, login: log, win: results[0].win, lose: results[0].lose, draw: results[0].draw}}));
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
            if(message.subtype == 'who') {
                let con = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                con.connect();
                con.query('SELECT * FROM games', function(error, results, fields) {
                    console.log('Комнат на сервере: ' + results.length);
                    if(results.length != 0) {
                        con.end();
                        ws.send(JSON.stringify({type: 'game', subtype: 'gamesList', data: {len: results.length}}));
                    } else {
                        con.end();
                    }
                });
            }
            if(message.subtype == 'createGame') {
                let logHost = message.data.login;
                let con = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                con.connect(function(err) {
                    if (err) {
                      console.error('error connecting: ' + err.stack);
                      return;
                    }
                });
                con.query('SELECT * FROM games WHERE `loginHost` = "' + logHost + '"', function(error, results, fields) {
                    if(results.length == 0) {
                        con.end();
                        let cn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                        cn.connect();
                        cn.query('SELECT * FROM games WHERE `loginGuest` = "' + logHost + '"', function(error, results, fields) {
                            if(results.length == 0) {
                                cn.end();
                                cn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                                cn.connect();
                                cn.query('INSERT INTO games VALUES (id, "' + logHost + '", "")');
                                cn.end();
                                console.log('Вы можете создать комнату');
                                WebSocket.clients.forEach(client => {
                                    if(client.readyState == WebSocketLib.OPEN) {
                                        client.send(JSON.stringify({type: 'game', subtype: 'createGame', total: 'allow', data: {login: logHost}}));
                                    }
                                });
                            } else {
                                console.log('Невозможно создать комнату');
                                ws.send(JSON.stringify({type: 'game', subtype: 'createGame', total: 'ban'}));
                                cn.end();
                            }
                        });
                    } else {
                        console.log('Невозможно создать комнату');
                        ws.send(JSON.stringify({type: 'game', subtype: 'createGame', total: 'ban'}));
                        con.end();
                    }
                });

            }
            if(message.subtype == 'deleteGame') {
                let conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                conn.connect();
                conn.query('DELETE FROM `games` WHERE loginHost = "' + message.data.login + '"', function(error, results, fields) {
                    console.log('Комната удалена');
                    conn.end();
                    conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                    conn.connect();
                    conn.query('SELECT * FROM games', function(error, results, fields) {
                        console.log('Комнат на сервере: ' + results.length);
                        if(results.length != 0) {
                            conn.end();
                            WebSocket.clients.forEach(client => {
                                if(client.readyState == WebSocketLib.OPEN) {
                                    console.log('Говорим клиенту, что удалили');
                                    client.send(JSON.stringify({type: 'game', subtype: 'gamesList', data: {len: results.length}}));
                                }
                            });
                        } else {
                            conn.end();
                            WebSocket.clients.forEach(client => {
                                if(client.readyState == WebSocketLib.OPEN) {
                                    console.log('Говорим клиенту, что удалили');
                                    client.send(JSON.stringify({type: 'game', subtype: 'gamesList', data: {len: 0}}));
                                }
                            });
                        }
                    }); 
                });
                
            }
            if(message.subtype == 'getGame') {
                let conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                conn.connect();
                conn.query('SELECT * FROM games', function(error, results, fields) {
                    conn.end();
                    console.log('Найден:' + results[message.data.index].loginHost);
                    ws.send(JSON.stringify({type: 'game', subtype: 'gamesList1', total: 'sendGame', data: {logHost: results[message.data.index].loginHost, logGuest: results[message.data.index].loginGuest},}));
                });
            }
            if(message.subtype == "joinGame") {
                if(message.total == "ask") {
                    let conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                    conn.connect();
                    conn.query('SELECT * FROM games WHERE loginHost = "' + message.data.logGuest + '"', function(error, results, fields) {
                        if(results.length == 0) {
                            conn.end();
                            conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                            conn.connect();
                            conn.query('SELECT * FROM games WHERE loginGuest = "' + message.data.logGuest + '"', function(error, results, fields) {
                                if(results.length == 0) {
                                    ws.send(JSON.stringify({type: 'game', subtype: 'allowGame', data: {logHost: message.data.logHost, logGuest: message.data.logGuest}}));
                                }
                            });
                        }
                    });
                }
                if(message.total == "update") {
                    let conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                    conn.connect();
                    conn.query('UPDATE `games` SET `loginGuest`= "' + message.data.logGuest + '" WHERE `loginHost` = "' + message.data.logHost + '"', function(error, results, fields) {
                        console.log('Комната обновлена');
                        conn.end();
                        conn = sql.createConnection({host: 'tictac', user: 'root', password: '', database: 'tictac'});
                        conn.connect();
                        conn.query('SELECT * FROM games', function(error, results, fields) {
                            console.log('Комнат на сервере: ' + results.length);
                            if(results.length != 0) {
                                conn.end();
                                WebSocket.clients.forEach(client => {
                                    if(client.readyState == WebSocketLib.OPEN) {
                                        console.log('Говорим клиенту, что обновили');
                                        client.send(JSON.stringify({type: 'game', subtype: 'gamesList', data: {len: results.length}}));
                                        client.send(JSON.stringify({type: 'game', subtype: 'startGame', data: {logHost: message.data.logHost, logGuest: message.data.logGuest}}));
                                    }
                                });
                            } else {
                                conn.end();
                            }
                        }); 
                    });
                } 
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
