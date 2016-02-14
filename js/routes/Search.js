module.exports = {
	path: 'search',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			require('../utils/SearchUtil.js').getData();
			cb(null, require('../components/Search.js'));
		});
	}
};
