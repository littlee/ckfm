var FinancialAccountActionCreators = require('../actions/FinancialAccountActionCreators.js');
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
				FinancialAccountActionCreators.receiveData(data);
			});
	},

	verifyCardNum: function(num) {
		var cardType;

		var data = {
			cardNum: num
		};

		request
			.post('/cooka-finance-web/verifyCardNum')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(data)
			.end(function(err, res) {
				var data = res;
				if (!data.valid) {
					return 'error'
				}
				if (data.result.cardType === 'JCB' || data.result.cardType === 'Mastercard' || data.result.cardType === 'Visa') {
					return cardType = data.result.cardType;
				} else {
					return 'error';
				}
			});
	}
};
