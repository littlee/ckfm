var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'cart',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/CartUtil.js').getData();
					cb(null, require('../components/Cart.js'));
				});
			}
		}		
	]
};