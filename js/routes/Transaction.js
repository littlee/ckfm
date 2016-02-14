var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'transaction',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/Transaction.js'));
				});
			},
			getChildRoutes: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, [
						require('../routes/TransactionDetail.js')
					]);
				});
			}
		}
	]
};
