/*
	判断手势相关的websocket服务
*/

module.exports = function() {
	var ACTION = {
		a: "attack",
		d: "defend",
		n: "nodefend",
		l: "escapeLeft",
		r: "escapeRight"
	};
	var PLAYERS = {};
	var fight_socket = global.socket.of('/fight').on('connection', function(socket) {
    socket.on('attack', function(data){
      var operator = data.operator;
      var target = data.target;
      if (!!checkMoving(operator)) {
        return;
      }
      PLAYERS[operator] = PLAYERS[operator] || {};
      PLAYERS[operator]['target'] = target;
      PLAYERS[operator]['status'] = ACTION.a;

      fight_socket.emit('attack', {
        'operator': operator,
        'target': target
      });

      var result;
      setTimeout(function() {

        if (!!PLAYERS[target] && PLAYERS[target].status == ACTION.d) {
          //发起一次攻击，被防御（有效）
          result = 3;
        }
        else if (!!PLAYERS[target] && PLAYERS[target].status == ACTION.l) {
          //发起一次攻击，左侧闪躲（有效）
          result = 0;
        }
        else if (!!PLAYERS[target] && PLAYERS[target].status == ACTION.r) {
          //发起一次攻击，右侧闪躲（有效）
          result = 0;
        }
        else {
          //发起一次攻击，对手没有防守
          result = 10;
        }
        fight_socket.emit('attack result', {
          'operator': operator,
          'target': target,
          'result': result
        });

      }, 500);
    });
    socket.on('defend', function(data) {
      var operator = data.operator;
      var target = data.target;
      if (!!checkMoving(operator)) {
        return;
      }
      PLAYERS[operator] = PLAYERS[operator] || {};
      PLAYERS[operator]['target'] = target;
      if (PLAYERS[operator]['status'] != ACTION.d) {
        PLAYERS[operator]['status'] = ACTION.d;

        fight_socket.emit('defend', {
          'operator': operator,
          'target': target
        });
      }
    });
    socket.on('nodefend', function(data) {
      var operator = data.operator;
      var target = data.target;
      if (!!checkMoving(operator)) {
        return;
      }
      PLAYERS[operator] = PLAYERS[operator] || {};
      PLAYERS[operator]['target'] = target;
      if (PLAYERS[operator]['status'] != ACTION.n) {
        PLAYERS[operator]['status'] = ACTION.n;

        fight_socket.emit('nodefend', {
          'operator': operator,
          'target': target
        });
      }
    });
    socket.on('escapeLeft', function(data) {
      var operator = data.operator;
      var target = data.target;
      if (!!checkMoving(operator)) {
        return;
      }
      PLAYERS[operator]['is_move'] = true;
      PLAYERS[operator] = PLAYERS[operator] || {};
      PLAYERS[operator]['target'] = target;
      PLAYERS[operator]['status'] = ACTION.l;

      fight_socket.emit('escapeLeft', {
        'operator': operator,
        'target': target
      });
      setTimeout(function() {
        PLAYERS[operator]['status'] = ACTION.n;
        PLAYERS[operator]['is_move'] = false;
        console.log(PLAYERS);
      }, 1000);
    });
    socket.on('escapeRight', function(data) {
      var operator = data.operator;
      var target = data.target;
      if (!!checkMoving(operator)) {
        return;
      }
      PLAYERS[operator]['is_move'] = true;
      PLAYERS[operator] = PLAYERS[operator] || {};
      PLAYERS[operator]['target'] = target;
      PLAYERS[operator]['status'] = ACTION.r;

      fight_socket.emit('escapeRight', {
        'operator': operator,
        'target': target
      });
      setTimeout(function() {
        PLAYERS[operator]['status'] = ACTION.n;
        PLAYERS[operator]['is_move'] = false;
        console.log(PLAYERS);
      }, 1500);
    });
    socket.on('fight over', function(data) {
      fight_socket.emit('mobile over', data);
      if (!!PLAYERS[data.token]) {
        delete PLAYERS[data.token];
      }
    });
    function checkMoving(operator) {
      if (!!PLAYERS[operator] && !!PLAYERS[operator]['is_move']) {
        return true;
      }
      else{
        return false;
      }
    }
  });
}();