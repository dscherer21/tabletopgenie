// Pull in required dependencies
var path = require('path');
var multer = require('multer'),
	bodyParser = require('body-parser'),
	path = require('path');

// Import the list of friend entries

// Export API routes
module.exports = function (app) {
	//all friends -- read in --- asynch
	//no problems because it will send to browser
	//line by line as it comes in
	// app.get('/picture/create', function (req, response) {
	// 	console.log("hit the create inside of api routes")
	// });

	app.post('/picture/create', multer({ dest: './app/public/uploads/' }).single('upl'), function(req, res)  {
		console.log('did a post inside of api routes');
		console.log( req.file );
		if (!req.file) {
		  console.log("No file received");
		  return res.send({
			success: false
		  });
	  
		} else {
		  console.log('file received');
		  return res.send({
			success: true
		  })
		}
	  });


	//this is the routine for pulling images	
	app.post('/picture/create-img', multer({ dest: './app/public/uploads/' }).single('upl'), function(req, res)  {
		console.log('did a post inside of api routes');
		console.log( req.file );
		if (!req.file) {
		  console.log("No file received");
		  return res.send({
			success: false
		  });
	  
		} else {
		  console.log('file received');
		  return res.send({
			success: true
		  })
		}
	  });

};


// //for storage of pictures
// import bodyParser from 'body-parser';
// import morgan from 'morgan';
// import express from 'express';
// const app2 = express();
// app2.use(bodyParser.json());
// app2.use(bodyParser.urlencoded({extended: true}));
// app2.use(morgan('dev'));


// //this is the picture_controller.js file
// //really /picture
// router.get('/', function(req,res) {
//   res.render('../app/views/camera');
// });

// router.post('/create', upload.single('avatar'),  function(req, res) {
//   console.log("hit the picture create route");
//   const storage = multer.diskStorage({
//     destination: '/public/uploads',
//     filename: function (req, file, callback) {
//       //..
//     }
//   });


// });
