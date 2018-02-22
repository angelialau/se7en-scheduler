var db = require("../utils/dbconnection"); //reference to db connection

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

	deleteSchedule:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	}
};

module.exports=Schedule;