Utils.checkToken();

(function($, undefined) {
	function init() {
		initAudio();
		initBg();
		window.onresize = function() {
      initBg();
    };
	}
	function initAudio() {
		//音频
		var bkAudio = Utils.playAudio("/audios/playerselect.wav", true);
		var orientationAudio = null;
		//动画效果
		$('#gla_box>ul').roundabout({
			minOpacity: 1,
			btnNext: ".next",
			duration: 1000,
			reflect: true,
			btnPrev: '.prev',
			tilt: 0,
			shape: 'figure8'
		});
		var storage = new Storage();
		var token = storage.getItem("token");
		var isSelected = false;
		//建立命名空间为playerselect的websocket连接
		var socket = io.connect(document.domain + ":8080/playerselect");
		//接收选择的方向
		socket.on("playerselect success", function(data) {
			if (isSelected) {
				return;
			}
			if (data.token == token) {
				if (data.orientation == ORIENTATION.RIGHT) {
					$("#gla_box .next").click();
					if (orientationAudio == null) {
						orientationAudio = Utils.playAudio("/audios/orientation.wav");
					}
					else {
						orientationAudio.play();
					}
				}
				else if (data.orientation == ORIENTATION.LEFT) {
					$("#gla_box .prev").click();
					if (orientationAudio == null) {
						orientationAudio = Utils.playAudio("/audios/orientation.wav");
					}
					else {
						orientationAudio.play();
					}
				}
			}
		});
		//接收选中的
		socket.on("playerselected success", function(data) {
			if (isSelected) {
				return;
			}
			if (data.token == token) {
				//选中之后的音效
				bkAudio.pause();
				isSelected = true;
				var role = $(".roundabout-in-focus img").attr("role");
				storage.setItem("role", role);
				$(".roundabout-moveable-item:not(.roundabout-in-focus)").animate({"opacity": "0"}, 700, function() {
					Utils.playAudio("/audios/selectsuccess.wav");
					$(".roundabout-in-focus").animate({"opacity": "0"}, 2000, function() {
						document.location.href = "/waitplayer";
					});
				});
			}
		});
	}

	function initBg() {
		Utils.verticalMiddle('#gla_box');
		var sH = $(document).height(),
			sW = $(document).width();
		$('#bg-img').find('img').css({
			width: sW,
			height: sH
		});
	}
	$(init);
})(jQuery);
