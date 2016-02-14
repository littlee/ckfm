var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'commentlist',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/CommentListUtil.js').getData();
					cb(null, require('../components/CommentList.js'));
				});
			}
		}
	]
};
