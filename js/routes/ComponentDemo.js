module.exports = {
	path: 'yourpath',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			require('../utils/YourUtils.js').getData();
			cb(null, require('../components/YourComponentName.js'));
		});
	}
};
