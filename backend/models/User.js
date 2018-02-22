var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "users";
var COLUMN_ID = "id";
var COLUMN_NAME = "name";
var COLUMN_EMAIL = "email";
var COLUMN_PHONE = "phone";
var COLUMN_EMPLOYEE_ID = "employee_id";
var COLUMN_PASSWORD_HASH = "passwordHash";
var COLUMN_SALT = "salt";
var COLUMN_ADMIN = "admin";

var User = {
	getAllUsers:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	},

	getUserByEmployeeId:function(employee_id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_EMPLOYEE_ID +
						" =?", [employee_id], callback);
	},

	getUserById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID +
						" =?", [id], callback);
	},

	createUser:function(name, email, phone, employee_id, passwordHash, salt, admin, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" + 
			COLUMN_NAME + "`,`" +
			COLUMN_EMAIL + "`,`" +
			COLUMN_PHONE + "`,`" + 
			COLUMN_EMPLOYEE_ID + "`,`" + 
			COLUMN_PASSWORD_HASH + "`,`" +
			COLUMN_SALT + "`,`" + 
			COLUMN_ADMIN + "`)" +  
			" VALUES(?,?,?,?,?,?,?)", 
			[name, email, phone, employee_id, passwordHash, salt, admin],
			callback)
	}
};

module.exports=User;