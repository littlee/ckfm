var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'financialaccount',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/FinancialAccountUtil.js').getData();
					cb(null, require('../components/FinancialAccount.js'));
				});
			},
			getChildRoutes: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, [
						require('../routes/Transaction.js'),
						require('../routes/Recharge.js')
					]);
				});
			}
		}
	]
};
