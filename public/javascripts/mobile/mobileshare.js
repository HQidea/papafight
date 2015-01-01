Utils.checkToken();

$(function() {
	//获取token
	var storage = new Storage();
	var token = storage.getItem("token");
	//建立命名空间为mobileshare的socket连接
	var socket = io.connect(document.domain + ":8080/mobileshare");
	socket.on("take photo success", function(data) {
		if (data["token"] != token) {
			return;
		}
		var url = document.location.origin + "/images/snapshot/" + data["imgURL"];
		$("#photo").attr({"src":url, "width":document.body.offsetWidth}).show();
		window._bd_share_config = {
			"common": {
				"bdSnsKey": {},
				"bdText": "",
				"bdMini": "2",
				"bdMiniList": false,
				"bdPic": url,
				"bdStyle": "0",
				"bdSize": "24"
			},
			"share": {},
			"image": {
				"viewList": ["qzone", "tsina", "tqq", "renren"],
				"viewText": "分享到：",
				"viewSize": "24"
			},
			"selectShare": {
				"bdContainerClass": null,
				"bdSelectMiniList": ["qzone", "tsina", "tqq", "renren"]
			}
		};
		with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
	});
	//建立命名空间为photo的socket连接
	var photo_socket = io.connect(document.domain + ":8080/photo");
	//跳转页面
	photo_socket.on("new game", function(data) {
 		if (data["token"] == token) {
 			document.location.href = "/playerselect/mobile";
 		}
 	});
});