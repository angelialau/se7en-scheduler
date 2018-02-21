var express = require("express");
var User = require("../models/User");
var router = express.Router();

// Defining get User route
router.get('/', function(req, res, next) {
	if (req.params.id) {
		User.getUserById(req.params.id, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else if (req.params.employee_id) {
		User.getUserByEmployeeId(req.params.id, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else {
		User.getAllUsers(req.params.id, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	}
});

// Defining create User route
router.post('/', function(req, res, next) {
	User.createUser(req.body, function(err, count) {
		if (err) {
			res.json(err);
		} else {
			res.json({"success":true});
		}
	});
});

module.exports = router;