var express = require("express");
var Schedule = require("../models/Schedule");
var Course = require("../models/Course");
var utils = require("../utils/utilities");
var router = express.Router();

// defining route for get all courses
router.get('/', function(req, res, next) {
	Course.getAllCourses(function(err, rows) {
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

// defining route for getting one course by id
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Course.getCourseById(req.params.id, function(err, rows) {
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

// defining route for getting courses with schedule_id
router.get('/BySchedule/:schedule_id(\\d+)', function(req, res, next) {
	if (req.params.schedule_id) {
		Course.getCourseBySchedule(req.params.schedule_id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				if (!utils.isEmptyObject(rows)) {
					res.json(rows);
				} else {
					res.json({"success":false, "message":"no rows found"});
				}
			}
		});
	} 
});

// defining route for creating a course
router.post('/', function(req, res, next) {
	if (req.body.schedule_id && 
		req.body.core && 
		req.body.no_sessions &&
		req.body.session_hrs &&
		req.body.locations &&
		req.body.term &&
		req.body.instructors &&
		req.body.course_no &&
		req.body.course_name
	) {

		// Create the course
		Course.createCourse(
			req.body.schedule_id, 
			req.body.core,
			req.body.no_sessions,
			req.body.session_hrs,
			req.body.locations,
			req.body.term,
			req.body.instructors,
			req.body.course_no,
			req.body.course_name,
			function(create_err, create_count) {
				// return error if any
				if (create_err) {
					create_err.success = false;
					res.json(create_err);
				} else {
					// update schedule
					Schedule.updateScheduleCourses(
						req.body.schedule_id,
						create_count.insertId,
						1,
						function(update_err, update_count) {
							if (update_err) {
								res.json(update_err);
							} else {
								create_count.success = true;
								res.json(create_count);
							}
						});
				}
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining route for updating a course
router.post('/Update', function(req, res, next) {
	if (
		req.body.core && 
		req.body.no_sessions && 
		req.body.session_hrs && 
		req.body.locations &&
		req.body.term &&
		req.body.instructors
	) {

		Course.updateCourse(
			req.body.core,
			req.body.no_sessions,
			req.body.session_hrs, 
			req.body.locations,
			req.body.term,
			req.body.instructors,
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

// defining route for deleting a course
router.post('/Delete', function(req, res, next) {
	if (req.body.id && req.body.schedule_id) {

		Course.deleteCourse(
			req.body.id,
			function(err, count) {
				if (err) {
					err.success = false;
					res.json(err);
				} else {
					// update schedule
					Schedule.updateScheduleCourses(
						req.body.schedule_id,
						req.body.id,
						-1,
						function(update_err, update_count) {
							if (update_err) {
								update_err.success = false;
								res.json(update_err);
							} else {
								count.success = true;
								res.json(count);
							}
						});
				}
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

module.exports = router;