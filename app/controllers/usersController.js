var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = require('../config/connection.js');
var moment = require("moment");
var numeral = require("numeral");
var nodemailer = require('nodemailer');


//hack attack should look for 
//  <, >, !, &, /, \, '


console.log('users controller is loaded..');

var writeAuditLog = function (_typeRec, _user_name, _user_email, _fault, _browser_id, _ip_addr) {
  //write to the audit file
  //first make sure none are blank
  if (_typeRec === undefined || _typeRec === null) {
    _typeRec = " ";
  };
  if (_user_name === undefined || _user_name === null) {
    _user_name = " ";
  };
  if (_user_email === undefined || _user_email === null) {
    _user_email = " ";
  };
  if (_fault === undefined || _fault === null) {
    _fault = " ";
  };
  if (_browser_id === undefined || _browser_id === null) {
    _browser_id = " ";
  };
  if (_ip_addr === undefined || _ip_addr === null) {
    _ip_addr = " ";
  };

  var timeStamp = moment().unix();

  var query = "INSERT INTO audit_log ( typeRec, time_stamp, user_name, user_email, fault, browser_id, ip_addr ) VALUES (?, ?, ?, ?, ?, ?, ? )";


  connection.query(query, [_typeRec, timeStamp, _user_name, _user_email, _fault, _browser_id, _ip_addr], function (err, response) {
    console.log("error at audit = \n" + err);
    //write to audit file
    //if (err) throw err;
  });
};


//this is the users_controller.js file
router.get('/new', function (req, res) {
  res.render('users/new');
});

router.get('/log-in', function (req, res) {
  console.log("hit the login route");
  res.render('../app/views/users/login');
});
//Terminate Session
router.get('/log-out', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});


//if user trys to sign in with the wrong password or email tell them that on the page
router.post('/login', function (req, res) {
  var respondObj = {
    errCode: 0,   //0 if no error
    errLine: 0,   //which line of the input form
    errrMsg: "", //error message
    errExp: ""   //error explanation
  };

  var sendObjBack = function (errCode, errMsg, errLine, errExp, _user_name, _user_email) {
    writeAuditLog ( "login attempt", _user_name, _user_email, "code: " + errCode + " = " + errMsg, " ", " " );
    respondObj.errCode = errCode;
    respondObj.errLine = errLine;
    respondObj.errMsg = errMsg;
    respondObj.errExp = errExp;
    res.send(respondObj);  //send the object
  };

  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  user_password = user_password.trim();


  if (user_email === undefined || user_email === null) {
    sendObjBack(12,
      "USER EMAIL IS BLANK",
      2,
      "The user email is blank and needs to be in the proper format.",
      " ",
      user_email
    );
    return;
  };

  user_email = user_email.toLowerCase().trim();
  if (user_email === null || user_email === "") {
    sendObjBack(13,
      "USER EMAIL IS BLANK",
      2,
      "The user email is blank and needs to be in the proper format.",
      " ",
      user_email
    );
    return;
  };


  //email not blank, so look if valid
  if (user_email.indexOf("@") < 0) {
    sendObjBack(5,
      "USER EMAIL IS INVALID",
      2,
      "The user email does not have an '@' in it.",
      " ",
      user_email
    );
    return;
  };

  if (user_email.indexOf(".") < 0) {
    sendObjBack(6,
      "USER EMAIL IS INVALID",
      2,
      "The user email does not have a '.' in it.",
      " ",
      user_email
    );
    return;
  };


  if (user_password === undefined || user_password === null) {
    sendObjBack(14,
      "USER PASSWORD IS BLANK",
      3,
      "The user password can not be blank and needs to be greater than 5 characters.",
      " ",
      user_email
    );
    return;
  };

  user_password = user_password.trim();
  if (user_password === null || user_password === "") {
    sendObjBack(15,
      "USER PASSWORD IS BLANK",
      3,
      "The user password can not be blank (spaces don't count !!!) and needs to be greater than 5 characters.",
      " ",
      user_email
    );
    return;
  };

  var query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [user_email], function (err, response) {
    if (response.length == 0) {
      sendObjBack(35,
        "NO SUCH USER",
        1,
        "The email you have entered is not on file.",
        " ",
        user_email
        );
      return;
    };
    bcrypt.compare(user_password, response[0].password_hash, function (err, result) {
      if (result == true) {
        req.session.logged_in = true;
        req.session.user_id = response[0].id;
        req.session.user_email = response[0].email;
        req.session.username = response[0].name;

        //send object back with error code = 0
        //means everything passed
        sendObjBack(0,
          "",
          0,
          "",
          req.session.username,
          user_email
        );
      } else {
        sendObjBack(35,
          "WRONG PASSWORD",
          1,
          "The password entered does not match the one on record.",
          req.session.username,
          user_email
            );
      }
    });
  });
});



