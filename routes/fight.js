var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function(req, res) {   
  res.render('fight');
});

router.get('/mobile', function(req, res) {
  res.render('mobile/fight');
});

router.get('/takephoto', function(req, res) {
  res.render('takephoto');
});

router.get('/mobileshare', function(req, res) {
  res.render('mobile/mobileshare');
});

router.post('/upload', function(req, res){
  var share_socket = global.socket.of('/mobileshare');
  //接收前台POST过来的base64
  var imgData = req.body.imgData;
  var token = req.body.token;
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64');
  var imgURL = new Date().getTime() + ".png";
  fs.writeFile("public/images/snapshot/" + imgURL, dataBuffer, function(err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send("success");
      share_socket.emit("take photo success", {token: token, imgURL: imgURL});
    }
  });
});

module.exports = router;