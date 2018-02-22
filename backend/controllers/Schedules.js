var express = require("express");
var Schedule = require("../models/Schedule");
var utils = require("../utils/utilities");
var router = express.Router();

// defining route for get all schedules
router.get('/', function(req, res, next) {
	Schedule.getAllSchedules(function(err, rows) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			if (!utils.isEmptyObject(rows)) {
				rows.success = true;
				res.json(rows);
			} else {
				res.json({"success":false, "message":"no rows found"});
			}
		}
	});
});

// defining route for getting one schedule by id
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Schedule.getScheduleById(req.params.id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				if (!utils.isEmptyObject(rows)) {
					rows[0].success = true;
					res.json(rows[0]);
				} else {
					res.json({"success":false, "message":"no rows found"});
				}
			}
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
				if (err) {
					err.success = false;
					res.json(err);
				} else {
					count.success = true;
					res.json(count);
				}
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
				if (err) {
					err.success = false;
					res.json(err);
				} else {
					count.success = true;
					res.json(count);
				}
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
				if (err) {
					err.success = false;
					res.json(err);
				} else {
					count.success = true;
					res.json(count);
				}
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

module.exports = router;