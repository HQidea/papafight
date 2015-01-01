Utils.checkToken();

$(function() {
	var lastGamma = 0;
	var lastBeta = 0;
	var canStart = false;
	var lastZ_1 = 0;
	var lastZ_2 = 0;
	var isAsc = true;
	//获取token
	var storage = new Storage();
	var token = storage.getItem("token");
	//建立命名空间为playerselect的socket连接
	var socket = io.connect(document.domain + ":8080/playerselect");
	
	//设备加速度
	window.addEventListener("devicemotion", function(evt) {
		if (!canStart) {
			return;
		}
		var y = evt.acceleration.y;
		var z = evt.acceleration.z;
		$("#z").text(z);
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
				var orientation = ORIENTATION.RIGHT;
				if (lastZ_1 < 0) {
					orientation = ORIENTATION.LEFT;
				}
				isAsc = false;
				//发送加速度
				socket.emit("post playerselect", {token: token, orientation: orientation});
				canStart = false;
				setTimeout(function() {
					canStart = true;
					lastZ_1 = 0;
					lastZ_2 = 0;
				}, ACTION_PERIOD);
			}
			
		}
		//出拳选择，屏幕向上（beta=0，gamma=0），y加速度；防守时候看beta趋近于90
		else if ((Math.abs(y) > 8 && (lastBeta >= 0 && lastBeta <= 30)) && (lastGamma >= 0 && lastGamma <= 30)) {
			socket.emit("post playerselected", {token: token});
			document.location.href = "/fight/mobile";
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
 	//等待预加载完成，才能选择玩家
 	socket.on("preload success", function(data) {
 		if (data["token"] == token) {
 			canStart = true;
 		}
 	});
});