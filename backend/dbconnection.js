var mysql=require('mysql');
var connection=mysql.createConnection({
 
	host:'devostrum.no-ip.info',
	user:'rayson',
	password:'rayson',
	database:'test'
 
});
 
connection.connect(function(err) {
	if (err) throw err
	console.log('DB is now connected...')
})