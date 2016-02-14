var CKFM = require('../CKFM.js');
module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [
		{
			path: 'comment',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					require('../utils/CommentUtil.js').getData();
					cb(null, require('../components/Comment.js'));
				});
			}
		}		
	]
};