router.post('/create', function (req, res) {
  var query = "SELECT * FROM users WHERE email = ?"
  var userPassword = req.body.user_password;
  var userPassword2 = req.body.user_password2;
  var userName = req.body.user_name;
  var userEmail = req.body.user_email;
  var respondObj = {
    errCode: 0,   //0 if no error
    errLine: 0,   //which line of the input form
    errrMsg: "", //error message
    errExp: ""   //error explanation
  };


  var sendObjBack = function (errCode, errMsg, errLine, errExp, _user_name, _user_email) {
    writeAuditLog ( "login attempt", _user_name, _user_email, "code: " + errCode + " = " + errMsg, " ", " " );
    respondObj.errCode = errCode;
    respondObj.errLine = errLine;
    respondObj.errMsg = errMsg;
    respondObj.errExp = errExp;
    res.send(respondObj);  //send the object
  };
  //check if the user name is blank
  if (userName === undefined || userName === null) {
    sendObjBack(10,
      "USER NAME IS BLANK",
      1,
      "The user name is blank and needs a non blank name of at least 5 characters.",
      userName,
      userEmail
    );
    return;
  };

  userName = userName.toLowerCase().trim();
  if (userName === null || userName === "") {
    sendObjBack(11,
      "USER NAME IS BLANK",
      1,
      "The user name is blank and needs a non blank name of at least 5 characters.",
      userName,
      userEmail
    );
    return;
  };

  if (userName.length < 5) {
    sendObjBack(1,
      "USER NAME IS TOO SHORT",
      1,
      "The user name needs at least 5 characters.",
      userName,
      userEmail
    );
    return;
  };


  if (userEmail === undefined || userEmail === null) {
    sendObjBack(12,
      "USER EMAIL IS BLANK",
      2,
      "The user email is blank and needs to be in the proper format.",
      userName,
      userEmail
    );
    return;
  };

  userEmail = userEmail.toLowerCase().trim();
  if (userEmail === null || userEmail === "") {
    sendObjBack(13,
      "USER EMAIL IS BLANK",
      2,
      "The user email is blank and needs to be in the proper format.",
      userName,
      userEmail
    );
    return;
  };

  //email not blank, so look if valid
  if (userEmail.indexOf("@") < 0) {
    sendObjBack(5,
      "USER EMAIL IS INVALID",
      2,
      "The user email does not have an '@' in it.",
      userName,
      userEmail
    );
    return;
  };

  if (userEmail.indexOf(".") < 0) {
    sendObjBack(6,
      "USER EMAIL IS INVALID",
      2,
      "The user email does not have a '.' in it.",
      userName,
      userEmail
    );
    return;
  };

  if (userPassword === undefined || userPassword === null) {
    sendObjBack(14,
      "USER PASSWORD IS BLANK",
      3,
      "The user password can not be blank and needs to be greater than 5 characters.",
      userName,
      userEmail
    );
    return;
  };

  userPassword = userPassword.trim();
  if (userPassword === null || userPassword === "") {
    sendObjBack(15,
      "USER PASSWORD IS BLANK",
      3,
      "The user password can not be blank (spaces don't count !!!) and needs to be greater than 5 characters.",
      userName,
      userEmail
    );
    return;
  };

  if (userPassword.length < 5) {
    sendObjBack(9,
      "USER PASSWORD IS TOO SHORT",
      3,
      "The user password needs to be at least 5 characters without leading or trailing spaces.",
      userName,
      userEmail
    );
    return;
  };

  if (userPassword2 === undefined || userPassword2 === null) {
    console.log("pass2=" + userPassword2)
    sendObjBack(16,
      "CONFIRMING PASSWORD IS BLANK",
      4,
      "The confirming password can not be blank.",
      userName,
      userEmail
    );
    return;
  };

  userPassword2 = userPassword2.trim();
  if (userPassword2 === null || userPassword2 === "") {
    console.log("pass2b=" + userPassword2)
    sendObjBack(17,
      "CONFIRMING PASSWORD IS BLANK",
      4,
      "The confirming password can not be blank and spaces don't count !",
      userName,
      userEmail
    );
    return;
  };

  if (userPassword != userPassword2) {
    sendObjBack(30,
      "PASSWORDS DO NOT MATCH",
      4,
      "Both passwords must match EXTACTLY including upper and lower case.",
      userName,
      userEmail
    );
    return;
  };

  console.log("everything ok");

  connection.query(query, [req.body.user_email], function (err, response) {
    console.log(response)
    if (response.length > 0) {
      console.log("email already in use");
      sendObjBack(40,
        "EMAIL IS ALREADY IN USE",
        1,
        "An account with that email has already been setup. Either sign in " +
        "with that account or pick another email to use",
        userName,
        req.body.user_email
        );
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(userPassword, salt, function (err, hash) {
          var query = "INSERT INTO users (name, email, password_hash ) VALUES (?, ?, ? )"

          connection.query(query, [userName, userEmail, hash], function (err, response) {
            //need to add error 
            console.log(err);
            //now need to requery to make sure that the user just entered to get the user id
            var query = "SELECT * FROM users WHERE email = ?";

            connection.query(query, [userEmail], function (err, response) {
              req.session.user_id = response[0].id;
              req.session.logged_in = true;
              req.session.username = userName;
              req.session.user_email = userEmail;
              console.log("user added to db");
              sendObjBack(0,
                "",
                0,
                "",
                userName,
                userEmail
              );
              //query to re-read the current user to get their id
            });
          });
        });
      });
    }
  });
});


module.exports = router;

