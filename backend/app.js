var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());

app.get("/", function(req, res){
	res.send("Hi there");
})

app.post("/createUser", function(req, res){
	res.json({"id": req.body.id});
})

app.listen(6666, function(){
	console.log("Serving Se7en-Scheduler on port 6666");
})