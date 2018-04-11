var expect = require('chai').expect;
var Course = require('../models/Course')

describe('rowToJSON()', function () {
	var output;
	it('transforms course to correct format', function() {

			// Setup
			course = {
		        "id": 88,
		        "schedule_id": 25,
		        "term": 4,
		        "course_no": "50.004",
		        "course_name": "Computer System Engineering",
		        "core": 1,
		        "no_classes": 3,
		        "class_size": 50,
		        "no_sessions": 3,
		        "sessions_hrs": "2,2,2",
		        "class_types": "Cohort Based Learning,Cohort Based Learning,Cohort Based Learning",
		        "instructors": "David Yau,Jit Biswas|David Yau,Jit Biswas|David Yau,Jit Biswas",
		        "instructor_ids": "58,32|58,32|58,32",
		        "split": "1,1,1",
		        "venue_types": "no preference,no preference,no preference"
    		}

    		// expected result
    		correct = { 
    			  "term": 4,
				  "course_no": '50.004',
				  "course_name": 'Computer System Engineering',
				  "core": 1,
				  "no_classes": 3,
				  "class_size": 50,
				  "no_sessions": 3,
				  "sessions": 
				   [ {'class_type': 'Cohort Based Learning',
				      'time': '2',
				      'instructors': ['58','32'],
				      'split': '1',
				      'preference': 'no preference'},
				     {'class_type': 'Cohort Based Learning',
				      'time': '2',
				      'instructors': ['58','32'],
				      'split': '1',
				      'preference': 'no preference'},
				     {'class_type': 'Cohort Based Learning',
				      'time': '2',
				      'instructors': ['58','32'],
				      'split': '1',
				  	  'preference': 'no preference'} 
				    ] 
			}

			// Act
			output = Course.rowToJSON(course);

			// Assert
			expect(output).to.deep.equal(correct);
	});
});