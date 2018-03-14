var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "courses";
var COLUMN_ID = "id";
var COLUMN_SCHEDULE_ID = "schedule_id";
var COLUMN_TERM = "term";
var COLUMN_COURSE_NO = "course_no";
var COLUMN_COURSE_NAME = "course_name";
var COLUMN_CORE = "core";
var COLUMN_NO_CLASSES = "no_classes";
var COLUMN_CLASS_SIZE = "class_size";
var COLUMN_NO_SESSIONS = "no_sessions";
var COLUMN_SESSION_HRS = "session_hrs";
var COLUMN_LOCATIONS = "locations";
var COLUMN_INSTRUCTORS = "instructors";
var COLUMN_SPLIT = "split";


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
		term,
		course_no,
		course_name,
		core, 
		no_classes,
		class_size,
		no_sessions,
		session_hrs, 
		locations, 
		instructors, 
		split,
		callback
	){
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" + 
			COLUMN_SCHEDULE_ID + "`,`" +
			COLUMN_TERM + "`,`" + 
			COLUMN_COURSE_NO + "`,`" +
			COLUMN_COURSE_NAME + "`,`" +
			COLUMN_CORE + "`,`" +
			COLUMN_NO_CLASSES + "`,`" +
			COLUMN_CLASS_SIZE + "`,`" +
			COLUMN_NO_SESSIONS + "`,`" +
			COLUMN_SESSION_HRS + "`,`" +
			COLUMN_LOCATIONS + "`,`" +
			COLUMN_INSTRUCTORS + "`,`" +
			COLUMN_SPLIT + "`)" +  
			" VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", 
			[schedule_id,
			 term,
			 course_no,
			 course_name,
			 core,
			 no_classes,
			 class_size,
			 no_sessions,
			 session_hrs, 
			 locations,  
			 instructors, 
			 split],
			callback);
	},

	updateCourse:function(
		id, 
		term,
		course_no,
		course_name,
		core, 
		no_classes,
		class_size,
		no_sessions,
		session_hrs, 
		locations, 
		instructors, 
		split,
		callback
	){
		return db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_TERM +
						"` =?, `" + COLUMN_COURSE_NO +
						"` =?, `" + COLUMN_COURSE_NAME +
						"` =?, `" + COLUMN_CORE +
						"` =?, `" + COLUMN_NO_CLASSES +
						"` =?, `" + COLUMN_CLASS_SIZE +
						"` =?, `" + COLUMN_NO_SESSIONS + 
						"` =?, `" + COLUMN_SESSION_HRS +
						"` =?, `" + COLUMN_LOCATIONS +
						"` =?, `" + COLUMN_INSTRUCTORS +
						"` =?, `" + COLUMN_SPLIT +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[term,
						 course_no,
						 course_name,
						 core,
						 no_classes,
						 class_size,
						 no_sessions,
						 session_hrs, 
						 locations,  
						 instructors, 
						 split,
						 id],
						callback);
	},

	deleteCourse:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	},

	// TODO 
	getCoursesForAlgo:function(schedule_id, callback) {
		
	}
};

module.exports=Course;