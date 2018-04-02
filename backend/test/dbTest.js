var expect = require('chai').expect;
var db = require("../utils/dbconnection");

describe("db", function() {
	it("Check connection", function() {
		expect(db.state).to.be.equal("connected");
	})
})