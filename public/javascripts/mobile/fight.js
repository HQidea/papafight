Utils.checkToken();

$(function() {
	var canStart = false;
	var lastGamma = 0;
	var lastBeta = 0;
	var lastZ_1 = 0;
	var lastZ_2 = 0;
	var isAsc = true;
	//操作storage
	var storage = new Storage();
	var my_token = storage.getItem("token");
	var my_role = storage.getItem("role");
	var target_token, target_role;
	//创建waitplayer命名空间的socket
	var socket = io.connect(document.domain + ":8080/waitplayer");
	//获取双方token
	socket.on("wait success", function(data) {
		if (data["token1"] == my_token) {
			storage.setItem("rival_token", data["token2"]);
			storage.setItem("rival_role", data["role2"]);
			target_token = data["token2"];
			target_role = data["role2"];
		}
		else if (data["token2"] == my_token) {
			storage.setItem("rival_token", data["token1"]);
			storage.setItem("rival_role", data["role1"]);
			target_token = data["token1"];
			target_role = data["role1"];
		}
	});
	//电脑端已经进入fight页面
	socket.on("begin fight", function(data) {
		if (data["token"] == my_token) {
			canStart = true;
		}
	});
	var fight_socket = io.connect(document.domain + ":8080/fight");
	var action = null;
	//设备加速度
	window.addEventListener("devicemotion", function(evt) {
		if (!canStart) {
			return;
		}
		var y = evt.acceleration.y;
		var z = evt.acceleration.z;
		lastZ_1 = lastZ_2;
		lastZ_2 = z;
		var compare1 = lastZ_1 >= 0;
		var compare2 = lastZ_2 >= 0;
		if (compare1 != compare2) {
			isAsc = true;
			return;
		}
		if (!isAsc) {
			return;
		}
		//手机左右摆动并且手机屏幕垂直地面(gamma=90)
		if (Math.abs(lastZ_1) > 6 && (lastGamma > 60 && lastGamma <= 120)) {
			if (Math.abs(z) < Math.abs(lastZ_1)) {
				action = ACTION.ESCAPERIGHT;
				var orientation = ORIENTATION.RIGHT;
				if (lastZ_1 < 0) {
					action = ACTION.ESCAPELEFT;
					orientation = ORIENTATION.LEFT;
				}
				fight_socket.emit(action, {operator: my_token, target: target_token});
				isAsc = false;
				$("#console").append("escape" + orientation + "<br/>");
				canStart = false;
				setTimeout(function() {
					canStart = true;
					lastZ_1 = 0;
					lastZ_2 = 0;
				}, ACTION_PERIOD);
			}
		}
		//出拳选择，屏幕向上（beta=0，gamma=0），y加速度；
		else if ((Math.abs(y) > 8 && (lastBeta >= 0 && lastBeta <= 30)) && (lastGamma >= 0 && lastGamma <= 30)) {
			action = ACTION.ATTACK;
			fight_socket.emit(action, {operator:my_token, target:target_token});
			$("#console").append("attack<br/>");
			canStart = false;
			setTimeout(function() {
				canStart = true;
			}, ACTION_PERIOD);
		}
		//防守时候看beta趋近于90
		else if(lastBeta > 60 && lastBeta <= 120) {
			action = ACTION.DEFEND;
			fight_socket.emit(action, {operator:my_token, target:target_token});
			$("#console").append("defend<br/>");
			canStart = false;
			setTimeout(function() {
				canStart = true;
			}, ACTION_PERIOD);
		}
		//无防守
		else {
			//左边躲闪和右边躲闪需要服务器来重置无防守状态
			if (action != ACTION.ESCAPERIGHT && action != ACTION.ESCAPELEFT) {
				action = ACTION.NODEFEND;
				fight_socket.emit(action, {operator:my_token, target:target_token});
			}
		}
	}, true);
	//屏幕方向
	window.addEventListener("deviceorientation", function(evt) {
		if (!canStart) {
			return;
		}
		//beta--绕x轴，gamma--绕y轴，alpha--绕z轴
		lastGamma = Math.abs(evt.gamma);
		lastBeta = Math.abs(evt.beta);
 	}, true);

 	fight_socket.on('mobile over', function(data) {
 		if (data.token != my_token) {
 			return;
 		}
		window.location.href = '/mobile';
 	});
});