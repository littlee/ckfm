var TransactionActionCreators = require('../actions/TransactionActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(query) {
		request
			.get('/cooka-order-web/m/getOrderList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				TransactionActionCreators.receiveData(data);
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
};
