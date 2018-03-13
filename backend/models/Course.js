var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "courses";
var COLUMN_ID = "id";
var COLUMN_SCHEDULE_ID = "schedule_id";
var COLUMN_CORE = "core";
var COLUMN_NO_SESSIONS = "no_sessions";
var COLUMN_SESSION_HRS = "session_hrs";
var COLUMN_LOCATIONS = "locations";
var COLUMN_TERM = "term";
var COLUMN_INSTRUCTORS = "instructors";
var COLUMN_COURSE_NO = "course_no";
var COLUMN_COURSE_NAME = "course_name";

var Course = {
	getAllCourses:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	},

	getCourseById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID +
						" =?", [id], callback);
	},

	getCourseBySchedule:function(schedule_id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_SCHEDULE_ID +
						" =?", [schedule_id], callback);
	},

	createCourse:function(
		schedule_id, 
		core, 
		no_sessions,
		session_hrs, 
		locations, 
		term, 
		instructors, 
		course_no,
		course_name,
		callback
	){
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" + 
			COLUMN_SCHEDULE_ID + "`,`" +
			COLUMN_CORE + "`,`" +
			COLUMN_NO_SESSIONS + "`,`" +
			COLUMN_SESSION_HRS + "`,`" +
			COLUMN_LOCATIONS + "`,`" +
			COLUMN_TERM + "`,`" +
			COLUMN_INSTRUCTORS + "`,`" +
			COLUMN_COURSE_NO + "`,`" +
			COLUMN_COURSE_NAME + "`)" +  
			" VALUES(?,?,?,?,?,?,?,?,?)", 
			[schedule_id,
			 core,
			 no_sessions,
			 session_hrs, 
			 locations, 
			 term, 
			 instructors, 
			 course_no, 
			 course_name],
			callback);
	},

	updateCourse:function(
		id, 
		core, 
		no_sessions, 
		session_hrs, 
		locations,
		term,
		instructors,
		course_no,
		course_name,
		callback
	){
		return db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_CORE +
						"` =?, `" + COLUMN_NO_SESSIONS + 
						"` =?, `" + COLUMN_SESSION_HRS +
						"` =?, `" + COLUMN_LOCATIONS +
						"` =?, `" + COLUMN_TERM + 
						"` =?, `" + COLUMN_INSTRUCTORS +
						"` =?, `" + COLUMN_COURSE_NO +
						"` =?, `" + COLUMN_COURSE_NAME +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[core, 
						no_sessions, 
						session_hrs, 
						locations, 
						term, 
						instructors, 
						course_no,
						course_name,
						id],
						callback);
	},

	deleteCourse:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	}
};

module.exports=Course;