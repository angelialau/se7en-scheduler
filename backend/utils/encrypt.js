var crypto = require("crypto");

var encrypt = {
	genRanString:function(length) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < length; i++) {
	  		text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

	  	return text;
	},

	sha512:function(password, salt) {
		var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	    hash.update(password);
	    var value = hash.digest('hex');
	    return value;
	}
}