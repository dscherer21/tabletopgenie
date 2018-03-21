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
    console.log(req.session.username);
    var userIDQ = "SELECT id FROM users WHERE name = ?";
    connection.query(userIDQ, [req.session.username], function (err, thisUserID) {
        console.log(thisUserID[0].id);
        var empireQ = "SELECT empire from user_groups WHERE user_id = ?"
        connection.query(empireQ, [thisUserID[0].id], function (err, isEmpire) {
            console.log(isEmpire[0].empire);
            var groupQ = "SELECT id FROM groups WHERE name = ?";
            connection.query(groupQ, [req.params.group], function (err, id) {
                var groupID = parseInt(id[0].id);

                var ugQuery = "SELECT ug.*, c.name FROM user_groups ug LEFT JOIN characters c ON c.id = ug.character_id WHERE group_id = ?";
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

                            for (var i = 0; i < cards.length; i++) {
                                switch (cards[i].type) {
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

                            res.render("../app/views/campaign/show-campaign", {
                                logged_in: req.session.logged_in,
                                user_name: req.session.username,
                                group: req.params.group,
                                isEmpire: isEmpire[0].empire,
                                groupInfo: groupInfo,
                                characters: chars,
                                missionCards: missionCards,
                                deploymentCards: deploymentCards,
                                commandCards: commandCards,
                                itemCards: itemCards,
                                supplyCards: supplyCards,
                                classCards: classCards,
                                rewardCards: rewardCards
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get("/:group/addsession", function (req, res) {
    var groupName = req.params.group;

    console.log(groupName);

    var groupNameQ = "SELECT id FROM groups WHERE name = (?)"
    connection.query(groupNameQ, [groupName], function (err, groupI) {

        var groupID = groupI[0].id;
        console.log(groupID);

        var newSession = "INSERT INTO session (group_id) VALUES (?)"
        connection.query(newSession, [groupID], function (err, sessionInsert) {

            var getSession = "SELECT MAX(id) from session WHERE group_id = ?";
            connection.query(getSession, [groupID], function (req, session) {

                var sessionID = session[0].id;

                var gameCardQ = "UPDATE game_cards SET session_id = ? WHERE session_id = NULL";
                connection.query(gameCardQ, [sessionID], function (err, updateGame) {

                    var charCardQ = "UPDATE character_cards SET session_id = ? WHERE session_id = NULL";
                    connection.query(charCardQ, [sessionID], function (err, updateChar) {

                        var sessionsQ = "SELECT * FROM session WHERE group_id = ?";
                        connection.query(sessionsQ, [groupID], function (err, sessions) {

                            res.redirect("/picture/" + groupID + "/" + groupName);
                        });
                    });
                });
            });
        });
    });
});

router.get("/:group/:session", function (req, res) {
    console.log(req.session.username);
    var session = req.params.session;
    var userIDQ = "SELECT id FROM users WHERE name = ?";
    connection.query(userIDQ, [req.session.username], function (err, thisUserID) {
        console.log(thisUserID[0].id);
        var empireQ = "SELECT empire from user_groups WHERE user_id = ?"
        connection.query(empireQ, [thisUserID[0].id], function (err, isEmpire) {
            console.log(isEmpire[0].empire);
            var groupQ = "SELECT id FROM groups WHERE name = ?";
            connection.query(groupQ, [req.params.group], function (err, id) {
                var groupID = parseInt(id[0].id);

                var ugQuery = "SELECT ug.*, c.name FROM user_groups ug LEFT JOIN characters c ON c.id = ug.character_id WHERE group_id = ?";
                connection.query(ugQuery, [groupID], function (err, groupInfo) {

                    var cQuery = "SELECT * FROM characters";
                    connection.query(cQuery, function (err, chars) {
                        var charCardQuery = "SELECT * FROM game_cards WHERE session_id = ?";
                        connection.query(charCardQuery, [session], function (err, charCards) {
                            var charMissionCards = [];
                            var charDeploymentCards = [];
                            var charCommandCards = [];
                            var charRewardCards = [];
                            var charItemCards = [];
                            var charSupplyCards = [];
                            var charClassCards = [];

                            for (var i = 0; i < charCards.length; i++) {
                                switch (charCards[i].type) {
                                    case "Story Mission":
                                        charMissionCards.push(charCards[i]);
                                        break;

                                    case "Side Mission":
                                        charMissionCards.push(charCards[i]);
                                        break;

                                    case "Deployment":
                                        charDeploymentCards.push(charCards[i]);
                                        break;

                                    case "Command":
                                        charCommandCards.push(charCards[i]);
                                        break;

                                    case "Reward":
                                        charRewardCards.push(charCards[i]);
                                        break;

                                    case "item":
                                        charItemCards.push(charCards[i]);
                                        break;

                                    case "supply":
                                        charSupplyCards.push(charCards[i]);
                                        break;

                                    case "class":
                                        charClassCards.push(charCards[i]);
                                        break;
                                }
                            };
                            var gameCardQuery = "SELECT * FROM game_cards WHERE session_id = ?";
                            connection.query(gameCardQuery, [session], function (err, gameCards) {
                                var gameMissionCards = [];
                                var gameDeploymentCards = [];
                                var gameCommandCards = [];
                                var gameRewardCards = [];
                                var gameItemCards = [];
                                var gameSupplyCards = [];
                                var gameClassCards = [];

                                for (var i = 0; i < gameCards.length; i++) {
                                    switch (gameCards[i].type) {
                                        case "Story Mission":
                                            gameMissionCards.push(gameCards[i]);
                                            break;

                                        case "Side Mission":
                                            gameMissionCards.push(gameCards[i]);
                                            break;

                                        case "Deployment":
                                            gameDeploymentCards.push(gameCards[i]);
                                            break;

                                        case "Command":
                                            gameCommandCards.push(gameCards[i]);
                                            break;

                                        case "Reward":
                                            gameRewardCards.push(gameCards[i]);
                                            break;

                                        case "item":
                                            gameItemCards.push(gameCards[i]);
                                            break;

                                        case "supply":
                                            gameSupplyCards.push(gameCards[i]);
                                            break;

                                        case "class":
                                            gameClassCards.push(gameCards[i]);
                                            break;
                                    }
                                };

                                res.render("../app/views/campaign/session-view", {
                                    logged_in: req.session.logged_in,
                                    user_name: req.session.username,
                                    group: req.params.group,
                                    isEmpire: isEmpire[0].empire,
                                    groupInfo: groupInfo,
                                    characters: chars,
                                    charMissionCards: charMissionCards,
                                    charDeploymentCards: charDeploymentCards,
                                    charCommandCards: charCommandCards,
                                    charItemCards: charItemCards,
                                    charSupplyCards: charSupplyCards,
                                    charClassCards: charClassCards,
                                    charRewardCards: charRewardCards,
                                    gameMissionCards: gameMissionCards,
                                    gameDeploymentCards: gameDeploymentCards,
                                    gameCommandCards: gameCommandCards,
                                    gameItemCards: gameItemCards,
                                    gameSupplyCards: gameSupplyCards,
                                    gameClassCards: gameClassCards,
                                    gameRewardCards: gameRewardCards
                                });
                            });
                        });
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
        logged_in: req.session.logged_in,
        user_name: req.session.username,
        url: "/campaign/" + req.params.group + "/main"
    });
});

router.post("/:group/imperialupdate", function (req, res) {
    var imperialCards = req.body.imperial_cards;
    var groupName = req.body.group;
    var groupID;

    console.log(req.body);

    var gIDQuery = "SELECT id FROM groups WHERE name = ?";
    connection.query(gIDQuery, [groupName], function (err, gID) {

        groupID = gID[0].id;

        var impGameCardAdd = "INSERT INTO game_cards (group_id, card_id, empire) VALUES (?, ?, ?)";
        var addIndex = 0;

        function cardAdd() {
            connection.query(impGameCardAdd, [groupID, parseInt(imperialCards[addIndex]), true], function (err, cardsAdded) {
                if (addIndex < (imperialCards.length - 1)) {
                    addIndex++;
                    cardAdd();
                } else {
                    return
                }
            });
        }
        cardAdd()

        res.sendStatus(200);
    });
});

router.post("/:group/allyupdate", function (req, res) {
    var allyCards = req.body.ally_cards;
    var groupName = req.body.group;
    var credits = req.body.credits;
    var groupID;

    console.log(req.body);

    var gIDQuery = "SELECT id FROM groups WHERE name = ?";
    connection.query(gIDQuery, [groupName], function (err, gID) {

        groupID = gID[0].id;

        var allyGameCardAdd = "INSERT INTO game_cards (group_id, card_id, credits) VALUES (?, ?, ?)";
        var addIndex = 0;

        function cardAdd() {
            connection.query(allyGameCardAdd, [groupID, parseInt(allyCards[addIndex]), credits], function (err, cardsAdded) {
                if (addIndex < (allyCards.length - 1)) {
                    addIndex++;
                    cardAdd();
                } else {
                    return
                }
            });
        }
        cardAdd()

        res.sendStatus(200);
    });
});

router.post("/:groupid/:charid", function (req, res) {
    var charCards = req.body.char_cards;
    var groupID = parseInt(req.params.groupid);
    var character = parseInt(req.params.charid);
    var xp = parseInt(req.body.xp);

    console.log(req.body);




    var userIDQuery = "SELECT user_id FROM user_groups WHERE group_id = ? AND character_id = ?";
    connection.query(userIDQuery, [groupID, character], function (err, user) {

        var userID = user[0].user_id;

        var charGameCardAdd = "INSERT INTO character_cards (group_id, user_id, character_id, card_id, xp) VALUES (?, ?, ?, ?, ?)";
        var addIndex = 0;

        function cardAdd() {
            connection.query(charGameCardAdd, [groupID, userID, character, parseInt(charCards[addIndex]), xp], function (err, cardsAdded) {

                if (addIndex < (charCards.length - 1)) {
                    addIndex++;
                    cardAdd();
                } else {
                    return
                }
            });
        }
        cardAdd()

        res.sendStatus(200);
    });
});




// //Function to remove Groups from Database
// /*var query = 'REMOVE FROM groups WHERE group_id=?'
// connection.query(query, [req.body.groups], function (err, response) {
//     throw err;
// });*/

module.exports = router;