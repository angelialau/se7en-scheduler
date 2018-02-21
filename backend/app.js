var express = require("express");
var bodyParser = require("body-parser");
var Users = require("./controllers/Users");
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/Users", Users);

app.listen(6666, function(){
	console.log("Serving Se7en-Scheduler on port 6666");
})