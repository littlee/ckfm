module.exports = {
	path: 'searchresult',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			require('../utils/SearchResultUtil.js').getSearchResult(location.query);
			cb(null, require('../components/SearchResult.js'));
		});
	}
};
