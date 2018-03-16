// Set up MySQL connection.
var mysql = require("mysql");
var app = require('../../server');

var connection = mysql.createConnection({
    port: 3000,
    host: "localhost",
    user: "root",
    password: "",
    database: "imperial_assault_db"
});


// Make connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;