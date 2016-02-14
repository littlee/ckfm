var OrderListActionCreators = require('../actions/OrderListActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(query) {
		request
			.get('/cooka-order-web/m/getOrderList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				OrderListActionCreators.receiveData(data);
			});
	},

	getNextPage: function(query, cb) {
		request
			.get('/cooka-order-web/m/getOrderList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}

			});
	},

	cancelOrder: function(data, cb) {
		request
			.post('/cooka-order-web/m/cancelOrderHandle')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(data)
			.end(function(err, res) {
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	},

	confirmReceive: function(data, cb) {
		request
			.post('/cooka-order-web/m/confirmReceive')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(data)
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
