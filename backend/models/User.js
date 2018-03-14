var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "users";
var COLUMN_ID = "id";
var COLUMN_NAME = "name";
var COLUMN_EMAIL = "email";
var COLUMN_PHONE = "phone";
var COLUMN_PASSWORD_HASH = "passwordHash";
var COLUMN_SALT = "salt";
var COLUMN_ADMIN = "pillar";
var COLUMN_SCHEDULES = "schedules";
var COLUMN_COURSES = "courses";

var User = {
	getAllUsers:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	},

	getUserByEmail:function(email, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_EMAIL +
						" =?", [email], callback);
	},

	getUserById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID +
						" =?", [id], callback);
	},

	getUsersByIDs:function(ids, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID + 
						" IN " + ids, [], callback);
	},

	createUser:function(name, email, phone, passwordHash, salt, admin, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" + 
			COLUMN_NAME + "`,`" +
			COLUMN_EMAIL + "`,`" +
			COLUMN_PHONE + "`,`" + 
			COLUMN_PASSWORD_HASH + "`,`" +
			COLUMN_SALT + "`,`" + 
			COLUMN_ADMIN + "`)" +  
			" VALUES(?,?,?,?,?,?)", 
			[name, email, phone, passwordHash, salt, admin],
			callback);
	},

	updateUserSchedule:function(instructors, schedule_id, course_id, callback) {
		var uniqueInstructors = new Set(instructors.split(","));
		var ids = "(" + [...uniqueInstructors].toString() + ")";
		this.getUsersByIDs(ids, function(err, rows) {
			for (index in rows) {
				var row = rows[index];
				var schedules = row.schedules.concat(",",schedule_id);
				var courses = row.courses.concat(",",course_id);
				db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_SCHEDULES +
						"` =?, `" + COLUMN_COURSES +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[schedules, courses, row.id],
						function(row_err, row_rows){
							if (row_err) {
								console.log(row_err);
							}
						});
			}
			callback(err, rows);
		});
	}
};

module.exports=User;