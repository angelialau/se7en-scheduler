var express = require("express");
var bodyParser = require("body-parser");
var Users = require("./controllers/Users");
var cors = require("cors");
var logger = require("morgan");
var app = express();

app.use(cors());
app.use(logger("common"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/Users", Users);

app.listen(6666, function(){
	console.log("Serving Se7en-Scheduler on port 6666");
})