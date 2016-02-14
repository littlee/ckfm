var BankCardRechargeActionCreators = require('../actions/BankCardRechargeActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/js/data/yourStaticJson')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				BankCardRechargeActionCreators.receiveData(data);
			});
	}
};
