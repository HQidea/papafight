/*
	等待玩家相关的websocket服务
*/

module.exports = function() {
	var players = [];

	var wait_socket = global.socket.of('/waitplayer').on('connection', function(socket) {
    socket.on('wait player', function(data) {
      var token = data["token"];
      var role = data["role"];
      socket.token = token;
      if (players.length == 0) {
        players.push({token: token, role: role});
      }
      else {
        var opponent = players[players.length - 1];
        var anotherToken = opponent.token;
        var anotherRole = opponent.role;
        if (anotherToken != token) {
          players.pop();
          wait_socket.emit('wait success', {token1: token, token2: anotherToken, role1: role, role2: anotherRole});
        }
      }
    });
    socket.on('enter fight page', function(data) {
      wait_socket.emit('begin fight', data);
    });
    //玩家断开链接后的逻辑处理
    socket.on('disconnect', function(data) {
      var token = socket.token;
      if (typeof token !== undefined && token != null) {
        for (var i = 0; i < players.length; i++) {
          if (players[i].token == token) {
            players.splice(i, 1);
            //log
            console.log("玩家删除：" + token);
          }
        }
      }
    });
  });
}();