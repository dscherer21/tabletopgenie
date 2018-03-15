var express = require('express');
var router  = express.Router();


//this is the picture_controller.js file
//really /picture
router.get('/', function(req,res) {
  res.render('../app/views/camera');
});


module.exports = router;
