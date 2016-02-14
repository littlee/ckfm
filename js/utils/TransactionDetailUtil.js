var TransactionDetailActionCreators = require('../actions/TransactionDetailActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(orderNum) {
		request
			.get('/cooka-order-web/m/getOrderDetail')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query({
				orderSerialNum: orderNum
			})
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				TransactionDetailActionCreators.receiveData(data);
			});
	}
};
