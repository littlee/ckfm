var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [{
		path: 'bankcardpay',
		getComponent: function(location, cb) {
			require.ensure([], function(require) {
				require('../utils/BankCardFormUtil.js').getCountries();
				cb(null, require('../components/BankCardPay.js'));
			});
		}
	}]
};
