var express = require("express");
var User = require("../models/User");
var router = express.Router();

// Defining get User route
router.get('/:id?:employee_id?', function(req, res, next) {
	if (req.params.id) {
		User.getUserById(req.params.id, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else if (req.params.employee_id) {
		console.log(req.params.employee_id);
		User.getUserByEmployeeId(req.params.employee_id, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else {
		User.getAllUsers(function(err, rows) {
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
	if (req.body.name) {
		User.createUser(
			req.body.name, 
			req.body.email,
			req.body.phone,
			req.body.employee_id,
			req.body.passwordHash,
			req.body.salt,
			req.body.admin,
			function(err, count) {
				if (err) {
					res.json(err);
				} else {
					res.json(count);
				}
			}
		);
	} else {
		res.json({"message":"post params empty"});
	}
});

module.exports = router;