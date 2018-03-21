var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');
var moment = require("moment");
var numeral = require("numeral");
var nodemailer = require('nodemailer');

router.get('/', function (req, res) {
    console.log("hit the admin main schedule page");
});


module.exports = router;

