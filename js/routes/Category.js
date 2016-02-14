module.exports = {
	path: 'categories',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			require('../utils/CategoryUtil.js').getData();
			cb(null, require('../components/Category.js'));
		});
	}
};