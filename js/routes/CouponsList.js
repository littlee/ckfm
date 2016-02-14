var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'couponslist',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/CouponsListUtil.js').getData();
					cb(null, require('../components/CouponsList.js'));
				});
			}
		}
	]
};