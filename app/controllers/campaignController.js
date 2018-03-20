var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');

router.get("/:group", function (req, res) {

    var query = "SELECT u.name, u.id, ug.character_id, c.name AS char_name FROM users u LEFT JOIN user_groups ug ON u.id = ug.user_id LEFT JOIN characters c ON c.id = ug.character_id WHERE ug.group_id = (SELECT id FROM groups WHERE name = ?)";

    connection.query(query, [req.params.group], function (err, members) {
        var charQuery = "SELECT * FROM characters";
        console.log(members);
        connection.query(charQuery, function (err, characters) {


            res.render("../app/views/campaign/main-campaign", {
                group: req.params.group,
                logged_in: req.session.logged_in,
                user_name: req.session.username,
                members: members,
                characters: characters
            });
        });
    });
});

router.get("/:group/main", function (req, res) {
    var groupQ = "SELECT id FROM groups WHERE name = ?";
    connection.query(groupQ, [req.params.group], function (err, id) {
        var groupID = parseInt(id[0].id);

        var ugQuery = "SELECT * FROM user_groups WHERE group_id = ?";
        connection.query(ugQuery, [groupID], function (err, groupInfo) {

            var cQuery = "SELECT * FROM characters";
            connection.query(cQuery, function (err, chars) {
                var cardQuery = "SELECT * FROM cards";
                connection.query(cardQuery, function (err, cards) {
var missionCards = [];
var deploymentCards = [];
var commandCards = [];
var rewardCards = [];
var itemCards = [];
var supplyCards = [];
var classCards = [];

for (var i = 0; i < cards.length; i++){
    switch (cards[i].type){
        case "Story Mission":
        missionCards.push(cards[i]);
        break;

        case "Side Mission":
        missionCards.push(cards[i]);
        break;
        
        case "Deployment":
        deploymentCards.push(cards[i]);
        break;

        case "Command":
        commandCards.push(cards[i]);
        break;

        case "Reward":
        rewardCards.push(cards[i]);
        break;

        case "item":
        itemCards.push(cards[i]);
        break;

        case "supply":
        supplyCards.push(cards[i]);
        break;

        case "class":
        classCards.push(cards[i]);
        break;
    }
};
console.log(missionCards);
// console.log(deploymentCards);
// console.log(commandCards);
// console.log(rewardCards);
// console.log(itemCards);
// console.log(supplyCards);
// console.log(classCards);
                    res.render("../app/views/campaign/show-campaign", {
                        group: req.params.group,
                        groupInfo: groupInfo,
                        characters: chars,
                        missionCards: missionCards,
                        deploymentCards: deploymentCards,
                        commandCards: commandCards,
                        itemCards: itemCards,
                        supplyCards: supplyCards,
                        classCards: classCards,
                    });
                });
            });
        });
    });
});

router.post("/:group/characters", function (req, res) {
    var userIDs = req.body.memids;
    var charIDs = req.body.charids;
    console.log(userIDs);
    console.log(charIDs);
    console.log(req.params.group);
    var groupQ = "SELECT id FROM groups WHERE name = ?";
    connection.query(groupQ, [req.params.group], function (err, id) {
        var groupID = parseInt(id[0].id);

        var index = 0;

        var query = "UPDATE user_groups SET character_id = (?) WHERE user_id = (?) AND group_id = (?)";

        function charAdd() {
            connection.query(query, [parseInt(charIDs[index]), parseInt(userIDs[index]), groupID], function (err, response) {
                console.log("added char id " + charIDs[index] + " to user id " + userIDs[index] + " in group " + groupID);
                if (index < (userIDs.length - 1)) {
                    index++
                    charAdd();
                } else {
                    var empireQuery = "UPDATE user_groups SET empire = true WHERE character_id = 7";
                    connection.query(empireQuery, function (err, empResponse) {
                        console.log("empire update");
                    })
                }
            });
        }
        charAdd();
    });
    res.json({
        url: "/campaign/" + req.params.group + "/main"
    });
});


});
//Function to remove Groups from Database
/*var query = 'REMOVE FROM groups WHERE group_id=?'
connection.query(query, [req.body.groups], function (err, response) {
    throw err;
});*/

module.exports = router;