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
var COLUMN_DATE = "date";
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
		date:null,
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
			COLUMN_DATE + "`,`"  + 
			COLUMN_START + "`,`" +
			COLUMN_END + "`)" + 
			" VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
			[data.schedule_id,
			 data.term,
			 data.pillar,
			 data.course,
			 data.prof,
			 data.prof_id,
			 data.cohort,
			 data.location,
			 data.day,
			 data.date,
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
	},
	filterTimeSlots:function(data, schedule_id, callback) {
		var selectStatement = "SELECT * FROM " + TABLE_NAME + " WHERE ";
		var tokens = "1";
		var dayFilter = COLUMN_DAY + "=?";
		var sTimeFilter = "(" + COLUMN_START + ">=?" + " AND " + COLUMN_START + "<?)";
		var eTimeFilter = "(" + COLUMN_END + ">?" + " AND " + COLUMN_END + "<=?)";
		var scheduleFilter = COLUMN_SCHEDULE_ID + "=?";
		var params = [];

		// filter by start and end times
		if (data.sTime && data.eTime) {
			tokens = sTimeFilter + " OR " + eTimeFilter;
			params.push(data.sTime);
			params.push(data.eTime);
			params.push(data.sTime);
			params.push(data.eTime);
		} else if (data.sTime) {
			tokens = sTimeFilter;
			params.push(data.sTime);
			params.push(data.eTime);
		} else if (data.eTime) {
			tokens = eTimeFilter;
			params.push(data.sTime);
			params.push(data.eTime);
		}

		// filter by day of week
		if (data.day) {
			tokens = "(" + tokens + ") AND " + dayFilter;
			params.push(data.day);
		}

		// choose only relevant schedules
		tokens = "(" + tokens + ") AND " + scheduleFilter;
		params.push(schedule_id);

		selectStatement += tokens;
		return db.query(selectStatement, params, callback);
	}
};


module.exports=Calendar;
