var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'ordersettlement',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					//require('../utils/OrderSettlementUtil.js').getOrderSession(-1);
					require('../utils/OrderSettlementUtil.js').getCouponsNum();
					cb(null, require('../components/OrderSettlement.js'));
				});
			}
		}
	]
};