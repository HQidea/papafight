/*
	登录相关的websocket服务
*/

module.exports = function() {
	var token = 0, role = 1;

	var login_socket = global.socket.of('/login').on('connection', function(socket) {
		token++;
		socket.emit('token success', {token: token});
		socket.on('manual login', function(data) {
			login_socket.emit('manual token', data);
		});
   		socket.on('post token', function(data) {
			if (role === 1) {
				data.role = role++;
			}
			else {
				data.role = role--;
			}
    		login_socket.emit('login success', data);
  		});
   	});
}();