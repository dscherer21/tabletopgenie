var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');

router.get("/:group", function (req, res) {

    var query = "SELECT u.name, u.id, ug.character_id, c.name AS char_name FROM users u LEFT JOIN user_groups ug ON u.id = ug.user_id LEFT JOIN characters c ON c.id = ug.character_id WHERE ug.group_id = (SELECT id FROM groups WHERE name = ?)";
    
    connection.query(query, [req.params.group], function (err, members) {
        var charQuery = "SELECT * FROM characters";
        
        connection.query(charQuery, function (err, characters) {


            res.render("../app/views/campaign/main-campaign", {
                group: req.params.group,
                members: members,
                characters: characters
            });
        });
    });
});

router.post("/:group/characters", function (req, res){
    var userIDs = req.body.memid;
    var charIDs = req.body.charid;
    console.log(userIDs);
    console.log(charIDs);
    console.log(userIDs.length);

    var query = "INSERT INTO user_groups (character_id) VALUES (?) WHERE user_id = (?)";
    for (var i = 0; i < userIDs.length; i++){
        var charID = parseInt(charIDs[i]);
        var userID = parseInt(userIDs[i]);
        connection.query(query, [charID, userID], function (err, response){
            console.log("added char id " + charID + " to user id " + userID);
        })
    }


})







module.exports = router;