var CKFM = require('../CKFM.js');

module.exports = {
	onEnter: CKFM.redirectToSignin,
	childRoutes: [{
		path: 'refund',
		component: require('../components/Refund.js'),
		indexRoute: {
			component: require('../components/RefundChooseItems.js')
		},
		childRoutes: [
			require('../routes/RefundOrder.js'),
			require('../routes/RefundApply.js')
		]
	}]
};

