var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('waitplayer');
});

module.exports = router;