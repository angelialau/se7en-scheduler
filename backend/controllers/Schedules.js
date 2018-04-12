var express = require("express");
var Schedule = require("../models/Schedule");
var Course = require("../models/Course");
var Calendar = require("../models/Calendar");
var utils = require("../utils/utilities");
var fecha = require("fecha");
var spawn = require("child_process").spawn;
var router = express.Router();
var options = {
    cwd: process.cwd(),
    env: process.env,
};

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
	if (req.body.year && 
		req.body.trimester &&
		req.body.startDate &&
		req.body.endDate) {

		var startDate = fecha.format(new Date(req.body.startDate), 'YYYY-MM-DD HH:mm:ss');
		var endDate = fecha.format(new Date(req.body.endDate), 'YYYY-MM-DD HH:mm:ss');

		Schedule.createSchedule(
			req.body.year, 
			req.body.trimester,
			startDate,
			endDate,
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
				// change rows to format needed for algo
				var input = {};
				var generatorErr;

				for (var i = 0; i < Object.keys(rows).length; i++) {
					input[i] = Course.rowToJSON(JSON.parse(JSON.stringify(rows[i])));
				}
				
				// start child algo process
				var child = spawn('python3', ['./utils/generator.py', JSON.stringify(input)], options);
				var result = "";

				// save all the outputs
				child.stdout.on('data', function(data) {
					result += data.toString();
				});

				// log error if any
				child.stderr.on('data', function(data) {
					console.log("ERR child process: " + data.toString());
					generatorErr = "Generator Algorithm: "data.toString(); 
				});

				// once child process ends, update SQL table
				child.on('close', function(code) {
					if (!generatorErr) {
						// convert output to array
						var output = JSON.parse("[" + result.substring(0, result.length - 2) + "]");

						// update SQL table for each generated entry
						output.forEach(function(entry) {
							Calendar.addGeneratedEvent(req.body.id, entry, function(err, count) {
								if (err) {
									console.log(err);
								}
							})
						});

						// set generated bit to 1 on schedule
						Schedule.updateGenerated(req.body.id);
						output.success = true;
						res.json(output);
					} else {
						res.json({"success":false, "message":generatorErr});
					}
				});
			}
		});
	} else {
		res.json({success:false, message: "incomplete params"});
	}
});

module.exports = router;