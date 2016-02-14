var CartActionCreators = require('../actions/CartActionCreators.js');
var request = require('superagent');
var CartStore = require('../stores/CartStore.js');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request.get('/cooka-cart-web/m/cart')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				CartActionCreators.receiveCartData(data);
			});
	},

	handleFavorite: function(productIndex) {
		CartActionCreators.handleFavorite(productIndex);
		var productId = CartStore.getFavorite();
		request
			.post('/cooka-cart-web/m/addToFavourite')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send(productId)
			.end(function(err, res) {
			});
	},

	removeCombination: function(removeData) {
		request
			.post('/cooka-cart-web/m/deleteItem')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send(removeData.itemId)
			.end(function(err, res) {
				if(JSON.parse(res.text)){
				console.log(JSON.parse(res.text))
					CartActionCreators.removeCombination(removeData);
				}
			});
	},

	getAmount: function() {
		if (sessionStorage.getItem('amountData')) {
			var cartData = JSON.parse(sessionStorage.getItem('amountData'));
			request
				.post('/cooka-cart-web/m/updateItem')
				.use(CKFM.ajaxLoading())
				.use(CKFM.ajaxAuth())
				.set('__RequestVerificationToken', CKFM.getToken())
				.set('Content-Type', 'application/json')
				.send(cartData)
				.end(function(err, res) {
					if (res.text) {
						sessionStorage.removeItem('amountData');
					}
				});
		}
	}
};