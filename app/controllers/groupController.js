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
    var group = req.params.group;

    res.render('../app/views/groups/add-members', {
        group: group,
        logged_in: req.session.logged_in,
        user_name: req.session.userName
    });
});

router.post('/create', function (req, res) {
    var group = req.body.group_name;
    var query = "SELECT * FROM groups WHERE name = ?"

    connection.query(query, [group], function (err, response) {
        if (response.length > 0) {

            var query = "SELECT ug.*, g.id, g.name FROM groups g LEFT JOIN user_groups ug ON g.id = ug.group_id WHERE ug.user_id = ?"
            connection.query(query, [req.session.user_id], function (err, groups) {

                res.json({
                    groups: groups,
                    logged_in: req.session.logged_in,
                    user_name: req.session.userName,
                    group_exists: true
                });
            });
        } else {

            var query2 = "INSERT INTO groups (name) VALUES (?)"

            connection.query(query2, [group], function (err, response) {

                connection.query("SELECT id FROM groups WHERE name = ?", [group], function (err, groupID) {

                    var queryAdd = "INSERT INTO user_groups (group_id, user_id) VALUES (?, ?)";

                    connection.query(queryAdd, [groupID[0].id, req.session.user_id], function (err) {
                        console.log(group);
                        res.json({
                            group: group
                        });
                    });
                });
            });
        }
    });
});

router.post('/create/users', function (req, res) {
    var group = req.body.group_name;
    var email = req.body.email;
    console.log(group);
    console.log(email);
    var userQuery = "SELECT id FROM users WHERE email = ?";

    connection.query(userQuery, [email], function (err, response) {


        if (response.length > 0) {
            var userID = response[0].id;
            var groupQuery = "SELECT id FROM groups WHERE name = ?";

            connection.query(groupQuery, [group], function (err, res2) {

                var groupID = res2[0].id;
                var queryExists = "SELECT * from user_groups WHERE user_id = (?)";

                connection.query(queryExists, [userID], function (err, res3) {
                    if (res3.length <= 0) {
                        console.log("exists route");
                        res.json({
                            group: group,
                            user_already_added: true

                        });

                    } else {
                        console.log(res3);
                        console.log("insert route");
                        var insertQuery = "INSERT INTO user_groups (group_id, user_id) VALUES (?, ?)";

                        connection.query(insertQuery, [groupID, userID], function (err, res4) {

                            res.json({
                                group: group,
                                email: email,
                                exists: true

                            });
                        });
                    }
                });
            });
        } else {
            res.json({
                group: group,
                exists: false
            });
        }
    });
});

module.exports = router;