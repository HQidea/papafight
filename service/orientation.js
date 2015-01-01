/*
	判断手势相关的websocket服务
*/

module.exports = function() {
	var playerselect_socket = global.socket.of('/playerselect').on('connection', function(socket) {
    socket.on('post preload', function(data) {
      playerselect_socket.emit('preload success', data);
    });
    socket.on('post playerselect', function(data) {
      playerselect_socket.emit('playerselect success', data);
    });
    socket.on('post playerselected', function(data) {
      playerselect_socket.emit('playerselected success', data);
    });
  });
}();