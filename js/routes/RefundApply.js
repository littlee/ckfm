var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'refundapply/:itemSerialNum',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					// cause build error
					cb(null, require('../components/RefundApply.js'));
				});
			}
		}
	]
};
