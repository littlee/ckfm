var ActionCreators = require('../actions/RefundActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {

	getStatus: function(query) {
		var d = {};
		d.itemSerialNum = query;
		request
			.post('/cooka-order-web/m/buyerhandling')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(d)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				ActionCreators.receiveData(data);
			});
	},

	cancel:function(query){
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
					cb(res.text);
				}
				
			});
	}
};