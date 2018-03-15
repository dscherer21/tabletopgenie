var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var methodOverride = require("method-override");
var morgan = require('morgan');


// Configure the Express application
var app = express();
var PORT = process.env.PORT || 3000;


//make public folder accessible to browser
app.use(express.static(path.join(__dirname, './app/public')));

//    USER TO REMAIN LOGGED IN   cookies and session
//following lines allow for a user to remain logged in
var cookieParser = require('cookie-parser');
var session = require('express-session');  //allows user to stay logged in
//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 6*1000*1000*1000*1000*1000*1000 }}));
app.use(cookieParser());


//need for parsing JSON files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(morgan('dev'));

//allow the use of DELETE
// Override with POST having ?_method=DELETE
//allows the use of PUT and DELETE where it normally wouldn't be allowed
//usage would be:  app.delete(  )
app.use(methodOverride("_method"));


//      HANDLE BARS
// Set Handlebars.
var exphbs = require("express-handlebars");

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo: function (a) { return 'FOO!' + a; },
        bar: function (b) { return 'BAR!' + b; },
        breaklines: function(text) {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        }
    },
    defaultLayout: "../../app/views/layouts/main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");       //sets default for file type for handlebar


//this is where the browser will go for paths after clicking
require(path.join(__dirname, './app/routing/apiRoutes'))(app);
//require(path.join(__dirname, './app/routing/htmlRoutes'))(app);

var applicationController = require("./app/controllers/applicationController.js");
var pictureController = require("./app/controllers/pictureController.js");

//prepends all the paths
app.use("/", applicationController);
app.use("/picture", pictureController);


// Start listening on PORT
app.listen(PORT, function() {
  console.log('app is up, running, and listening on port: ' + PORT);
});

