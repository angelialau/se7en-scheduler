var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('eventToFullCalendar()', function () {
	it('Constructive Test: ' +
		'Output format should match specs (non events)', function() {

			// Setup
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
		        "id": "273",
		        "prof_id": "59",
		        "pillar": "ISTD",
		        "schedule": [
		            {
		                "title": "50.021\nCohort Classroom 11\nCohort 1",
		                "start": "08:30",
		                "end": "10:00",
		                "dow": "1"
		            }
		        ]
		    }

		    // Assert
		    expect(util.eventToFullCalendar(input)).to.deep.equal(expected);
		});
});

describe('eventToFullCalendar()', function() {
	it('Constructive Test: ' +
		'Output format should match specs (events)', function() {

			// Setup
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
		        "schedule": [
		            {
		                "title": "Capstone Briefing\nThink Tank 1",
		                "start": "13:00",
		                "end": "18:30",
		                "dow": "5"
		            }
		        ]
		    }

		    // Assert
		    expect(util.eventToFullCalendar(input)).to.deep.equal(expected);
		});
});