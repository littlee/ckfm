var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'refundprogress/:itemSerialNum',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/RefundProgress.js'));
				});
			}
		}
	]
};
