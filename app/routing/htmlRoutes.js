
//use path to combine paths
var path = require('path');

//need to pass in app because express is not scoped here
module.exports = function(app) {

	//home page
	app.get('/', function(req, response) {
		response.sendFile(path.join(__dirname, '../public/home.html'));
	});

	//survey
	app.get('/survey', function(req, response) {
		response.sendFile(path.join(__dirname, '../public/survey.html'));
	});
};
