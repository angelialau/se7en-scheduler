var express = require("express");
var Reply = require("../models/Reply");
var utils = require("../utils/utilities");
var router = express.Router();

// defining create reply route
router.post('/', function(req, res, next) {
	// check if necessary params are available
	if (utils.compareJSONKeys(req.body, Reply.createStructure)) {
		// create Reply
		Reply.createReply(req.body, function(err, count) {
			utils.basicPostCallback(res, err, count);
		})
	} else {
		console.log(req.body);
		console.log(Reply.createStructure);
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining get Reply by id route
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Reply.getReplyById(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, 0);
		});
	} 
});

// defining get all Replies route
router.get('/', function(req, res, next) {
	// if no id given, return all rows
	Reply.getReplies(function(err, rows) {
		utils.basicGetCallback(res, err, rows, null);
	});
});

// defining get Replies by instructor id route
router.get('/Instructor/:instructorId(\\d+)', function(req, res, next) {
	if (req.params.instructorId) {
		Reply.getRepliesByInstructorId(req.params.instructorId, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining delete Reply route
router.post('/Delete', function(req, res, next) {
	if (req.body.id) {
		Reply.deleteReply(req.body.id, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	}
});

module.exports = router;