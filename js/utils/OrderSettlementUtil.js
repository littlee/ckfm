var OrderSettlementActionCreators = require('../actions/OrderSettlementActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');
var Big = require('big.js');
module.exports = {
	getEndPrice: function(totalPrice, data) {
		request
			.get('/cooka-order-web/m/useCoupon')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query({
				money: totalPrice,
				couponSerialNum: data
			})
			.end(function(err, res) {
				if (err) {
					return err;
				} else {
					var data = JSON.parse(res.text);
					var dataBig = Big(data).toStirng();
					OrderSettlementActionCreators.setEndPrice(dataBig);
				}
			});
	},
	getCouponsNum: function() {
		var data = JSON.parse(sessionStorage.getItem('couponsNum'));
		OrderSettlementActionCreators.receiveCouponsNum(data);
	},
	getCoupons: function(price) {
		request
			.get('/cooka-order-web/m/getUserCoupons')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query({
				money: price
			})
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				if (err) {
					return err;
				} else {
					OrderSettlementActionCreators.receiveCoupons(data);
					sessionStorage.setItem('orderCoupons', JSON.stringify(data));
				}
			});
	},
	getOrderSession: function(id) {
		var o = JSON.parse(sessionStorage.getItem('buyNowData'));
		o.selectedId = id;
		var self = this;
		request
			.post('/cooka-order-web/m/orderConfirm')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send(o)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				var selectedId = -1;
				if (data.addressList.length !== 0) {
					selectedId = data.addressList[0].deliveraddrId;
				}
				//caculate end price
				var totalPriceBig = new Big(0);
				data.orderProcedureForms.map(function(storeItem, index) {
					var productPriceBig = new Big(0);
					storeItem.selectProduct.map(function(productItem, index) {
						var combinationPriceBig = new Big(0);
						productItem.combination.map(function(combination, index) {
							var getcompriceBig = new Big(combination.getcomprice);
							combinationPriceBig = combinationPriceBig.add(Big(combination.getamount).times(getcompriceBig));
						});
						productPriceBig = productPriceBig.add(combinationPriceBig);
					});
					totalPriceBig = totalPriceBig.add(productPriceBig);
					totalPriceBig = totalPriceBig.toString();
					OrderSettlementActionCreators.setEndPrice(totalPriceBig);
					OrderSettlementActionCreators.receiveData(data,selectedId);
					self.getCoupons(totalPriceBig);

					var couponsSelectJson = JSON.parse(sessionStorage.getItem('couponsNum'));
					if(couponsSelectJson) {
						self.getEndPrice(totalPriceBig,couponsSelectJson);
					}
			});
			});
	},
	sendData: function(data,cb) {
		request
			.post('/cooka-order-web/m/createOrderHandler')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('Content-Type', 'application/json')
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(data)
			.end(function(err, res) {
				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	}
};