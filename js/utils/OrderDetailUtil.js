var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(onum, cb) {
		request
			.get('/cooka-order-web/m/getOrderDetail')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query({
				orderSerialNum: onum
			})
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