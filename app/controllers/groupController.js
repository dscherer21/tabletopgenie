var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');

router.get('/', function (req, res) {
    var query = "SELECT ug.*, g.id, g.name FROM groups g LEFT JOIN user_groups ug ON g.id = ug.group_id WHERE ug.user_id = ?"
    connection.query(query, [req.session.user_id], function (err, groups) {
        
        res.render('../app/views/groups/main-group', {
            groups: groups,
            logged_in: req.session.logged_in,
            user_name: req.session.username
        });
    });
});

router.get('/create/members/:group', function (req, res) {
    var group = req.params.group
    res.render('../app/views/groups/add-members', {
        group: group
    });
});

router.post('/create', function (req, res) {
    var group = req.body.group;
    var query = "SELECT * FROM groups WHERE name = ?"
    console.log(req.session.user_id);
    connection.query(query, [group], function (err, response) {
        console.log(response)
        if (response.length > 0) {
            res.send('There is already a group with that name.');
        } else {

            var query2 = "INSERT INTO groups (name) VALUES (?)"
            connection.query(query2, [group], function (err, response) {
                connection.query("SELECT id FROM groups WHERE name = ?", group, function (err, groupID) {
                    console.log("group id: " + groupID[0].id + "user_id: " + req.session.user_id);
                    var queryAdd = "INSERT INTO user_groups (group_id, user_id) VALUES (?, ?)";
                    connection.query(queryAdd, [groupID[0].id, req.session.user_id], function (err) {
                        res.redirect('/group/create/members/' + req.body.group);
                    });
                });
            });
        }
    });
});

router.post('/create/users', function (req, res) {
    var userQuery = "SELECT id FROM users WHERE email = ?";
    
    connection.query(userQuery, [req.body.email], function (err, response) {
        var userID = response[0].id;
        
        if (response.length > 0) {
            var groupQuery = "SELECT id FROM groups WHERE name = ?";
            connection.query(groupQuery, req.body.group, function (err, res2) {

                var groupID = res2[0].id;
                var query = "INSERT INTO user_groups (group_id, user_id) VALUES (?, ?)";
                
                connection.query(query, [groupID, userID], function (err, res3) {
                    console.log("user added to usergroup");
                });
            });
        } else {
            res.send("That user does not exist");
        }
    });
});

module.exports = router;