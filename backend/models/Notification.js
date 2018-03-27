var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "notifications";
var COLUMN_ID = "id";
var COLUMN_TITLE = "title";
var COLUMN_CONTENT = "content";
var COLUMN_DATE = "date";
var COLUMN_SENDER = "sender";

var Notification = {
	createNotification:function(title, content, sender, callback) {
		return db.query("INSERT INTO " +
			TABLE_NAME + "(`" + 
			COLUMN_TITLE + "`,`" +
			COLUMN_CONTENT + "`,`" +
			COLUMN_SENDER + "`)" +
			" VALUES(?,?,?)",
			[title, content, sender],
			callback);
	},
	getAllNotification:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	}
}

