module.exports = {
	path: 'forgetpassword',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			cb(null, require('../components/ForgetPassword.js'));
		});
	}
};