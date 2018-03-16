var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');

router.get('/new', function (req, res) {
    res.render('groups/new');
});

router.get('/', function (req, res) {
    var query = "SELECT ug.* g.group_id FROM groups g LEFT JOIN user_groups ug ON g.id = ug.group_id WHERE ug.user_id = ?";
    connection.query(query, [req.session.user_id], function (err, groups) {

        
        res.render('groups/main-group', {
            groups: groups
        });
    });
});

router.get('/create/members', function(req, res){
    res.render('groups/add-members');
});

router.post('/create', function (req, res) {
    var query = "SELECT * FROM groups WHERE name = ?"

    connection.query(query, [req.body.name], function (err, response) {
        console.log(response)
        if (response.length > 0) {
            res.send('There is already a group with that name.');
        } else {

            var query2 = "INSERT INTO groups (name) VALUES (?)"
            connection.query(query2, [req.body.name], function (err, response) {

                res.redirect('/create/members');
            });
        }
    });
});

router.post('/create/users', function (req, res) {
    var userID = "";
    var userQuery = "SELECT id FROM users WHERE email = ?";

    connection.query(userQuery, [req.body.email], function (err, response) {
        userID = response;

        var query = "INSERT INTO user_groups (group_id, user_id) VALUES (?, ?)";
        connection.query(query, [req.body.group, userID], function (err, response) {
            console.log(response);
        });
    });
});

module.exports = router;