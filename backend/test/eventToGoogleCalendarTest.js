var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('eventToGoogleCalendar()', function () {
	it('Constructive Test: ' +
		'Output format should match specs (non event)', function() {

			// Setup
			var startDate = new Date("2018-04-19");

			var input = {
		        "id": 273,
		        "schedule_id": 3,
		        "term": 7,
		        "pillar": "ISTD",
		        "course": "50.021",
		        "prof": "Subhajit Datta",
		        "prof_id": 59,
		        "cohort": 1,
		        "location": "Cohort Classroom 11",
		        "day": 1,
		        "date": null,
		        "start": 0,
		        "end": 2
		    }

		    var expected = {
		        "instructor": "Subhajit Datta",
		        "id": 59,
		        "pillar": "ISTD",
		        "schedule": [
		            {
		                "Subject": "50.021",
		                "Location": "Cohort Classroom 11",
		                "Description": "Cohort 1",
		                "Start Time": "08:30 AM",
		                "End Time": "10:00 AM",
		                "Start Date": "2018/04/23",
		                "End Date": "2018/04/23",
		                "Private": true
		            }
		        ]
		    }

		    // Assert
		    expect(util.eventToGoogleCalendar(input, startDate)).to.deep.equal(expected);
		});
});

describe('eventToGoogleCalendar()', function () {
	it('Constructive Test: ' +
		'Output format should match specs (event)', function() {

			// Setup
			var startDate = new Date("2018-04-19");

			var input = {
		        "id": 273,
		        "schedule_id": 3,
		        "term": 7,
		        "pillar": "ISTD",
		        "course": "50.021",
		        "prof": "Subhajit Datta",
		        "prof_id": 59,
		        "cohort": 1,
		        "location": "Cohort Classroom 11",
		        "day": 1,
		        "date": '2018-04-19T16:00:00.000Z',
		        "start": 0,
		        "end": 2
		    }

		    var expected = {
		        "instructor": "Subhajit Datta",
		        "id": 59,
		        "pillar": "ISTD",
		        "schedule": [
		            {
		                "Subject": "50.021",
		                "Location": "Cohort Classroom 11",
		                "Description": "Cohort 1",
		                "Start Time": "08:30 AM",
		                "End Time": "10:00 AM",
		                "Start Date": "2018/04/20",
		                "End Date": "2018/04/20",
		                "Private": true
		            }
		        ]
		    }

		    // Assert
		    expect(util.eventToGoogleCalendar(input, startDate)).to.deep.equal(expected);
		});
});