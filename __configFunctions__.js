var Big = require('big.js');

module.exports = {
	getDisplayPrice: function(p) {
		if (typeof p === 'number' || typeof p === 'string') {
			return Big(p).div(Big(1000)).toString() + 'K';
		} else {
			throw new Error('Price should be number or string');
		}
	}
};