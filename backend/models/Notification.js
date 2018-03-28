var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "notifications";
var COLUMN_ID = "id";
var COLUMN_TITLE = "title";
var COLUMN_CONTENT = "content";
var COLUMN_DATE = "date";
var COLUMN_SENDER = "sender";
var COLUMN_SENDER_ID = "senderId";

var Notification = {
	createNotification:function(title, content, sender, senderId, callback) {
		return db.query("INSERT INTO " +
			TABLE_NAME + "(`" + 
			COLUMN_TITLE + "`,`" +
			COLUMN_CONTENT + "`,`" +
			COLUMN_SENDER + "`,`" +
			COLUMN_SENDER_ID + "`)" +
			" VALUES(?,?,?,?)",
			[title, content, sender, senderId],
			callback);
	},
	getAllNotification:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	},
	deleteNotification:function(id, callback) {
		return db.query("DELETE FROM " + TABLE_NAME + " WHERE `" + COLUMN_ID + 
						"` =?", [id], callback);
	}
};

module.exports=Notification;
