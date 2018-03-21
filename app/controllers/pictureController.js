var express = require('express');
var router  = express.Router();


console.log('picture controller is loaded...');

//this is the picture_controller.js file
//really /picture
router.get('/:group_id/:group_name', function(req,res) {
  var group_name = req.params.group_name;
  res.render('../app/views/camera',{groupName: group_name} );
});

// router.post('/create', function(req, res) {
//   console.log("hit the picture create route");
// });

// router.post("/create") {
//   console.log("\n\n hit the create ");
// };

module.exports = router;
