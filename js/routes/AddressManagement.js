var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'addressmanagement',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					// data fetching here...
					require('../utils/AddressManagementUtil.js').getData();
					cb(null, require('../components/AddressManagement.js'));
				});
			}
		}
	]
};