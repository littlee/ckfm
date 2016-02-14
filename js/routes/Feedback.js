module.exports = {
	path: 'feedback',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			// data fetching here...
			cb(null, require('../components/Feedback.js'));
		});
	}
};