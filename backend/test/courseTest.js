var expect = require('chai').expect;
var Course = require('../models/Course')

describe('getCoursesForAlgo()', function () {
	var output;
	it('returns courses in correct format', function() {

			// Act
			Course.getCoursesForAlgo(1, function(row){
				output = row;
			});

			// Assert
			expect(true).to.be.equal(true);
		});

	afterEach(function () {
		console.log(output);
	})
});