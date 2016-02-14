var CKFM = require('../CKFM.js');
var SecurityCommonUtil = require('../utils/SecurityCommonUtil.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'securitycommon',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					SecurityCommonUtil.getTypeSession();
					cb(null, require('../components/SecurityCommon.js'));
				});
			}
		}
	]
};
