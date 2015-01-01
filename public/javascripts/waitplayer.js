Utils.checkToken();

$(function() {
	Utils.verticalMiddle("body.wait-wrapper");
	//播放音频
	var audioBk = Utils.playAudio("/audios/loading.wav", true);
	//vs闪烁动画
	setInterval(function() {
		$("#vs").animate({opacity: 0.5}, 500, function() {
			$("#vs").animate({opacity: 1}, 500);
		});
	}, 1000);
	var storage = new Storage();
	var token = storage.getItem("token");
	var role = storage.getItem("role");
	$("#my_image").attr("src", "/images/role/" + role + ".png");
	//创建waitplayer命名空间的socket
	var socket = io.connect(document.domain + ":8080/waitplayer");
	socket.emit("wait player", {token: token, role: role});
	socket.on("wait success", function(data) {
		if (data["token1"] == token) {
			var img = "/images/role/" + data["role2"] + ".png";
			$("#another_image").attr("src", img);
			$("#another_player").show();
			storage.setItem("opponent_token", data["token2"]);
			storage.setItem("opponent_role", data["role2"]);
		}
		else if (data["token2"] == token) {
			var img = "/images/role/" + data["role1"] + ".png";
			$("#another_image").attr("src", img);
			$("#another_player").show();
			storage.setItem("opponent_token", data["token1"]);
			storage.setItem("opponent_role", data["role1"]);
		}
		//进入打斗页面
		setTimeout(function() {
			document.location.href = "/fight";
			audioBk.pause();
		}, 3000);
	});
	//玩家断开
	window.onbeforeunload = function() {
		socket.disconnect();
	};
});