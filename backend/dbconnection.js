var mysql=require('mysql');
var connection=mysql.createConnection({
 
	host:'devostrum.no-ip.info',
	user:'rayson',
	password:'rayson',
	database:'rayson'
 
});
 
connection.connect(function(err) {
	if (err) throw err
	console.log('You are now connected...')
})