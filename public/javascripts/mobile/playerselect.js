Utils.checkToken();

$(function() {
	var lastTime = null;
	var lastGamma = 0;
	var lastBeta = 0;
	var storage = new Storage();
	var token = storage.getItem("token");
	//建立命名空间为playerselect的socket连接
	var socket = io.connect(document.domain + ":8080/playerselect");
	var canStart = false;
	//设备加速度
	window.addEventListener("devicemotion", function(evt) {
		if (!canStart) {
			return;
		}
		//动作间隔至少300ms
		if (lastTime != null && new Date().getTime() - lastTime < 100) {
			return;
		}
		var x = evt.acceleration.x;
		var y = evt.acceleration.y;
		var z = evt.acceleration.z;
		$("#x").text(x);
		$("#y").text(y);
		$("#z").text(z);
		//手机左右摆动并且手机屏幕垂直地面(gamma=90)
		if (Math.abs(z) > 6 && (lastGamma > 60 && lastGamma <= 90)) {
			var orientation = ORIENTATION.RIGHT;
			if (z < 0) {
				orientation = ORIENTATION.LEFT;
			}
			lastTime = new Date().getTime() + 100;
			//发送加速度
			socket.emit("post playerselect", {token: token, orientation: orientation});
		}
		//出拳选择，屏幕向上（beta=0，gamma=0），x、y加速度
		else if ((Math.abs(y) > 8 && (lastBeta >= 0 && lastBeta <= 30)) && (lastGamma >= 0 && lastGamma <= 30)) {
			socket.emit("post playerselected", {token: token});
			document.location.href = "/waitplayer/mobile";
		}
	}, true);
	//屏幕方向
	window.addEventListener("deviceorientation", function(evt) {
		if (!canStart) {
			return;
		}
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