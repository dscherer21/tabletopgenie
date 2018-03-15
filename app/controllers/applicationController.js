var express = require('express');
var router  = express.Router();


//this is the users_controller.js file
router.get('/', function(req,res) {
  res.render('../app/views/index');
});

router.get('/camera', function(req,res) {
  res.render('../app/views/camera');
});


module.exports = router;
