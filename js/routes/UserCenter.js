var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'usercenter',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/UserCenterUtil.js').getData();
					cb(null, require('../components/UserCenter.js'));
				});
			}
		}
	]
};
