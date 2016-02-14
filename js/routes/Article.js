module.exports = {
	path: 'article/:file',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			cb(null, require('../components/Article.js'));
		});
	}
};
