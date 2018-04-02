var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "appeals";
var COLUMN_ID = "id";
var COLUMN_TITLE = "title";
var COLUMN_CONTENT = "content";
var COLUMN_DATE = "date";
var COLUMN_INSTRUCTOR = "instructor";
var COLUMN_INSTRUCTOR_ID = "instructorId";
var COLUMN_PILLAR = "pillar";

var Appeal = {
	createStructure:{
		title:null,
		content:null,
		instructor:null,
		instructorId:null,
		pillar:null
	},
	createAppeal:function(data, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" +
			COLUMN_TITLE + "`,`" +
			COLUMN_CONTENT + "`,`" +
			COLUMN_INSTRUCTOR + "`,`" + 
			COLUMN_INSTRUCTOR_ID + "`,`" +
			COLUMN_PILLAR + "`)`" +
			" VALUES(?,?,?,?,?)",
			[data.title,
			 data.content,
			 data.instructor,
			 data.instructorId,
			 data.pillar],
			 callback);
	},
	getAppealById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE " + COLUMN_ID + "=?", 
						[id],
						callback);
	},
	getAppealByInstructorId:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE " + COLUMN_INSTRUCTOR_ID "=?", 
						[id],
						callback);
	},
	getAppeals:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE 1",[],callback);
	},
	getAppealsByPillar:function(pillar, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE " + COLUMN_PILLAR + "=?",
						[pillar],
						callback);
	},
	deleteAppeal:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	}
};

module.exports=Appeal;