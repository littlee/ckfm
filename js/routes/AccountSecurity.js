var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'accountsecurity',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					// data fetching here...
					require('../utils/AccountSecurityUtil.js').getStatus();
					cb(null, require('../components/AccountSecurity.js'));
				});
			}
		}
	]
};
