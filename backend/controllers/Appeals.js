var express = require("express");
var Appeal = require("../models/Appeal");
var utils = require("../utils/utilities");
var router = express.Router();

// defining create appeal route
router.post('/', function(req, res, next) {
	// check if necessary params are available
	if (utils.compareJSONKeys(req.body, Appeal.createStructure)) {
		// create appeal
		Appeal.createAppeal(req.body, function(err, count) {
			utils.basicPostCallback(res, err, count);
		})
	} else {
		console.log(req.body);
		console.log(Appeal.createStructure);
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining get appeal by id route
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Appeal.getAppealById(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, 0);
		});
	} 
});

// defining get all appeals route
router.get('/', function(req, res, next) {
	// if no id given, return all rows
	Appeal.getAppeals(function(err, rows) {
		utils.basicGetCallback(res, err, rows, null);
	});
});

// defining get appeals by instructor id route
router.get('/Instructor/:instructorId(\\d+)/:scheduleId(\\d+)', function(req, res, next) {
	if (req.params.instructorId && req.params.scheduleId) {
		Appeal.getAppealByInstructorId(req.params.instructorId, req.params.scheduleId, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining get appeals by pillar route
router.get('/Pillar/:pillar(\\D+)/:scheduleId(\\d+)', function(req, res, next) {
	if (req.params.pillar && req.params.scheduleId) {
		Appeal.getAppealsByPillar(req.params.pillar, req.params.scheduleId, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining delete appeal route
router.post('/Delete', function(req, res, next) {
	if (req.body.id) {
		Appeal.deleteAppeal(req.body.id, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	}
});

module.exports = router;