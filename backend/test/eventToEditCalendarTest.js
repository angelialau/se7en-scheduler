var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('eventToEditCalendar()', function () {
	it('Constructive Test: ' +
		'Output format should match specs (non events)', function() {

			// Setup
			var startDate = new Date("2018-04-16 08:30");
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
		        "day": 2,
		        "date": null,
		        "start": 0,
		        "end": 2
		    }

		    var expected = {
		        "instructor": "Subhajit Datta",
		        "id": "273",
		        "prof_id": "59",
		        "pillar": "ISTD",
		        "schedule": 
	            {
	            	"id": "273",
	                "title": "50.021\nCohort Classroom 11\nCohort 1",
	                "start": "20180417T0830",
	                "end": "20180417T1000"
	            }
		    }

		    // Assert
		    expect(util.eventToEditCalendar(input, startDate)).to.deep.equal(expected);
		});
});
