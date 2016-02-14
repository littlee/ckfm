var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'disputelist',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/DisputeList.js'));
				});
			}
		}
	]
};
