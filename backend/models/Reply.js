var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "replies";
var COLUMN_ID = "id";
var COLUMN_TITLE = "title";
var COLUMN_CONTENT = "content";
var COLUMN_DATE = "date";
var COLUMN_INSTRUCTOR = "instructor";
var COLUMN_INSTRUCTOR_ID = "instructorId";
var COLUMN_SCHEDULE_ID = "scheduleId";
var COLUMN_SENDER = "sender";
var COLUMN_SENDER_ID = "senderId";

var Reply = {
	createStructure:{
		title:null,
		content:null,
		instructor:null,
		instructorId:null,
		scheduleId:null,
		sender:null,
		senderId:null
	},
	createReply:function(data, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" +
			COLUMN_TITLE + "`,`" +
			COLUMN_CONTENT + "`,`" +
			COLUMN_INSTRUCTOR + "`,`" + 
			COLUMN_INSTRUCTOR_ID + "`,`" +
			COLUMN_SENDER + "`,`" +
			COLUMN_SENDER_ID + "`,`" +
			COLUMN_SCHEDULE_ID + "`)" + 
			" VALUES(?,?,?,?,?,?,?)",
			[data.title,
			 data.content,
			 data.instructor,
			 data.instructorId,
			 data.sender,
			 data.senderId,
			 data.scheduleId],
			 callback);
	},
	getReplyById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE " + COLUMN_ID + "=?", 
						[id],
						callback);
	},
	getRepliesByInstructorId:function(instructorId, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE " + COLUMN_INSTRUCTOR_ID + "=?", 
						[instructorId],
						callback);
	},
	getReplies:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + 
						" WHERE 1",[],callback);
	},
	deleteReply:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID +
						"` =?", [id], callback);
	}
};

module.exports=Reply;