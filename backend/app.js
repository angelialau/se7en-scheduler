var express = require("express");
var app = express();

app.get("/", function(req, res){
	res.send("Hi there");
})

app.listen(6666, function(){
	console.log("Serving Se7en-Scheduler on port 12345");
})