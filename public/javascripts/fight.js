// Utils.checkToken();

$(function(){
	//操作storage
	var storage=new Storage();
	var my_token=storage.getItem("token");
	var my_role=storage.getItem("role");
	var opponent_token=storage.getItem("opponent_token");
	var opponent_role=storage.getItem("opponent_role");
	$(".avatar-me>img").attr("src","/images/avatar"+my_role+".png");
	$(".avatar-rival>img").attr("src","/images/avatar"+opponent_role+".png");
	var PPKD = window.PPKD.init({
        rival:{
            img: '/images/rival'+opponent_role+'.png'
        },
        me : {
            img: '/images/me'+my_role+'.png'
        } 
    });
    // $("#countdown>img").attr("src","/images/countdown.gif");
    // $("#countdown").show();
	//游戏音频
	var bkAudio=null;
	var beginAudio=Utils.playAudio("/audios/fight_begin.wav");
	var punch=null;
	var escape=null;
	var blooddrop=null;
	//倒计时,告诉手机端，电脑端已经进入fight页面
	setTimeout(function(){
		var socket=io.connect(document.domain+":8080/waitplayer");
		socket.emit("enter fight page",{token:my_token});
		beginAudio.pause();
		$("#countdown").hide();
		bkAudio=Utils.playAudio("/audios/fight_bk.wav",true);
	},5000);
	
	//链接fight的socket
	var fight_socket=io.connect(document.domain+":8080/fight");
	fight_socket.on("attack",function(data){
		if(my_token!=data["operator"] && my_token!=data["target"]){
			return;
		}
		console.log("attack");
		console.log(data);
		if(data["operator"]==my_token){
			PPKD.action('me', 'attack');
		}
		else{
			PPKD.action('rival', 'attack');
		}
		if(punch==null){
			punch=Utils.playAudio("/audios/punch.wav");
		}
		else{
			punch.play();
		}
	});
	fight_socket.on("attack result",function(data){
		if(my_token!=data["operator"] && my_token!=data["target"]){
			return;
		}
		console.log("attack result");
		console.log(data);
		if(data["operator"]==my_token){
			PPKD.updateBlood('rival', data["result"]);
		}
		else{
			PPKD.updateBlood('me', data["result"]);
		}
		if(data["result"]==10){
			if(blooddrop==null){
				blooddrop=Utils.playAudio("/audios/blooddrop.mp3");
			}
			else{
				blooddrop.play();
			}
		}
	});
	fight_socket.on("defend",function(data){
		if(my_token!=data["operator"] && my_token!=data["target"]){
			return;
		}
		console.log("defend");
		console.log(data);
		if(data["operator"]==my_token){
			PPKD.action('me', 'defense');
		}
		else{
			PPKD.action('rival', 'defense');
		}
	});
	fight_socket.on("nodefend",function(data){
		if(my_token!=data["operator"] && my_token!=data["target"]){
			return;
		}
		console.log("nodefend");
		console.log(data);
		if(data["operator"]==my_token){
			PPKD.action('me', 'static');
		}
		else{
			PPKD.action('rival', 'static');
		}
	});
	fight_socket.on("escapeLeft",function(data){
		if(my_token!=data["operator"] && my_token!=data["target"]){
			return;
		}
		console.log("escapeLeft");
		console.log(data);
		if(data["operator"]==my_token){
			PPKD.action('me', 'moveLeft');
		}
		else{
			PPKD.action('rival', 'moveLeft');
		}
		if(escape==null){
			escape=Utils.playAudio("/audios/orientation.wav");
		}
		else{
			escape.play();
		}
	});
	fight_socket.on("escapeRight",function(data){
		if(my_token!=data["operator"] && my_token!=data["target"]){
			return;
		}
		console.log("escapeRight");
		console.log(data);
		if(data["operator"]==my_token){
			PPKD.action('me', 'moveRight');
		}
		else{
			PPKD.action('rival', 'moveRight');
		}
		if(escape==null){
			escape=Utils.playAudio("/audios/orientation.wav");
		}
		else{
			escape.play();
		}
	});
});