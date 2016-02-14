var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'profile',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/ProfileUtil.js').getData();
					cb(null, require('../components/Profile.js'));
				});
			}
		}
	]
};
