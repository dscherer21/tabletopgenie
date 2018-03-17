var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = require('../config/connection.js');


console.log('users controller is loaded..');

//this is the users_controller.js file
router.get('/new', function (req, res) {
  res.render('users/new');
});

router.get('/log-in', function (req, res) {
  console.log("hit the login route");
  res.render('../app/views/users/login');
});

router.get('/sign-out', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/')
  })
});

//if user trys to sign in with the wrong password or email tell them that on the page
router.post('/login', function (req, res) {
  console.log("hit the post for login ...");
  var user_email = req.body.user_email;
  user_email = user_email.toLowerCase();
  var user_password = req.body.user_password;

  console.log(user_email);
  console.log(user_password);

  var query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [req.body.user_email], function (err, response) {
    console.log(response);
    if (response.length == 0) {
      console.log("no such user");
      //res.redirect('/users/login-in')
      res.send('no such user');
      return;
    };
    console.log("user found");
    bcrypt.compare(req.body.user_password, response[0].password_hash, function (err, result) {
      if (result == true) {
        console.log("user password matches");

        req.session.logged_in = true;
        req.session.user_id = response[0].id;
        req.session.user_email = response[0].email;
        //req.session.company = response[0].company;
        req.session.username = response[0].name;

        res.redirect('/group');
        //res.redirect('/');
      } else {
        console.log("password does not match");
        res.send("password does not match");
        //res.redirect('/users/login-in');
      }
    });
  });
});

router.post('/create', function (req, res) {
  var query = "SELECT * FROM users WHERE email = ?"
  var userPassword = req.body.user_password;
  var userPassword2 = req.body.user_password_2;
  var userName = req.body.user_name;
  var userEmail = req.body.user_email;
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

  //var tempStr = "";
  //tempStr = userEmail;
  userEmail = userEmail.toLowerCase();
  //check if the user name is blank
  if (userName === undefined || userName === null) {
    sendObjBack(10,
      "user name is blank",
      1,
      "the user name is blank and needs a non blank name of at least 5 characters"
    );
    return;
  };

  userName = userName.toLowerCase().trim();
  if (userName === null || userName === "") {
    sendObjBack(11,
      "user name is blank",
      1,
      "the user name is blank and needs a non blank name of at least 5 characters"
    );
    return;
  };

  if (userName.length < 5) {
    sendObjBack(1,
      "user name is too short",
      1,
      "the user name needs at least 5 characters"
    );
    return;
  };


  if (userEmail === undefined || userEmail === null) {
    sendObjBack(12,
      "user email is blank",
      2,
      "the user name is blank and needs to be the proper format"
    );
    return;
  };

  userEmail = userEmail.toLowerCase().trim();
  if (userEmail === null || userEmail === "") {
    sendObjBack(13,
      "user email is blank",
      2,
      "the user name is blank and needs to be the proper format"
    );
    res.send("email is blank");
    return;
  };

  //email not blank, so look if valid
  if (userEmail.indexOf(".") < 0) {
    sendObjBack(5,
      "user email is invalid",
      2,
      "user email does not have a '.' in it"
    );
    return;
  };

  if (userEmail.indexOf("@") < 0) {
    sendObjBack(6,
      "user email is invalid",
      2,
      "user email does not have an '@' in it"
    );
    return;
  };

  if (userPassword === undefined || userPassword === null) {
    sendObjBack(14,
      "user password is blank",
      3,
      "user password can not be blank and needs to be greater than 5 characters"
    );
    return;
  };

  userPassword = userPassword.trim();
  if (userPassword === null || userPassword === "") {
    sendObjBack(15,
      "user password is blank",
      3,
      "user password can not be blank (spaces don't count !!!) and needs to be greater than 5 characters"
    );
    return;
  };

  if (userPassword.length < 5) {
    sendObjBack(9,
      "user password is too short",
      3,
      "user password needs to be at least 5 characters without leading or trailing spaces"
    );
    return;
  };

  if (userPassword2 === undefined || userPassword2 === null) {
    sendObjBack(16,
      "confirming password is blank",
      4,
      "confirming password can not be blank"
    );
    return;
  };

  userPassword2 = userPassword2.trim();
  if (userPassword2 === null || userPassword2 === "") {
    sendObjBack(17,
      "confirming password is blank",
      4,
      "confirming password can not be blank and spaces don't count !"
    );
    return;
  };

  if (userPassword != userPassword2) {
    sendObjBack(30,
      "passwords don't match",
      4,
      "both passwords must match EXTACTLY including upper and lower case"
    );
    return;
  };


  connection.query(query, [req.body.user_email], function (err, response) {
    console.log(response)
    if (response.length > 0) {
      res.send('we already have an email or username for this account')
    } else {

      console.log("no such user, creating a new user");
      bcrypt.genSalt(10, function (err, salt) {
        //res.send(salt)
        bcrypt.hash(userPassword, salt, function (err, hash) {
          var query = "INSERT INTO users (name, email, password_hash ) VALUES (?, ?, ? )"

          connection.query(query, [userName, userEmail, hash], function (err, response) {
            //need to add error 
            console.log(err);
            req.session.logged_in = true;

            //req.session.user_id = response.insertId; //only way to get id of an insert for the mysql npm package
            //console.log(req.session.user_id);
            req.session.username = userName;
            req.session.user_email = userEmail;

            //var query = "SELECT * FROM users WHERE id = ?"
            //connection.query(query, [req.session.user_id], function (err, response) {
            //  console.log("after last query");
            res.redirect('/group');
            //res.redirect('/');
            //});
          });
        });
      });
    }
  });
});




module.exports = router;