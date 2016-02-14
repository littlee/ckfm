var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'ordercoupons',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/OrderCouponsUtil.js').getData();
					require('../utils/OrderCouponsUtil.js').getSelectNum();
					cb(null, require('../components/OrderCoupons.js'));
				});
			}
		}
	]
};