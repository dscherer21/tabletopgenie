var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');
var moment = require("moment");
var numeral = require("numeral");
var nodemailer = require('nodemailer');
var crypto = require('crypto');



function encrypt(text) {
    var crypto_algorithm = 'aes-256-ctr';
    var crypto_password = 'HeLlo';
        var cipher = crypto.createCipher(crypto_algorithm, crypto_password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var crypto_algorithm = 'aes-256-ctr';
    var crypto_password = 'HeLlo';
        console.log(text);
    var decipher = crypto.createDecipher(crypto_algorithm, crypto_password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


//session object is for both types, past history and scheduled


router.get('/1', function (req, res) {
    console.log("hit the admin audit page");

    var auditOutput = [];

    var queryStr = "SELECT * FROM audit_log";

    function auditOutputObj(_typeRec, _time_stamp, _user_name, _user_email, _fault, _browser_id, _ip_addr) {
        this.typeRec = _typeRec;
        this.time_stamp = _time_stamp;
        this.user_name = _user_name;
        this.user_email = _user_email;
        this.fault = _fault;
        this.browser_id = _browser_id;
        this.ip_addr = _ip_addr;

        this.timeStampStr = moment.unix(_time_stamp).format("YYYY-MM-DD  hh:mm a");
    };


    connection.query(queryStr, [], function (err, response) {
        //all of the sessions of previous times pulled out
        for (var i = 0; i < response.length; i++) {
            //loop thru all of the responses
            auditOutput.push(new auditOutputObj(
                response[i].typeRec,
                response[i].time_stamp,
                response[i].user_name,
                response[i].user_email,
                response[i].fault,
                response[i].browser_id,
                response[i].ip_addr
            ));
        };

        res.render('../app/views/admin/audits', {
            outputLines: auditOutput
        });
    });
});


router.get('/2', function (req, res) {
    console.log("hit the admin users page");

    var auditOutput = [];

    var queryStr = "SELECT * FROM users";

    function auditOutputObj(_id, _name, _email_hash, _email, _password_hash) {
        this.id = _id;
        this.name = _name;
        this.email_hash = _email_hash;
        this.email = _email,
            this.password_hash = _password_hash;
    };


    connection.query(queryStr, [], function (err, response) {
        //all of the sessions of previous times pulled out
        for (var i = 0; i < response.length; i++) {
            //loop thru all of the responses
            var testStr = response[i].email;
            //encryption / decrypt can not be done on null strings
            if( testStr===undefined || testStr===null || testStr==="" ){ 
                testStr = encrypt( " ");
                testStr = encrypt(testStr);
            };
            var emailDecrypt = decrypt(testStr);
            auditOutput.push(new auditOutputObj(
                response[i].id,
                response[i].name,
                response[i].email,
                emailDecrypt,
                response[i].password_hash,
            ));
        };

        res.render('../app/views/admin/users', {
            outputLines: auditOutput
        });
    });
});



module.exports = router;

