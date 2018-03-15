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

describe('basicGetCallback()', function() {
	it('Branch Test: ' +
		'Returns the err if there is one', function() {
			
			// Setup
			var output;
			var res = {};
			var err = "There is an error";
			var rows = {};
			var row_num = null;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicPostCallback(res, err, rows, row_num);

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
			var rows = {0: "row one", 1: "row two"};
			var row_num = null;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicPostCallback(res, err, rows, row_num);

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
			var rows = {0: "row one", 1: "row two"};
			var row_num = 1;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicPostCallback(res, err, rows, row_num);

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
			var rows = {};
			var row_num = 1;

			res.json = function(message) {
				output = message;
			};

			// Act
			util.basicPostCallback(res, err, rows, row_num);

			// Assert
			expect(output.success).to.be.equal(false);
			expect(output.message).to.be.equal("no rows found");
		});
});

























