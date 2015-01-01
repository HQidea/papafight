//拍完照之后继续游戏
module.exports = function() {
  var photo_socket = global.socket.of('/photo').on('connection', function(socket) {
    socket.on('photo success', function(data) {
      photo_socket.emit("new game", data);
    });
  });
}();