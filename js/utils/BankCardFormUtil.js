var request = require('superagent');
var CKFM = require('../CKFM.js');
var BankCardFormActionCreators = require('../actions/BankCardFormActionCreators.js');
var assign = require('lodash/object/assign.js');

module.exports = {
	getCountries: function() {
		request
			.get('/cooka-finance-web/m/selectAllCountriesForBank')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				BankCardFormActionCreators.receiveCountries(data);
			});
	},

	getCardType: function(num) {
		var data = {
			cardNum: num
		};

		request
			.get('/cooka-finance-web/getCardType')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.query(data)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				BankCardFormActionCreators.receiveCardType(data);
			});
	},

	formatTime: function(date) {
		var dateTemp = new Date(date);
		var year = dateTemp.getFullYear();

		var month = dateTemp.getMonth() + 1;

		var formatString = year + '/' + month;

		return formatString;
	},

	getPayStatus: function(formObj) {

		var date = {
			date: this.formatTime(formObj.date)
		};
		var data = assign({}, formObj, date);
		request
			.post('/cooka-finance-web/m/rechargeHandler')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.query(data)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				BankCardFormActionCreators.receivePayStatus(data);
			});
	},
	getRechargeStatus: function(formObj) {
		var date = {
			date: this.formatTime(formObj.date)
		};
		var data = assign({}, formObj, date);
		request
			.post('/cooka-finance-web/m/rechargeHandler')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.query(data)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				BankCardFormActionCreators.receiveRechargeStatus(data);
			});
	},

	getPaymentStatus: function(formObj) {
		var date = {
			date: this.formatTime(formObj.date)
		};
		var data = assign({}, formObj, date);
		request
			.get('/cooka-finance-web/m/payHandler')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.query(data)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				BankCardFormActionCreators.receivePaymentStatus(data);
			});
	},

	closeModal: function() {
		var data = {
			modalIsOpen: false
		};
		BankCardFormActionCreators.receiveModalIsOpen(data);
	}
};
