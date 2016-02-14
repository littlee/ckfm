var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'addresslist',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					// data fetching here...
					require('../utils/AddressListUtil.js').getData();
					cb(null, require('../components/AddressList.js'));
				});
			}
		}
	]
};