var express = require("express");
var User = require("../models/User");
var encrypt = require("../utils/encrypt");
var utils = require("../utils/utilities");
var router = express.Router();

// Defining get User by employee id route
router.get('/:employee_id(\\d+)', function(req, res, next) {
	if (req.params.employee_id) {
		User.getUserByEmployeeId(req.params.employee_id, function(err, rows) {
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

// Defining get all users route
router.get('/', function(req, res, next) {
	User.getAllUsers(function(err, rows) {
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
})

// Defining create User route
router.post('/', function(req, res, next) {
	if (req.body.name && 
		req.body.email && 
		req.body.phone && 
		req.body.employee_id &&
		req.body.password &&
		req.body.admin) {

		var salt = encrypt.genRanString(13);
		var passwordHash = encrypt.sha512(req.body.password, salt);

		User.createUser(
			req.body.name, 
			req.body.email,
			req.body.phone,
			req.body.employee_id,
			passwordHash,
			salt,
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
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// Defining login route
router.post('/Login', function(req, res, next) {
	if (req.body.employee_id) {
		User.getUserByEmployeeId(req.body.employee_id, function(err, rows) {
			if (err) {
				// Cannot retrieve a row with employee id
				res.json(err);
			} else {
				// Check if password matches
				var passwordHash = encrypt.sha512(req.body.password, rows[0].salt);
				if (passwordHash !== rows[0].passwordHash) {
					res.json({"message":"wrong password"});
				} else {
					res.json(rows[0]);
				}
			}
		});
	} else {
		res.json({"message":"post params empty"});
	}
});

module.exports = router;