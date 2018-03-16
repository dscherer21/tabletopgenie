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
  //console.log("req=");
  //console.log(req);
  //console.log("res=");
  //console.log(res);
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;

  console.log(user_email);
  console.log(user_password);

  var query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [req.body.user_email], function (err, response) {
    console.log(response);
    if (response.length == 0) {
      console.log ("no such user");
      //res.redirect('/users/login-in')
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

        //res.redirect('/coupon');
      } else {
        console.log("password does not match");
        //res.redirect('/users/login-in')
      }
    });
  });
});

router.post('/create', function (req, res) {
  var query = "SELECT * FROM users WHERE email = ?"

  connection.query(query, [req.body.email], function (err, response) {
    console.log(response)
    if (response.length > 0) {
      res.send('we already have an email or username for this account')
    } else {

      bcrypt.genSalt(10, function (err, salt) {
        //res.send(salt)
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          var query = "INSERT INTO users (username, email, password_hash, company) VALUES (?, ?, ?, ?)"

          connection.query(query, [req.body.username, req.body.email, hash, req.body.company], function (err, response) {

            req.session.logged_in = true;

            req.session.user_id = response.insertId; //only way to get id of an insert for the mysql npm package

            var query = "SELECT * FROM users WHERE id = ?"
            connection.query(query, [req.session.user_id], function (err, response) {
              req.session.username = response[0].username;
              req.session.user_email = response[0].email;
              req.session.company = response[0].company;

              res.redirect('/coupons')
            });
          });
        });
      });
    }
  });
});


router.post('/login', function (req, res) {
  var query = "SELECT * FROM users WHERE email = ?"

  connection.query(query, [req.body.email], function (err, response) {
    console.log(response)
    if (response.length > 0) {
      res.send('we already have an email or username for this account')
    } else {

      bcrypt.genSalt(10, function (err, salt) {
        //res.send(salt)
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          var query = "INSERT INTO users (username, email, password_hash, company) VALUES (?, ?, ?, ?)"

          connection.query(query, [req.body.username, req.body.email, hash, req.body.company], function (err, response) {

            req.session.logged_in = true;

            req.session.user_id = response.insertId; //only way to get id of an insert for the mysql npm package

            var query = "SELECT * FROM users WHERE id = ?"
            connection.query(query, [req.session.user_id], function (err, response) {
              req.session.username = response[0].username;
              req.session.user_email = response[0].email;
              req.session.company = response[0].company;

              res.redirect('/coupons')
            });
          });
        });
      });
    }
  });
});


module.exports = router;