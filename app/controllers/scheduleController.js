var express = require('express');
var router  = express.Router();
var connection = require('../config/connection.js');


console.log('schedule controller is loaded...');

//this is the picture_controller.js file
//really /picture
router.get('/', function(req,res) {
    console.log("hit the main schedule page");
    res.render('../app/views/schedule/main');
});


module.exports = router;
