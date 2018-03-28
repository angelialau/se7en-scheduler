var express = require("express");
var Notification = require("../models/Notification");
var utils = require("../utils/utilities");
var router = express.Router();

// Defining create notifications route
router.post('/', function(req, res, next) {
	if (req.body.title &&
		req.body.content &&
		req.body.sender) {
		Notification.createNotification(
			req.body.title,
			req.body.content,
			req.body.sender,
			function(err, count) {
				utils.basicPostCallback(res, err, count);
			});
	} else {
		res.json({'success':false, 'message':'incomplete params'});
	}
});

// Defining get all notifications route
router.get('/', function(req, res, next) {
	Notification.getAllNotification(function(err, rows){
		utils.basicGetCallback(res, err, rows, null);
	});
});

// Defining delete notification route
router.post('/Delete', function(req, res, next) {
	if (req.body.id) {
		Notification.deleteNotification(req.body.id, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	} else {
		res.json({'success':false, 'message':'incomplete params'});
	}
});

module.exports = router;