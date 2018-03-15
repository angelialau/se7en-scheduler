var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('basicPostCallback()', function() {
	it('Branch Test: ' +
		'Returns the err if there is one', function() {
			
			// Setup
			var output;
			var res = {};
			var err = "There is an error";
			var count = -1;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicPostCallback(res, err, count);

			// Assert
			expect(output).to.be.equal(err);
		});
});

describe('basicPostCallback()', function() {
	it('Branch Test: ' +
		'Returns the count if there is no err', function() {
			
			// Setup
			var output;
			var res = {};
			var err;
			var count = 2;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicPostCallback(res, err, count);

			// Assert
			expect(output).to.be.equal(count);
		});
});
