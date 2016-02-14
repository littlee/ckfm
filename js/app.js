require('../css/bootstrap.min.css');
require('../css/icons.css');

require('../less/CKFM.less');

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;

var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();

var rootRoute = {
	component: 'div',
	childRoutes: [{
		path: '/',
		component: require('./components/App.js'),
		indexRoute: {
			component: require('./components/Home.js')
		},
		childRoutes: [
			require('./routes/SignIn.js'),
			require('./routes/SignUp.js'),
			require('./routes/Search.js'),
			require('./routes/SearchResult.js'),
			require('./routes/OrderSettlement.js'),
			require('./routes/UserCenter.js'),
			require('./routes/Category.js'),
			require('./routes/Feedback.js'),
			require('./routes/ProductDetail.js'),
			require('./routes/AddressManagement.js'),
			require('./routes/EditAddress.js'),
			require('./routes/OrderCoupons.js'),
			require('./routes/CollectedFolder.js'),
			require('./routes/Cart.js'),
			require('./routes/ForgetPassword.js'),
			require('./routes/OrderList.js'),
			require('./routes/OrderDetail.js'),
			require('./routes/SignUpSuccess.js'),
			require('./routes/Profile.js'),
			require('./routes/Comment.js'),
			require('./routes/FinancialAccount.js'),
			require('./routes/Recharge.js'),
			require('./routes/CouponsList.js'),
			require('./routes/Refund.js'),
			require('./routes/AccountSecurity.js'),
			require('./routes/SecurityCommon.js'),
			require('./routes/Transaction.js'),
			require('./routes/TransactionDetail.js'),
			require('./routes/OrderPayment.js'),
			require('./routes/BankCardPay.js'),
			require('./routes/BankCardRecharge.js'),
			require('./routes/CommentList.js'),
			require('./routes/RefundProgress.js'),
			require('./routes/RefundDetail.js'),
			require('./routes/DisputeList.js'),
			require('./routes/Notification.js'),
			require('./routes/NotificationDetail.js'),
			require('./routes/AddressList.js'),
			require('./routes/EditAddressList.js'),
			require('./routes/Article.js'),
			// add other routes [here]
			// 404 route, should be always in bottom
			require('./routes/Test.js'),
			{
				path: '*',
				component: require('./components/NotFound.js')
			}
		]
	}]
};

//init util calls
require('../js/utils/AppUtil.js').fetchToken();
require('../js/utils/HomeUtil.js').getData();

ReactDOM.render(
	<Router history={history} routes={rootRoute} />,
	document.getElementById('app')
);