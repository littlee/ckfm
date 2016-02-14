module.exports = {
	path: 'comment',
	getComponent: function(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../components/ProductDetailComment.js'));
		});
	}
};
