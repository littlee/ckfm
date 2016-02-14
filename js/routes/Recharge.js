var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'recharge',
			getComponent: function(location, cb) {
				require.ensure([], (require) => {
					require('../utils/RechargeUtil.js').getData();
					cb(null, require('../components/Recharge.js'));
				});
			}
		}
	]
};
