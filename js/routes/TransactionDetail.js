var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'transactiondetail/:orderNum',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/TransactionDetail.js'));
				});
			}
		}
	]
};
