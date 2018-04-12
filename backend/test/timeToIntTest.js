var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('timeToInt()', function () {
	it('Constructive Test: ' +
		'Converts 08:30 to 0', function() {

			// Setup
			var expected = 0;

		    // Assert
		    expect(util.timeToInt('08:30')).to.deep.equal(expected);
		});
});

describe('timeToInt()', function () {
	it('Constructive Test: ' +
		'Converts 17:30 to 18', function() {

			// Setup
			var expected = 18;

		    // Assert
		    expect(util.timeToInt('17:30')).to.deep.equal(expected);
		});
});

describe('timeToInt()', function () {
	it('Destructive Test: ' +
		'Should work fine even if not in HH:MM format', function() {

			// Setup
			var expected = 0;

		    // Assert
		    expect(util.timeToInt('8:30')).to.deep.equal(expected);
		});
});

describe('timeToInt()', function () {
	it('Destructive Test: ' +
		'Should work fine even if time is before 8:30', function() {

			// Setup
			var expected = -2;

		    // Assert
		    expect(util.timeToInt('7:30')).to.deep.equal(expected);
		});
});