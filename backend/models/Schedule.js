var db = require("../utils/dbconnection"); //reference to db connection
var utils = require("../utils/utilities"); //reference to useful functions

var TABLE_NAME = "schedules";
var COLUMN_ID = "id";
var COLUMN_COURSES = "courses";
var COLUMN_YEAR = "year";
var COLUMN_TRIMESTER = "trimester";

var Schedule = {
	getAllSchedules:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	},

	getScheduleById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID +
						" =?", [id], callback);
	},

	createSchedule:function(year, trimester, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" + 
			COLUMN_YEAR + "`,`" +
			COLUMN_TRIMESTER + "`)" +  
			" VALUES(?,?)", 
			[year, trimester],
			callback);
	},

	updateSchedule:function(id, courses, year, trimester, callback) {
		return db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_COURSES +
						"` =?, `" + COLUMN_YEAR + 
						"` =?, `" + COLUMN_TRIMESTER +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[courses, year, trimester, id],
						callback);
	},

	updateScheduleCourses:function(id, course, operation, callback) {
		this.getScheduleById(id, function(err, rows) {
			if (err == null) {
				if (!utils.isEmptyObject(rows)) {
					var courses = rows[0].courses;
					if (courses == null) {
						courses = course;
					} else {
						if (operation > 0) {
							// positive operation means adding a course
							courses = courses + "," + course;
						} else {
							// negative or zero operation means removing a course
							var array = courses.split(',')
							var index = array.indexOf(course);
							array.splice(index, 1);
							courses = array.join();
						}
						
					}
					return db.query(
						"UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_COURSES +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[courses, id],
						callback);
				} else {
					callback({"success": false, "message": "Schedule not found"}, 0);
				}
			}
		})
	},

	deleteSchedule:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	}
};

module.exports=Schedule;