var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'collectedfolder',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/CollectedFolderUtil.js').getData();
					cb(null, require('../components/CollectedFolder.js'));
				});
			}
		}
	]
};
