var express = require("express");
var Schedule = require("../models/Schedule");
var Course = require("../models/Course");
var utils = require("../utils/utilities");
var spawn = require("child_process").spawn;
var router = express.Router();

// defining route for get all schedules
router.get('/', function(req, res, next) {
	Schedule.getAllSchedules(function(err, rows) {
		utils.basicGetCallback(res, err, rows, null);
	});
});

// defining route for getting one schedule by id
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Schedule.getScheduleById(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, 0);
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

// defining route for generating a schedule
router.post('/Generate', function(req, res, next) {
	if (req.body.id) {
		Course.getCourseBySchedule(req.body.id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				var child = spawn('python', ['test.py', JSON.stringify(rows)]);
				var result = "";

				child.stdout.on('data', function(data) {
					console.log(data.toString());
					result += data.toString();
				});

				child.stderr.on('data', function(data) {
					console.log(data.toString());
				})

				child.on('close', function(code) {
					console.log(`child process exited with code ${code}`);
					res.json(result);
				});
			}
		});
	} else {
		res.json({success:false, message: "incomplete params"});
	}
});

module.exports = router;