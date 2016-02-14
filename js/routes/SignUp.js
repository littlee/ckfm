module.exports = {
	path: 'signup',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			cb(null, require('../components/SignUp.js'));
		});
	}
};