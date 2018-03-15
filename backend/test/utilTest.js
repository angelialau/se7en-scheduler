var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('compareJSONKeys()', function () {
	it('Constructive Test: ' +
	    'Return true for equal keys', function() {

			// Setup
			var a = {"name": "Rayson", "age": 23};
			var b = {"age": 21, "name": "Angelia"};

			// Assert
			expect(util.compareJSONKeys(a,b)).to.be.equal(true);
		});
});

describe('compareJSONKeys()', function () {
	it('Constructive Test: ' +
		'Return false for nonequal keys', function() {

			// Setup
			var a = {"name": "Rayson"};
			var b = {"name": "Angelia", "age": 22};

			// Assert
			expect(util.compareJSONKeys(a,b)).to.be.equal(false);
		});
});

describe('compareJSONKeys()', function() {
	it('Destructive Test: ' +
		'Should work as normal with empty objects', function() {

			// Setup
			var a = {};
			var b = {};

			// Assert
			expect(util.compareJSONKeys(a,b)).to.be.equal(true);
		});
});

describe('compareJSONKeys()', function() {
	it('Destructive Test: ' +
		'Should work as normal with empty objects', function() {

			// Setup
			var a = {"name": "Rayson"};
			var b = {};

			// Assert
			expect(util.compareJSONKeys(a,b)).to.be.equal(false);
		});
});