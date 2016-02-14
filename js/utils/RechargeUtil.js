var RechargeActionCreators = require('../actions/RechargeActionCreators.js');
var request = require('superagent');

var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/cooka-finance-web/m/financialAccount')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				RechargeActionCreators.receiveData(data);
			});
	}
};
