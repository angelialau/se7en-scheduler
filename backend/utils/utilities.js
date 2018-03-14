var utilities = {
	isEmptyObject:function(obj) {
		return !Object.keys(obj).length;
	},

	compareJSONKeys:function(jsonIn, jsonCompare){
		var inKeys = Object.keys(jsonIn).sort();
  		var compareKeys = Object.keys(jsonCompare).sort();
  		console.log(inKeys);
  		console.log(compareKeys);
  		return JSON.stringify(inKeys) === JSON.stringify(compareKeys);
	},

	basicPostCallback:function(res, err, count) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			count.success = true;
			res.json(count);
		}
	},

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
				res.json({"success":false, "message":"no rows found"});
			}
		}
	}
}

module.exports=utilities;