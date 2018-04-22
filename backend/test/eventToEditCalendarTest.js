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

describe('eventToEditCalendar()', function () {
	it('Constructive Test: ' +
		'Output format should match specs (events)', function() {

			// Setup
			var startDate = new Date("2018-04-16 08:30");
			var input = {
		        "id": 324,
		        "schedule_id": 25,
		        "term": null,
		        "pillar": null,
		        "course": "Capstone Briefing",
		        "prof": null,
		        "prof_id": null,
		        "cohort": null,
		        "location": "Think Tank 1",
		        "day": 5,
		        "date": "2018-04-19T16:00:00.000Z",
		        "start": 9,
		        "end": 19
		    }

		    var expected = {
		        "instructor": null,
		        "id": "324",
		        "prof_id": null,
		        "pillar": null,
		        "schedule": 
	            {
	            	"id": "324",
	                "title": "Capstone Briefing\nThink Tank 1",
	                "start": "20180420T1300",
	                "end": "20180420T1830"
	            }
		    }

		    // Assert
		    expect(util.eventToEditCalendar(input, startDate)).to.deep.equal(expected);
		});
});
