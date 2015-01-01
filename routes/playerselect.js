var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('playerselect');
});

router.get('/mobile', function(req, res) {
  res.render('mobile/playerselect');
});

module.exports = router;