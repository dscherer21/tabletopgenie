// Pull in required dependencies
var path = require('path');

// Import the list of friend entries

// Export API routes
module.exports = function (app) {
	//all friends -- read in --- asynch
	//no problems because it will send to browser
	//line by line as it comes in
	app.get('/api/friends', function (req, response) {
		response.json(friends);
	});

	//evaluate the responses
	app.post('/api/friends', function (req, res) {
		// Capture the user input object
		var userInput = req.body;
		console.log('eval started');
		// console.log('userInput = ' + JSON.stringify(userInput));

		var userResponses = userInput.scores;

		// Compute best friend match
		var matchedFriend = {
			name: "",
			imageURL: ""
		};
		var totalDiff = 10000;

		//loop thru all the friends and find the best match
		for (var i = 0; i < friends.length; i++) {
			// console.log('friend = ' + JSON.stringify(friends[i]));

			//loop for all answers
			var diff = 0;
			for (var j = 0; j < userResponses.length; j++) {
				//difference should be the absolute difference so that if on
				//either side ... + or - from the answer, still same score
				//check first if blank
				if (userResponses[j].length > 1) {
					//it is a blank, for now don't do anything
				} else {
					var userVal = parseInt(userResponses[j]);
					diff += Math.abs(friends[i].scores[j] - userVal);
				}
			}

			// If lowest difference, record the friend match
			if (diff < totalDiff) {
				totalDiff = diff;
				matchedFriend.name = friends[i].name;
				matchedFriend.imageURL = friends[i].photo;
			}
		}

		// Add new user
		friends.push(userInput);

		// Send appropriate response
		res.json({ status: 'OK', matchName: matchedFriend.name, matchImage: matchedFriend.imageURL });
	});
};
