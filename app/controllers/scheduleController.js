var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');
var moment = require("moment");
var numeral = require("numeral");


console.log('schedule controller is loaded...');

//this is the scheduleController.js file
router.get('/:group_id', function (req, res) {
    console.log("hit the main schedule page");
    console.log(req.session.user_id);
    console.log(req.session.username);
    console.log(req.params.group_id);

    var groupId = req.params.group_id;
    var sessionsOutput = [];
    var scheduledOutput = [];
    var isSchedOutput = false;
    //session object is for both types, past history and scheduled
    function sessionOutputObj(_group_name, _date_start, _date_stop, _picture_name, _location) {
        this.group_id = groupId;
        this.group_name = _group_name;
        this.date_start = moment.unix(_date_start).format("MM-DD-YYYY");
        this.day_start = moment.unix(_date_start).format("dddd");
        this.time_start = moment.unix(_date_start).format("hh:mm a");
        this.time_stop = moment.unix(_date_stop).format("hh:mm a");
        var diffTime = moment(moment.unix(_date_stop)).diff(moment.unix(_date_start));
        var durationTime = moment.duration(diffTime);
        var durationString = numeral(durationTime._data.hours).format("00") + ":" + numeral(durationTime._data.minutes).format("00");

        this.duration = durationString;   //hours min game was played
        if (_picture_name === undefined || _picture_name === null || _picture_name.trim() === "") {
            this.picture_taken = false;
            this.picture_avail = "No";
        } else {
            this.picture_taken = true;
            this.picture_avail = "Yes";
        };

        if (_location === undefined || _location === null || _location === "") {
            this.location = "none specified";
        } else {
            this.location = _location;
        };
    };

    var queryStr = "SELECT * FROM (SELECT * FROM user_groups a LEFT JOIN groups b ON a.group_id = b.id WHERE a.group_id = ? AND a.user_id = ?) c LEFT JOIN session d ON c.group_id=d.group_id";

    connection.query(queryStr, [groupId, req.session.user_id], function (err, response) {
        //all of the sessions of previous times pulled out
        for (var i = 0; i < response.length; i++) {
            //loop thru all of the responses
            sessionsOutput.push(new sessionOutputObj(
                response[i].name,
                response[i].game_date_start_unix,
                response[i].game_date_stop_unix,
                response[i].picture,
                ""
            ));
        };

        //check to see if there are any future sessions

        var queryStr2 = "SELECT * FROM (SELECT * FROM user_groups a LEFT JOIN groups b ON a.group_id = b.id WHERE a.group_id = ? AND a.user_id = ?) c LEFT JOIN scheduled d ON c.group_id=d.group_id";

        console.log("at query");
        console.log(queryStr2);
        connection.query(queryStr2, [groupId, req.session.user_id], function (err2, response2) {
            console.log("after query");
            //console.log(response2);
            console.log(err2);
            console.log("len = " + response2.length);
            if (response2.length === 0) {
                //there are no future sessions
                isSchedOutput = false;
            } else {
                //load up the scheduledOutput
                isSchedOutput = true;
                for (var i = 0; i < response2.length; i++) {
                    console.log(i);
                    //loop thru all of the responses
                    scheduledOutput.push(new sessionOutputObj(
                        response2[i].name,
                        response2[i].game_date_start_unix,
                        response2[i].game_date_stop_unix,
                        "",
                        response2[i].locat
                    ));
                };
            };
            console.log("sched len = " + scheduledOutput.length);
            res.render('../app/views/schedule/main', {
                user_email: req.session.user_email,
                logged_in: req.session.logged_in,
                user_name: req.session.username,
                group_id: groupId,
                start_date: moment().format("MM/DD/YYYY"),
                start_time: moment().format("hh:mm a"),
                stop_time: moment().format("hh:mm a"),
                outputLines: sessionsOutput,
                schedLines: scheduledOutput,
                isSchedOutput: isSchedOutput
            });
        });
    });
});


router.post('/save', function (req, res) {
    //save the next event
    console.log("hit the post for save");
    var groupId = req.body.group_id;
    var startDate = req.body.start_date;
    var startTime = req.body.start_time;
    var stopTime = req.body.stop_time;
    var nextLoc = req.body.nextLoc;


    var startDateStr = startDate + " " + startTime;
    var stopDateStr = startDate + " " + stopTime;

    var startDateUnix = moment(startDateStr, "MM/DD/YYYY hh:mm a").unix();
    var stopDateUnix = moment(stopDateStr, "MM/DD/YYYY hh:mm a").unix();

    console.log("start=" + startDateStr);
    console.log(startDateUnix);
    console.log("stop =" + stopDateStr);
    console.log(stopDateUnix);
    console.log(nextLoc);
    console.log(nextLoc.searchLoc);
    var addrString = nextLoc.searchLoc.addrSearchStr;
    console.log(addrString);

    var query = "INSERT INTO scheduled (group_id, locat, game_date_start_unix, game_date_stop_unix ) VALUES (?, ?, ?, ? )"

    connection.query(query, [groupId, addrString, startDateUnix, stopDateUnix], function (err, response) {
        //need to add error 
        console.log(err);
        console.log("appended schedule");
        /*
        sendObjBack(0,
            "",
            0,
            ""
        );
        */
        //query to re-read the current user to get their id
    });
});


module.exports = router;

