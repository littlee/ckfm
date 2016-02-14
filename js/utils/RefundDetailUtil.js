var ActionCreators = require('../actions/RefundDetailActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {

	getData: function(itemSerialNum) {
		var q = {};
		q.itemSerialNum = itemSerialNum;
		request
			.post('/cooka-order-web/m/buyerhandling')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(q)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				ActionCreators.receiveData(data);
			});
	},

	cancel:function(query,cb){
		request
			.post('/cooka-order-web/m/cancelDisputeHandle')/*撤销申请*/
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(query)
			.end(function (err, res) {

				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
				
			});
	}
};