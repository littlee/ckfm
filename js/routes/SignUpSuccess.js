module.exports = {
	path: 'signupsuccess',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			cb(null, require('../components/SignUpSuccess.js'));
		});
	}
};
