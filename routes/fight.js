var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function(req, res) {   
  res.render('fight');
});

router.get('/mobile', function(req, res) {
  res.render('mobile/fight');
});

module.exports = router;