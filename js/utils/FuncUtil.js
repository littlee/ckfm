var CKFM = require('../CKFM.js');

module.exports = {
	disCountryPrice: function(num) {
		var amountString = num.toString();
		var amount = amountString;
		if (CKFM.getCurrency() === 'VND') {
			if (amountString.length > 3) {
				var amountArr = amountString.split('');
				amountArr.splice(amountArr.length - 3, 0, '.');
				amount = amountArr.join('');
			}
		}
		return amount;
	}
};
