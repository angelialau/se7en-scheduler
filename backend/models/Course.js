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
var COLUMN_SESSIONS_HRS = "sessions_hrs";
var COLUMN_CLASS_TYPES = "class_types";
var COLUMN_INSTRUCTORS = "instructors";
var COLUMN_INSTRUCTOR_IDS = "instructor_ids";
var COLUMN_SPLIT = "split";
var COLUMN_VENUE_PREF = "venue_types";

var Course = {
	createStructure:{
		schedule_id:null,
		term:null,
		course_no:null,
		course_name:null,
		core:null,
		no_classes:null,
		class_size:null,
		no_sessions:null,
		sessions_hrs:null,
		class_types:null,
		instructors:null,
		instructor_ids:null,
		split:null,
		venue_types:null
 	},

 	updateStructure:{
		id:null,
		term:null,
		course_no:null,
		course_name:null,
		core:null,
		no_classes:null,
		class_size:null,
		no_sessions:null,
		sessions_hrs:null,
		class_types:null,
		instructors:null,
		instructor_ids:null,
		split:null,
		venue_types:null
 	},

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

	createCourse:function(data, callback) {
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
			COLUMN_SESSIONS_HRS + "`,`" +
			COLUMN_CLASS_TYPES + "`,`" +
			COLUMN_INSTRUCTORS + "`,`" +
			COLUMN_INSTRUCTOR_IDS + "`,`" +
			COLUMN_SPLIT + "`,`" +
			COLUMN_VENUE_PREF + "`)" +  
			" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
			[data.schedule_id,
			 data.term,
			 data.course_no,
			 data.course_name,
			 data.core,
			 data.no_classes,
			 data.class_size,
			 data.no_sessions,
			 data.sessions_hrs, 
			 data.class_types,  
			 data.instructors, 
			 data.instructor_ids,
			 data.split,
			 data.venue_types],
			 callback);
	},

	updateCourse:function(data, callback) {
		return db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_TERM +
						"` =?, `" + COLUMN_COURSE_NO +
						"` =?, `" + COLUMN_COURSE_NAME +
						"` =?, `" + COLUMN_CORE +
						"` =?, `" + COLUMN_NO_CLASSES +
						"` =?, `" + COLUMN_CLASS_SIZE +
						"` =?, `" + COLUMN_NO_SESSIONS + 
						"` =?, `" + COLUMN_SESSIONS_HRS +
						"` =?, `" + COLUMN_CLASS_TYPES +
						"` =?, `" + COLUMN_INSTRUCTORS +
						"` =?, `" + COLUMN_INSTRUCTOR_IDS +
						"` =?, `" + COLUMN_SPLIT +
						"` =?, `" + COLUMN_VENUE_PREF +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[data.term,
						 data.course_no,
						 data.course_name,
						 data.core,
						 data.no_classes,
						 data.class_size,
						 data.no_sessions,
						 data.sessions_hrs, 
						 data.class_types,  
						 data.instructors, 
						 data.instructor_ids,
						 data.split,
						 data.venue_types,
						 data.id],
						 callback);
	},

	deleteCourse:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	},

	// converts a course to JSON format required for scheduling algorithm
	rowToJSON:function(row) {
		var sessions = [];
		var class_types = row.class_types.split(",");
		var timings = row.sessions_hrs.split(",");
		var instructors = row.instructors.split("|");
		var instructor_ids = row.instructor_ids.split("|");
		var split = row.split.split(",");
		var venue_types = row.venue_types.split(",");

		// adding data we need in correct format
		for (var i = 0; i < row.no_sessions; i++) {
			sessions[i] = {};
			sessions[i].class_type = class_types[i];
			sessions[i].time = timings[i];
			sessions[i].instructors = instructors[i].split(",");
			sessions[i].instructor_ids = instructor_ids[i].split(",");
			sessions[i].split = split[i];
			sessions[i].preference = venue_types[i];
		}

		row.sessions = sessions;
		// removing data that we don't need anymore
		delete row.id;
		delete row.schedule_id; 
		delete row.sessions_hrs;
		delete row.split;
		delete row.class_types;
		delete row.instructors;
		delete row.instructor_ids;
		delete row.venue_types;

		return row;
	}
};

module.exports=Course;