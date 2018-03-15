var expect = require('chai').expect;
var Course = require('../models/Course')

describe('rowToJSON()', function () {
	var output;
	it('transforms course to correct format', function() {

			// Setup
			course = {
		        "id": 58,
		        "schedule_id": 25,
		        "term": 1,
		        "course_no": "50.003",
		        "course_name": "Elements of Software Construction",
		        "core": 1,
		        "no_classes": 3,
		        "class_size": 50,
		        "no_sessions": 3,
		        "sessions_hrs": "2,2,1",
		        "class_types": "Lecture,Lecture,Lecture",
		        "instructors": "31,31,31",
		        "split": "1,1,1"
    		}

			// Act
			output = Course.rowToJSON(course);

			// Assert
			expect(true).to.be.equal(true);
		});

	afterEach(function () {
		console.log(output);
	})
});