var fecha = require("fecha");

var utilities = {
	// checked if an json object has no keys
	isEmptyObject:function(obj) {
		return !Object.keys(obj).length;
	},

	// checks if two json objects have the same set of keys
	compareJSONKeys:function(jsonIn, jsonCompare){
		var inKeys = Object.keys(jsonIn).sort();
  		var compareKeys = Object.keys(jsonCompare).sort();
  		return JSON.stringify(inKeys) === JSON.stringify(compareKeys);
	},

	/**
	 * common post callback sequence
	 * 
	 * returns err response is there is one
	 * else returns basic status of post request
	**/
	basicPostCallback:function(res, err, count) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			count.success = true;
			res.json(count);
		}
	},

	/**
	 * common get callback sequence
	 * 
	 * returns err response if there is one
	 *
	 * row_num = null would return all rows if no error
	 * row_num = int would return only the row with index row_num
	 */
	basicGetCallback:function(res, err, rows, row_num) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			if (!this.isEmptyObject(rows)) {
		
				if (row_num != null) {
					rows[row_num].success = true;
					res.json(rows[row_num]);
				} else {
					rows.success = true;
					res.json(rows);
				}

			} else {
				res.json({"success":false, "message":"no rows found"});
			}
		}
	},

	/**
	 * Moves date forward by one day. If hits a weekend, date moves straight
	 * to Monday
	 *
	 * Does not return anything, the input date will be modified
	 */
	incrementDate:function(date) {
		var day = date.getDay();
		if (day != 5) {
			date.setDate(date.getDate()+1);
		} else {
			date.setDate(date.getDate()+3);
		}
	},

	/**
	 * Converts an event entry, into a format that can be displayed on 
	 * the full calendar
	 *
	 * Returns a JSONObject
	 */
	eventToFullCalendar:function(event){
		var output = {};
		var details = {};
		var startTime = new Date(this.zeroTime.getTime() + event.start*(30*6*10000));
		var endTime =  new Date(this.zeroTime.getTime() + (event.end+1)*(30*6*10000));
		
		output.instructor = event.prof;
		output.id = event.id.toString();
		output.prof_id = event.prof_id == null ? null : event.prof_id.toString();
		output.pillar = event.pillar;
		output.schedule = {};

		output.schedule.title = event.course + "\n" + event.location;
		if (event.cohort != null) {
			output.schedule.title += "\n" + "Cohort " + event.cohort;
		}
		output.schedule.start = fecha.format(startTime, 'HH:mm');
		output.schedule.end = fecha.format(endTime, 'HH:mm');
		output.schedule.dow = event.day.toString();

		return output;
	},

	/**
	 * Converts an event entry, into a format that can be displayed on 
	 * the google calendar
	 *
	 * Returns a JSONObject
	 */
	eventToGoogleCalendar:function(event){
		var output = {};
		var details = {};
		var startTime = new Date(this.zeroTime.getTime() + event.start*(30*6*10000));
		var endTime =  new Date(this.zeroTime.getTime() + (event.end+1)*(30*6*10000));
		var current = new Date();

		// move current to monday
		while (current.getDay() != 1) {
			this.incrementDate(current);
		}
		
		// move current to day of event
		while (current.getDay() != event.day) {
			this.incrementDate(current);
		}

		output.instructor = event.prof;
		output.id = event.prof_id;
		output.pillar = event.pillar;
		output.schedule = [];

		details.Subject = event.course;
		details.Location = event.location;
		details.Description = "Cohort " + event.cohort;
		details["Start Time"] = fecha.format(startTime, 'hh:mm A');
		details["End Time"] = fecha.format(endTime, 'hh:mm A');
		details["Start Date"] = fecha.format(current, 'YYYY/MM/DD');
		details["End Date"] = fecha.format(current, 'YYYY/MM/DD');
		details.Private = true;

		output.schedule.push(details);
		return output;
	},

	eventToEditCalendar:function(event, startDate){
		var output = {};
		var details = {};

		// move to correct date
		console.log("start date: " + startDate.getDay());
		console.log("event day: " + event.day);
		while (startDate.getDay() !== event.day) {
			this.incrementDate(startDate);
		}

		// set time
		var startTime = new Date(startDate.getTime() + event.start*(30*6*10000));
		var endTime =  new Date(startDate.getTime() + (event.end+1)*(30*6*10000));
		
		// put to correct format
		output.instructor = event.prof;
		output.id = event.id.toString();
		output.prof_id = event.prof_id == null ? null : event.prof_id.toString();
		output.pillar = event.pillar;
		output.schedule = {};

		output.schedule.title = event.course + "\n" + event.location;
		if (event.cohort != null) {
			output.schedule.title += "\n" + "Cohort " + event.cohort;
		}

		output.schedule.start = fecha.format(startTime, 'YYYYMMDD[T]HHmm');
		output.schedule.end = fecha.format(endTime, 'YYYYMMDD[T]HHmm');

		return output;
	},

	/**
	 * List of all possible rooms within SUTD
	 */
	availableRooms:[
		"Think Tank 1",
		"Think Tank 2",
		"Think Tank 3"
		// "Think Tank 4",
		// "Think Tank 5",
		// "Think Tank 6",
		// "Think Tank 7",
		// "Think Tank 8",
		// "Think Tank 9",
		// "Think Tank 10",
		// "Think Tank 11",
		// "Think Tank 12",
		// "Think Tank 13",
		// "Think Tank 14",
		// "Think Tank 15",
		// "Think Tank 16",
		// "Think Tank 17",
		// "Think Tank 18",
		// "Think Tank 19",
		// "Think Tank 20",
		// "Think Tank 21",
		// "Think Tank 22",
		// "Think Tank 23",
		// "Think Tank 24",
		// "Think Tank 25",
		// "Think Tank 26",
		// "Cohort Classroom 1",
		// "Cohort Classroom 2",
		// "Cohort Classroom 3",
		// "Cohort Classroom 4",
		// "Cohort Classroom 5",
		// "Cohort Classroom 6",
		// "Cohort Classroom 7",
		// "Cohort Classroom 8",
		// "Cohort Classroom 9",
		// "Cohort Classroom 10",
		// "Cohort Classroom 11",
		// "Cohort Classroom 12",
		// "Cohort Classroom 13",
		// "Cohort Classroom 14",
		// "Cohort Classroom 15",
		// "Cohort Classroom 16",
		// "Lecture Theatre 1",
		// "Lecture Theatre 2",
		// "Lecture Theatre 3",
		// "Lecture Theatre 4",
		// "Lecture Theatre 5"
	],

	/**
	 * Our integer 'time' range from 0 to 19, where 0 is 8:30 am
	 * Every increment is half an hour
	 * Defining zero here for later use
	 */
	zeroTime: new Date("1995-11-03 08:30"),
	
	/**
	 * Converts normal human time to our integer time
	 * 
	 * time is a string, eg "09:00" or "12:30". Only in increments of 30mins
	 * returns an integer
	 */
	timeToInt:function(time) {
		var difference  = new Date("1995-11-03 " + time).getTime() - this.zeroTime.getTime();
		return difference/30/6/10000
	}
}

module.exports=utilities;