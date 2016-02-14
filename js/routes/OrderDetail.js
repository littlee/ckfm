var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'orderdetail/:orderSerialNum',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/OrderDetail.js'));
				});
			}
		}
	]
};
