var ActionCreators = require('../actions/RefundActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	fromRefundOrder: function(itemSerialNum) {
		var d = {};
		var query = {};
		d.list = [];
		if(itemSerialNum === '0'){		
			d = JSON.parse(sessionStorage.getItem('refundOrder'));
			ActionCreators.receiveData(d);
		}else{	
			query.itemSerialNum = itemSerialNum;
			request
				.post('/cooka-order-web/m/editDisputeInfo')
				.use(CKFM.ajaxLoading())
				.use(CKFM.ajaxAuth())
				.set('__RequestVerificationToken', CKFM.getToken())
				.set('Content-Type', 'application/json')		
				.send(query)
				.end(function(err, res) {
					var data = JSON.parse(res.text);					
					d.list.push(data);
					ActionCreators.receiveData(d);
				});
		}
	},

	getPassword: function(data, cb) {
		request
			.post('/cooka-order-web/m/applyDisputeHandle')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(data)
			.end(function(err, res) {

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}

			});
	},

	fromMyOrder: function(query) {
		var data = JSON.parse(sessionStorage.getItem('ck_refund_from_order'));
		ActionCreators.receiveData(data);
	},

	fromRefundChooseItems: function(query) {
		var data = JSON.parse(sessionStorage.getItem('refundChooseItems'));
		ActionCreators.receiveData(data);
	},

	getStatus: function(query) {
		request
			.get('/js/data/refundstatus.json')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				ActionCreators.receiveData(data);
			});
	},

	cancel: function(query) {
		request
			.post('/m/cooka-cart-web/addToFavourite') /*撤销申请*/
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(data.password)
			.end(function(err, res) {

				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(res.text);
				}

			});
	}
};