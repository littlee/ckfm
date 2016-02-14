var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'orderlist',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/OrderList.js'));
				});
			}
		}
	]
};
