var express = require('express');
var router  = express.Router();
var connection = require('../config/connection.js');


console.log('schedule controller is loaded...');

//this is the picture_controller.js file
//really /picture
router.get('/', function(req,res) {
    res.render('schedule/main');
});


console.log('schedule controller is done loading ...');
module.exports = router;
