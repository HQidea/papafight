(function($, undefined) {
	function init() {
		initSonic();
		Utils.verticalMiddle('.papa-wrapper');
	}
	function initSonic() {
		//创建超声波
		var sserver = new SonicServer({alphabet: '0123456789'});
		//建立命名空间为login的websocket连接
		var socket = io.connect(document.domain + ":8080/login");
		//匹配手机
		$("#find_phone").click(function() {
			if ($(this).hasClass("disable")) {
				return false;
			}
			$(this).fadeOut();
			$('div.binding').fadeIn();
			//收到手机发来的超声波事件的回调
			sserver.on("message", function(message) {
				$("#token").text(message);
				$("div.binding").hide();
				$("#token_area").fadeIn();
			});
			//超声波服务开启
			sserver.start();

			socket.on("manual token", function(data) {
				$("#token").text(data.token);
				$("div.binding").hide();
				$("#token_area").fadeIn();
			});
		});
		//重新匹配手机，超声波重启
		$("#token_no").click(function() {
			document.location.reload();
		});
		//匹配成功，向websocket服务器端发送令牌
		$("#token_yes").click(function() {
			socket.emit("post token", {token: $("#token").text()});
		});
		//收到服务器端发来的登录成功消息时候，说明令牌已经确认完成，可以进入下个页面
		socket.on("login success", function(data) {
			//可能会有其他玩家也有发送，所以要判断令牌是否相等
			if (data["token"] == $("#token").text()) {
				//存储令牌，便于以后使用
				var storage = new Storage();
				storage.setItem("token", data["token"]);
				storage.setItem("role", data["role"]);
				document.location.href = "/waitplayer";
			}
		});
	}

	$(init);
})(jQuery);