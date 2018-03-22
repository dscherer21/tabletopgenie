// Set up MySQL connection.
var mysql = require("mysql");
var app = require('../../server');

/*var connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "",
    database: "Imperial_Assault_db"
});*/

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        port:3306,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'z2znazc687xl2iem'
    });
};

// Make connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});
//To run Database on JAWSDB



// Export connection for our ORM to use.
module.exports = connection;