var Utils = {};

Utils.checkToken = function() {
	var storage = new Storage();
	var token = storage.getItem("token");
	//没登陆，重定向
	if (token == null) {
		document.location.href = "/";
	}
};

Utils.playAudio = function(audioURL, isLoop) {
	var audio = document.createElement("audio");
	audio.src = audioURL;
	if (isLoop) {
		audio.loop = "loop";
	}
	audio.play();
	return audio;
};

Utils.verticalMiddle = function(selector) {
	var h = $(window).height(),
		ele = $(selector);
	ele.css({
		top: (h - ele.height()) / 2,
		position: "relative"
	});
};
