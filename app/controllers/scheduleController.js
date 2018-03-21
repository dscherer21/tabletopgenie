var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');
var moment = require("moment");
var numeral = require("numeral");
var nodemailer = require('nodemailer');


//setup with password
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tabletopgenieproj@gmail.com',
        pass: 'projpassword1'
    }
});



//session object is for both types, past history and scheduled
function sessionOutputObj(_schedId, _groupId, _group_name, _date_start, _date_stop, _picture_name, _location) {
    this.schedId = _schedId;
    this.group_id = _groupId;
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



console.log('schedule controller is loaded...');

//this is the scheduleController.js file
router.get('/:group_id', function (req, res) {
    console.log("hit the main schedule page");
    //console.log(req.session.user_id);
    //console.log(req.session.username);
    //console.log(req.params.group_id);
    req.session.group_id = req.params.group_id;

    var groupId = req.params.group_id;
    var sessionsOutput = [];
    var scheduledOutput = [];
    var isSchedOutput = false;

    var queryStr = "SELECT * FROM (SELECT * FROM user_groups a LEFT JOIN groups b ON a.group_id = b.id WHERE a.group_id = ? AND a.user_id = ?) c LEFT JOIN session d ON c.group_id=d.group_id";

    connection.query(queryStr, [groupId, req.session.user_id], function (err, response) {
        //all of the sessions of previous times pulled out
        for (var i = 0; i < response.length; i++) {
            //loop thru all of the responses
            sessionsOutput.push(new sessionOutputObj(
                i,                 //normally the spot for schedule id
                groupId,
                response[i].name,  //this is group name
                response[i].game_date_start_unix,
                response[i].game_date_stop_unix,
                response[i].picture,
                ""
            ));
        };

        //check to see if there are any future "scheduled" sessions
        var queryStr2 = "SELECT * FROM (SELECT * FROM user_groups a LEFT JOIN groups b ON a.group_id = b.id WHERE a.group_id = ? AND a.user_id = ?) c LEFT JOIN scheduled d ON c.group_id=d.group_id";

        connection.query(queryStr2, [groupId, req.session.user_id], function (err2, response2) {
            if (response2.length === 0) {
                //there are no future sessions
                isSchedOutput = false;
            } else {
                //load up the scheduledOutput
                isSchedOutput = true;
                for (var i = 0; i < response2.length; i++) {
                    //loop thru all of the responses
                    scheduledOutput.push(new sessionOutputObj(
                        response2[i].id,         //sched id for deleting
                        groupId,
                        response2[i].name,
                        response2[i].game_date_start_unix,
                        response2[i].game_date_stop_unix,
                        "",
                        response2[i].locat
                    ));
                };
            };
            res.render('../app/views/schedule/main', {
                user_email: req.session.user_email,
                logged_in: req.session.logged_in,
                user_name: req.session.username,
                group: req.params.group,
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

    var respondObj = {
        errCode: 0,   //0 if no error
        errLine: 0,   //which line of the input form
        errrMsg: "", //error message
        errExp: ""   //error explanation
    };

    var sendObjBack = function (errCode, errMsg, errLine, errExp) {
        respondObj.errCode = errCode;
        respondObj.errLine = errLine;
        respondObj.errMsg = errMsg;
        respondObj.errExp = errExp;
        res.send(respondObj);  //send the object
    };


    var addrString = nextLoc.searchLoc.addrSearchStr;

    var query = "INSERT INTO scheduled (group_id, locat, game_date_start_unix, game_date_stop_unix ) VALUES (?, ?, ?, ? )"

    connection.query(query, [groupId, addrString, startDateUnix, stopDateUnix], function (err, response) {
        //need to add error 
        console.log(err);
        console.log("appended schedule");

        sendObjBack(0,
            "",
            0,
            ""
        );

        //query to re-read the current user to get their id
    });
});


router.post('/done', function (req, res) {
    //picked done, so send the email
    console.log("hit the spot for /done");
    var groupId = req.body.group_id;
    var startDate = req.body.start_date;
    var startTime = req.body.start_time;
    var stopTime = req.body.stop_time;
    var nextLoc = req.body.nextLoc;

    //var groupId = req.params.group_id;
    //var groupId = req.session.group_id;
    var sessionsOutput = [];
    var scheduledOutput = [];
    var isSchedOutput = false;


    var respondObj = {
        errCode: 0,   //0 if no error
        errLine: 0,   //which line of the input form
        errrMsg: "", //error message
        errExp: ""   //error explanation
    };

    var sendObjBack = function (errCode, errMsg, errLine, errExp) {
        respondObj.errCode = errCode;
        respondObj.errLine = errLine;
        respondObj.errMsg = errMsg;
        respondObj.errExp = errExp;
        res.send(respondObj);  //send the object
    };


    var mailOptions = function (_to, _subject, _html) {
        this.from = 'TableTopGenieProj@gmail.com'; // sender address
        this.to = _to;                   // list of receivers
        this.subject = _subject;          // Subject line
        this.html = _html                 // plain text body
    };


    // pull out all the future sessions

    var queryStr2 = "SELECT * FROM (SELECT * FROM user_groups a LEFT JOIN groups b ON a.group_id = b.id WHERE a.group_id = ? AND a.user_id = ?) c LEFT JOIN scheduled d ON c.group_id=d.group_id";

    connection.query(queryStr2, [groupId, req.session.user_id], function (err2, response2) {
        console.log("after query");
        //console.log(response2);
        console.log(err2);
        if (response2.length === 0) {
            //there are no future sessions
            isSchedOutput = false;
        } else {
            //load up the scheduledOutput
            isSchedOutput = true;
            for (var i = 0; i < response2.length; i++) {
                //loop thru all of the responses
                scheduledOutput.push(new sessionOutputObj(
                    id,
                    groupId,
                    response2[i].name,
                    response2[i].game_date_start_unix,
                    response2[i].game_date_stop_unix,
                    "",
                    response2[i].locat
                ));
            };

            //all of the output lines have been formatted in the scheduledOutput array
            //put into array for debugging later on can do this logic on the fly
            for (var i = 0; i < scheduledOutput.length; i++) {
                var subjectStr = scheduledOutput[i].date_start + " game night @ " + scheduledOutput[i].time_start + " from TableTopGenie";
                var messageStr = "<h3>You have an upcoming game night on:</h3><br/>";
                messageStr += "<br/>" + scheduledOutput[i].day_start + " " + scheduledOutput[i].date_start
                messageStr += " @ " + scheduledOutput[i].time_start;
                messageStr += "<br/>Expected finish: " + scheduledOutput[i].time_stop;
                messageStr += "<br/>Location: " + scheduledOutput[i].location;
                messageStr += "<br/><br/>for game group : " + scheduledOutput[i].group_name;

                var mailTo = "RichBu001@gmail.com";
                //var mailTo = "RichBu001@gmail.com, mrerlander@gmail.com, dscherer21@gmail.com";
                var mailOptionsObj = new mailOptions(mailTo, subjectStr, messageStr);
                transporter.sendMail(mailOptionsObj, function (err, info) {
                    if (err)
                        console.log(err)
                    else
                        console.log(info);
                });

            };
        };

    });

});


module.exports = router;

