/*
	登录相关的websocket服务
*/

module.exports = function() {
	var token = 0;

	var login_socket = global.socket.of('/login').on('connection', function(socket) {
		token++;
		socket.emit("token success", {token: token});
   		socket.on('post token', function(data) {
    		login_socket.emit("login success", data);
  		});
   	});
}();