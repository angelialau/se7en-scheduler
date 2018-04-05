var express = require("express");
var bodyParser = require("body-parser");
var Users = require("./controllers/Users");
var Schedules = require("./controllers/Schedules");
var Courses = require("./controllers/Courses");
var Notifications = require("./controllers/Notifications");
var Calendars = require("./controllers/Calendars");
var Appeals = require("./controllers/Appeals");
var cors = require("cors");
var logger = require("morgan");
var app = express();

// Setting up tools
app.use(cors());
app.use(logger("common"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Defining routes
app.use("/Users", Users);
app.use("/Schedules", Schedules);
app.use("/Courses", Courses);
app.use("/Notifications", Notifications);
app.use("/Calendars", Calendars);
app.use("/Appeals", Appeals);

app.listen(6666, function(){
	console.log("Serving Se7en-Scheduler on port 6666");
})