var mysql=require('mysql');
var connection=mysql.createPool({
 
	host:'devostrum.no-ip.info',
	user:'rayson',
	password:'rayson',
	database:'test'
 
});
 
module.exports = connection;