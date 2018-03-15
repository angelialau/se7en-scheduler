var utilities = {
	// checked if an json object has no keys
	isEmptyObject:function(obj) {
		return !Object.keys(obj).length;
	},

	// checks if two json objects have the same set of keys
	compareJSONKeys:function(jsonIn, jsonCompare){
		var inKeys = Object.keys(jsonIn).sort();
  		var compareKeys = Object.keys(jsonCompare).sort();
  		return JSON.stringify(inKeys) === JSON.stringify(compareKeys);
	},

	/**
	 * common post callback sequence
	 * 
	 * returns err response is there is one
	 * else returns basic status of post request
	**/
	basicPostCallback:function(res, err, count) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			count.success = true;
			res.json(count);
		}
	},

	/**
	 * common get callback sequence
	 * 
	 * returns err response if there is one
	 *
	 * row_num = null would return all rows if no error
	 * row_num = int would return only the row with index row_num
	 */
	basicGetCallback:function(res, err, rows, row_num) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			if (!this.isEmptyObject(rows)) {
		
				if (row_num != null) {
					rows[row_num].success = true;
					res.json(rows[row_num]);
				} else {
					rows.success = true;
					res.json(rows);
				}

			} else {
				res.json(rows);
				res.json({"success":false, "message":"no rows found"});
			}
		}
	}
}

module.exports=utilities;