var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('incrementDate()', function () {
	it('Constructive Test: ' +
		'Moves date forward by a day when date is not Friday', function() {

			// Setup
			var startDate = new Date('2018-04-11');
			var expected = new Date('2018-04-12');

			// Run function
			util.incrementDate(startDate);

			// Assert
			expect(startDate.toDateString()).to.be.equal(expected.toDateString());
		});
});

describe('incrementDate()', function () {
	it('Constructive Test: ' +
		'Moves date forward by to Monday when date is a Friday', function() {

			// Setup
			var startDate = new Date('1995-11-03');
			var expected = new Date('1995-11-06');

			// Run function
			util.incrementDate(startDate);

			// Assert
			expect(startDate.toDateString()).to.be.equal(expected.toDateString());
		});
});