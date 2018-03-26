var express = require("express");
var User = require("../models/User");
var encrypt = require("../utils/encrypt");
var utils = require("../utils/utilities");
var router = express.Router();

// Defining get User by id route
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		User.getUserById(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, 0);
		});
	} 
});

// Defining get all users route
router.get('/', function(req, res, next) {
	User.getAllUsers(function(err, rows) {
		utils.basicGetCallback(res, err, rows, null);
	});
});

// Defining get users by pillar route
router.get('/Pillar/:pillar(\\w+)', function(req, res, next) {
	if (req.params.pillar) {
		User.getUsersByPillar(req.params.pillar, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		})
	}
});

// Defining get all instructors route
router.get('/Instructors', function(req, res, next) {
	User.getInstructors(function(err, rows) {
		utils.basicGetCallback(res, err, rows, null);
	})
});

// Defining create User route
router.post('/', function(req, res, next) {
	if (req.body.name && 
		req.body.email && 
		req.body.phone && 
		req.body.password &&
		req.body.pillar) {

		var salt = encrypt.genRanString(13);
		var passwordHash = encrypt.sha512(req.body.password, salt);

		User.createUser(
			req.body.name, 
			req.body.email,
			req.body.phone,
			passwordHash,
			salt,
			req.body.pillar,
			function(err, count) {
				utils.basicPostCallback(res, err, count);
			}
		);
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// Defining change password route
router.post('/ChangePassword', function(req, res, next) {
	// check params are in
	if (req.body.id &&
		req.body.oldPassword &&
		req.body.newPassword) {

		// find user
		User.getUserById(req.body.id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				if (!utils.isEmptyObject(rows)) {
					// Check if old password matches
					var passwordHash = encrypt.sha512(req.body.oldPassword, rows[0].salt);
					if (passwordHash !== rows[0].passwordHash) {
						res.json({"success":false, "message":"wrong password"});

					} else {
						// save new password with new salt
						var salt = encrypt.genRanString(13);
						passwordHash = encrypt.sha512(req.body.newPassword, salt);
						User.updatePassword(req.body.id, passwordHash, salt, function(update_err, update_count) {
							utils.basicPostCallback(res, update_err, update_count);
						});
					}
				} else {
					// If unable to retrieve any row
					res.json({"success":false, "message":"unable to find user"});
				}
			}
		})

	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
})

// Defining login route
router.post('/Login', function(req, res, next) {
	// Check if params are in
	if (req.body.email && req.body.password) {
		User.getUserByEmail(req.body.email, function(err, rows) {
			if (err) {
				// Cannot retrieve a row with employee id
				err.success = false;
				res.json(err);
			} else {
				if (!utils.isEmptyObject(rows)) {
					// Check if password matches
					var passwordHash = encrypt.sha512(req.body.password, rows[0].salt);
					if (passwordHash !== rows[0].passwordHash) {
						res.json({"success":false, "message":"wrong password"});

					} else {
						// Return success along with user details
						rows[0].success = true;
						res.json(rows[0]);
					}
				} else {
					// If unable to retrieve any row
					res.json({"success":false, "message":"unable to find user"});
				}
			}
		});
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

module.exports = router;