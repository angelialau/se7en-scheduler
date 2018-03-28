var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "calendar";
var COLUMN_ID = "id";
var COLUMN_SCHEDULE_ID = "schedule_id";
var COLUMN_TERM = "term";
var COLUMN_PILLAR = "pillar";
var COLUMN_COURSE = "course";
var COLUMN_PROF = "prof";
var COLUMN_PROF_ID = "prof_id";
var COLUMN_COHORT = "cohort";
var COLUMN_LOCATION = "location";
var COLUMN_DAY = "day";
var COLUMN_START = "start";
var COLUMN_END = "end";

var Calendar = {
	createStructure:{
		schedule_id:null,
		term:null,
		pillar:null,
		course:null,
		prof:null,
		prof_id:null,
		cohort:null,
		location:null,
		day:null,
		start:null,
		end:null
 	},
	createEvent:function(data, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" +
			COLUMN_SCHEDULE_ID + "`,`" +
			COLUMN_TERM + "`,`" +
			COLUMN_PILLAR + "`,`" + 
			COLUMN_COURSE + "`,`" +
			COLUMN_PROF + "`,`" + 
			COLUMN_PROF_ID + "`,`" +
			COLUMN_COHORT + "`,`" +
			COLUMN_LOCATION + "`,`" +
			COLUMN_DAY + "`,`" + 
			COLUMN_START + "`,`" +
			COLUMN_END + "`)" + 
			" VALUES(?,?,?,?,?,?,?,?,?,?,?)",
			[data.schedule_id,
			 data.term,
			 data.pillar,
			 data.course,
			 data.prof,
			 data.prof_id,
			 data.cohort,
			 data.location,
			 data.day,
			 data.start,
			 data.end],
			 callback);
	},
	getEventsByPillar:function(schedule_id, pillar, callback) {
		return db.query("SELECT * FROM " + 
						TABLE_NAME + " WHERE " + 
						COLUMN_SCHEDULE_ID + "=? AND " +
						COLUMN_PILLAR + "=?",
						[schedule_id, pillar],
						callback);
	},
	getEventsByProfId:function(schedule_id, prof_id, callback) {
		return db.query("SELECT * FROM " + 
						TABLE_NAME + " WHERE " + 
						COLUMN_SCHEDULE_ID + "=? AND " +
						COLUMN_PROF_ID + "=?",
						[schedule_id, prof_id],
						callback);
	},
	getEventsByScheduleId:function(schedule_id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME +
						" WHERE " + COLUMN_SCHEDULE_ID + "=?",
						[schedule_id],
						callback);
	}
};


module.exports=Calendar;
