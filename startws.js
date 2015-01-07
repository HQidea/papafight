//启动服务器
var debug = require('debug')('papafight');
var app = require('./app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

//启动websocket，监听socket事件
global.socket = require('socket.io')(8080);
//登录相关的socket服务
require('./service/login');
require('./service/waitplayer');
require('./service/fight');