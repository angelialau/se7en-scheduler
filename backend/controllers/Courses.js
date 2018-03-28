var express = require("express");
var Schedule = require("../models/Schedule");
var Course = require("../models/Course");
var User = require("../models/User");
var utils = require("../utils/utilities");
var router = express.Router();

// defining route for get all courses
router.get('/', function(req, res, next) {
	Course.getAllCourses(function(err, rows) {
		utils.basicGetCallback(res, err, rows, null);
	});
});

// defining route for getting one course by id
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Course.getCourseById(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, 0);
		});
	} 
});

// defining route for getting courses with schedule_id
router.get('/BySchedule/:schedule_id(\\d+)', function(req, res, next) {
	if (req.params.schedule_id) {
		Course.getCourseBySchedule(req.params.schedule_id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	} 
});

// defining route for creating a course
// TODO: the different sql calls should be grouped into one function
router.post('/', function(req, res, next) {
	if (utils.compareJSONKeys(req.body, Course.createStructure)) {
		// Create the course
		Course.createCourse(
			req.body,
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
								update_err.success = false;
								res.json(update_err);
							} else {
								// update user
								User.addUserSchedule(
									req.body.instructors, 
									req.body.schedule_id, 
									create_count.insertId, 
									function(user_err, user_count) {
										utils.basicPostCallback(res, user_err, create_count);
									});
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
	if (utils.compareJSONKeys(req.body, Course.updateStructure)) {

		Course.updateCourse(
			req.body,
			function(err, count) {
				utils.basicPostCallback(res, err, count);
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining route for deleting a course
router.post('/Delete', function(req, res, next) {
	if (req.body.id && 
		req.body.schedule_id) {

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
								// get instructors involved
								Courses.getCourseById(req.body.id, function(get_err, get_rows) {
									if (get_err) {
										get_err.success = false;
										res.json(get_err);
									} else {
										// update instructors
										User.deleteUserCourse(
											req.body.instructors,
											req.body.id,
											function(user_err, user_count) {
												utils.basicPostCallback(res, user_err, count);
											});
									}
								});
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