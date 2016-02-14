var OrderCouponsActionCreators = require('../actions/OrderCouponsActionCreators.js');
var request = require('superagent');

module.exports = {
	getData: function() {
		var data = JSON.parse(sessionStorage.getItem('orderCoupons'));
		// var oo = sessionStorage.getItem('orderCoupons');
		setTimeout(function(){
			OrderCouponsActionCreators.receiveData(data);
		}, 0);
	},
	getSelectNum: function() {
		var data = JSON.parse(sessionStorage.getItem('couponsNum'));
		setTimeout(function(){
			OrderCouponsActionCreators.receiveSelectNum(data);
		}, 0);
	}
};