module.exports = {
	path: 'productdetail/:productId',
	getComponent: function(location, cb) {
		require.ensure([], function(require) {
			// data fetching here...
			cb(null, require('../components/ProductDetail.js'));
		});
	},
	getChildRoutes: function(location, cb) {
		require.ensure([], function(require) {			
			cb(null, [
				require('../routes/ProductDetailComment')
			]);
		});
	},
	getIndexRoute: function(location, cb) {
		cb(null, {
			component: require('../components/ProductIntroduction.js')
		});
	}
};	
