var Utils = {};

Utils.checkToken = function() {
	var storage = new Storage();
	var token = storage.getItem("token");
	//没登陆，重定向
	if (token == null) {
		document.location.href = "/";
	}
};

Utils.verticalMiddle = function(selector) {
	var h = $(window).height(),
		ele = $(selector);
	ele.css({
		top: (h - ele.height()) / 2,
		position: "relative"
	});
};
