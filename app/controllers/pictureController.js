var express = require('express');
var router  = express.Router();


console.log('picture controller is loaded...');

//this is the picture_controller.js file
//really /picture
router.get('/:group_id/:group_name', function(req,res) {
  res.render('../app/views/camera');
});

// router.post('/create', function(req, res) {
//   console.log("hit the picture create route");
// });


module.exports = router;
