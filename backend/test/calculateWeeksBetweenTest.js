var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('calculateWeeksBetween()', function () {
	it('Constructive Test: ' +
		'Should return number of weeks between two dates', function() {

			// Setup
			var startDate = new Date("2018-04-16");
			var endDate = new Date("2018-04-23");
			
		    var expected = 1;

		    // Assert
		    expect(util.calculateWeeksBetween(startDate, endDate)).to.deep.equal(expected);
		});
});


describe('calculateWeeksBetween()', function () {
	it('Constructive Test: ' +
		'Should round up', function() {

			// Setup
			var startDate = new Date("2018-04-16");
			var endDate = new Date("2018-04-20");
			
		    var expected = 1;

		    // Assert
		    expect(util.calculateWeeksBetween(startDate, endDate)).to.deep.equal(expected);
		});
});