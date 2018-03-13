var utilities = {
	isEmptyObject:function(obj) {
		return !Object.keys(obj).length;
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

	basicGetCallback:function(res, err, rows) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			if (!isEmptyObject(rows)) {
			rows[0].success = true;
			res.json(rows[0]);
			} else {
				res.json({"success":false, "message":"no rows found"});
			}
		}
	}
}

module.exports=utilities;