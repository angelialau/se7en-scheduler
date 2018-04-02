var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('isEmptyObject()', function() {
	it('Constructive Test: ' +
		'Returns true for empty json object', function() {

			// Setup
			var a = {};

			// Assert
			expect(util.isEmptyObject(a)).to.be.equal(true);
		});
});

describe('isEmptyObject()', function() {
	it('Constructive Test: ' +
		'Returns false for nonempty json object', function() {

			// Setup
			var a = {"name": "Rayson"};

			// Assert
			expect(util.isEmptyObject(a)).to.be.equal(false);
		});
});