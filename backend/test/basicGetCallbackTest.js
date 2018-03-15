var expect = require('chai').expect;
var util = require('../utils/utilities');

describe('basicGetCallback()', function() {
	it('Branch Test: ' +
		'Returns the err if there is one', function() {
			
			// Setup
			var output;
			var res = {};
			var err = "There is an error";
			var rows = [];
			var row_num = null;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicGetCallback(res, err, rows, row_num);

			// Assert
			expect(output).to.be.equal(err);
		});
});

describe('basicGetCallback()', function() {
	it('Branch Test: ' +
		'Returns the all rows when row_num is null', function() {
			
			// Setup
			var output;
			var res = {};
			var err;
			var rows = ["row one", "row two"];
			var row_num = null;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicGetCallback(res, err, rows, row_num);

			// Assert
			expect(output).to.be.equal(rows);
		});
});

describe('basicGetCallback()', function() {
	it('Branch Test: ' +
		'Returns row indicated by row_num', function() {
			
			// Setup
			var output;
			var res = {};
			var err;
			var rows = ["row one", "row two"];
			var row_num = 1;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicGetCallback(res, err, rows, row_num);

			// Assert
			expect(output).to.be.equal(rows[1]);
		});
});

describe('basicGetCallback()', function() {
	it('Branch Test: ' +
		'Returns error when rows is empty', function() {
			
			// Setup
			var output;
			var res = {};
			var err;
			var rows = [];
			var row_num = 1;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicGetCallback(res, err, rows, row_num);

			// Assert
			expect(output.success).to.be.equal(false);
			expect(output.message).to.be.equal("no rows found");
		});
});
