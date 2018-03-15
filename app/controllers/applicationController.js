var express = require('express');
var router  = express.Router();


//this is the users_controller.js file
router.get('/', function(req,res) {
  res.render('../app/views/index');
});

module.exports = router;
