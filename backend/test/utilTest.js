var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('compareJSONKeys()', function () {
	it('should tell you whether two JSON objects have exactly ' +
	    'the same keys regardless of order', function() {

			// Setup
			var a = {"name": "Rayson", "age": 23};
			var b = {"age": 21, "name": "Angelia"};

			// Assert
			expect(true).to.be.equal(util.compareJSONKeys(a,b));
		})
});