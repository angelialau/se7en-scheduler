var express = require("express");
var Schedule = require("../models/Schedule");
var utils = require("../utils/utilities");
var router = express.Router();

// defining route for get all schedules
router.get('/', function(req, res, next) {
	Schedule.getAllSchedules(function(err, rows) {
		utils.basicGetCallback(res, err, rows);
	});
});

// defining route for getting one schedule by id
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Schedule.getScheduleById(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows);
		});
	} 
});

// defining route for creating a schedule
router.post('/', function(req, res, next) {
	if (req.body.year && req.body.trimester) {

		Schedule.createSchedule(
			req.body.year, 
			req.body.trimester,
			function(err, count) {
				utils.basicPostCallback(res, err, count);
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining route for updating a schedule
router.post('/Update', function(req, res, next) {
	if (req.body.id && req.body.courses && req.body.year && req.body.trimester) {

		Schedule.updateSchedule(
			req.body.id,
			req.body.courses,
			req.body.year, 
			req.body.trimester,
			function(err, count) {
				utils.basicPostCallback(res, err, count);
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining route for deleting a schedule
router.post('/Delete', function(req, res, next) {
	if (req.body.id) {

		Schedule.deleteSchedule(
			req.body.id,
			function(err, count) {
				utils.basicPostCallback(res, err, count);
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

module.exports = router;