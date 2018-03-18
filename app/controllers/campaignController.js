var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');

router.get("/:group", function (req, res) {

    var query = "SELECT u.name, u.id, ug.character_id, c.name AS char_name FROM users u LEFT JOIN user_groups ug ON u.id = ug.user_id LEFT JOIN characters c ON c.id = ug.character_id WHERE ug.group_id = (SELECT id FROM groups WHERE name = ?)";
    
    connection.query(query, [req.params.group], function (err, members) {
        var charQuery = "SELECT * FROM characters";
        
        connection.query(charQuery, function (err, characters) {


            res.render("../app/views/campaign/main-campaign", {
                members: members,
                characters: characters
            });
        });
    });
});







module.exports = router;