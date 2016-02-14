var OrderPaymentActionCreators = require('../actions/OrderPaymentActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(orderSerialnum) {
		request
			.get('/cooka-order-web/mPrePay')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(orderSerialnum)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				OrderPaymentActionCreators.receiveData(data);
			});
	},
	getPayStatus: function(query, cb) {
		request
			.get('/cooka-finance-web/m/payHandler')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.query(query)
			.end(function(err, res) {
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}

			});
	}
};
