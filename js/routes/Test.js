module.exports = {
	path: 'test',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			require('../utils/TestUtil.js').getTestData();
			cb(null, require('../components/Test.js'));
		});
	}
};
