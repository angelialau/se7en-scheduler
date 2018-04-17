var express = require("express");
var Calendar = require("../models/Calendar");
var utils = require("../utils/utilities");
var fecha = require("fecha");
var router = express.Router();

// defining create event route
router.post('/', function(req, res, next) {
	// Check if necessary keys are there
	if (utils.compareJSONKeys(req.body, Calendar.createStructure)) {

		if (req.body.date !== "null") {
			// Change date to MySQL date time format
			req.body.date = fecha.format(new Date(req.body.date), 'YYYY-MM-DD HH:mm:ss');
		}
		
		// change null string to null keyword
		for (var key in req.body) {
			if (req.body[key] === "null") {
				req.body[key] = null;
			}
		}

		// check if day is proper input
		if (req.body.day < 1 || req.body.day > 5 || !Number.isInteger(req.body.day)) {
			if (req.body.date) {
				req.body.day = new Date(req.body.date).getDay();
			}
			else {
				res.json({"success":false, "message":"need at least date or day to be provided"});
			}
		}

		// Create event
		Calendar.createEvent(req.body, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining get event by schedule id route
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Calendar.getEventsByScheduleId(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining get event by prof_id route
router.get('/Prof/:id(\\d+)/:prof_id(\\d+)', function(req, res, next) {
	if (req.params.id && req.params.prof_id) {
		Calendar.getEventsByProfId(req.params.id, req.params.prof_id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining get event by pillar route
router.get('/Pillar/:id(\\d+)/:pillar([A-Z]+)', function(req, res, next) {
	if (req.params.id && req.params.pillar) {
		Calendar.getEventsByPillar(req.params.id, req.params.pillar, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining get non-course events route
router.get('/Events/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Calendar.getNonCourseEvents(req.params.id, function(err, rows){
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining delete event route
router.post('/Delete/', function(req, res, next) {
	if (req.body.id) {
		Calendar.deleteEvent(req.body.id, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining filter route
router.get('/Filter/:schedule_id(\\d+)/?:day(\\d)?/?:sDate(\\d{4}-\\d{2}-\\d{2})?/?:eDate(\\d{4}-\\d{2}-\\d{2})?/?:sTime(\\d{1,2})?/?:eTime(\\d{1,2})?', function(req, res, next) {
	Calendar.filterTimeSlots(req.params, req.params.schedule_id, function(err, rows) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			var todaysDate = new Date();
			var todaysDay = todaysDate.getDay()%6;
			var num_weeks = 3;
			var startTime = 0;
			var endTime = 19;
			var output = {};

			if (req.params.sTime) {
				startTime = parseInt(req.params.sTime);
			}

			if (req.params.eTime) {
				endTime = parseInt(req.params.eTime);
			}
		
			utils.availableRooms.forEach(function(room){

				// create five weeks of possible timings
				var available = []
				for (var week = 0; week < num_weeks; week++) {
					// creating a week of possible timings
					var weekdays = [];
					for (var day = 0; day < 5; day++) {
						var hours = [];
						for (var hour = startTime; hour < endTime+1; hour++) {
							hours.push(hour);
						}
						weekdays.push(hours);
					}
					available.push(weekdays);
				}

				var rowsWithDates = [];
				// remove unavailable timings
				for (var i = 0; i < rows.length; i++) {
					// only care if it concerns current room and is weekly event
					if (rows[i].location === room && rows[i].date === 'null') {
						var j = rows[i].start
						while (j < rows[i].end) {
							// go through week by week
							for (var week = 0; week < num_weeks; week++) {
								var index = available[week][rows[i].day-1].indexOf(j);	
								if (index != -1) {
									available[week][rows[i].day-1].splice(index, 1);
								}
							}	
							j++;
						}
					} else if (rows[i].location === room && rows[i].date !== 'null') {
						// save rows with dates for faster loop later
						rowsWithDates.push(rows[i]);
					}
				}

				// remove based on today's day
				if (todaysDay < 5) {
					available[0].splice(0,todaysDay);
				}
				
				// add dates
				var current = new Date();
				var roomAvailability = {}
				for (var week = 0; week < num_weeks; week++) {
					available[week].forEach(function(day) {
						utils.incrementDate(current);
						roomAvailability[current.toDateString()] = day;
					});
				}

				// remove unavailable timings based on dates
				rowsWithDates.forEach(function(row) {
					var dateString = new Date(row.date).toDateString();
					var tempAvailability = roomAvailability[dateString];

					if (tempAvailability == null) {
						return;
					}

					var j = row.start
					while (j < row.end) {
						var index = tempAvailability.indexOf(j);	
						if (index != -1) {
							tempAvailability.splice(index, 1);
						}
						j++;
					}
					roomAvailability[dateString] = tempAvailability;
				});

				output[room] = roomAvailability;
			});

			res.json(output);
		}
	});
});

// Get calendar entries in full calendar json format
router.get('/FullCalendar/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Calendar.getEventsByScheduleId(req.params.id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				var formatted;
				var output = {}
				rows.forEach(function(entry) {
					formatted = utils.eventToFullCalendar(entry);
				});
				res.json(Object.values(output));
			}
		});
	}
});

// Get calendar entries in google calendar json format
router.get('/GoogleCalendar/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Calendar.getEventsByScheduleId(req.params.id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				var formatted;
				var output = {}
				rows.forEach(function(entry) {
					formatted = utils.eventToGoogleCalendar(entry);
					if (output[formatted.id]) {
						output[formatted.id].schedule.push(formatted.schedule[0]);
					} else {
						output[formatted.id] = formatted;
					}
				});
				res.json(Object.values(output));
			}
		});
	}
});

// Get calendar entries in editable json format
router.get('EditCalendar/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Calendar.getEventsByScheduleId(req.params.id, function(err, rows) {
			if (err) {
				err.success = false;
				res.json(err);
			} else {
				var formatted;
				var output = {}
				rows.forEach(function(entry) {
					formatted = utils.eventToEditCalendar(entry);
				});
				res.json(Object.values(output));
			}
		});
	} 
});

// defining update calendar entry endpoint
router.post('/Update', function(req, res, next) {
	if (utils.compareJSONKeys(req.body, Calendar.updateNoDateStructure)) {
		// change time format
		req.body.start = utils.timeToInt(req.body.start);
		req.body.end = utils.timeToInt(req.body.end);

		// update
		Calendar.updateEventNoDate(req.body, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

module.exports = router;