var ProductDetailActionCreators = require('../actions/ProductDetailActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

var submitData = {
	combination: []
};
var user = null;

module.exports = {
	getData: function(id) {
		request
			.get('/cooka-productDetail-web/m/productDetail')
			.use(CKFM.ajaxLoading())
			.query({
				productId: id
			})
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				ProductDetailActionCreators.receiveData(data);
				submitData.storeId = data.storeId;
				submitData.productId = data.productId;
			});
	},
	getCart: function() {
		request
			.get('/cooka-productDetail-web/m/getCartAmount')
			.use(CKFM.ajaxLoading())
			.end(function(err, res) {
				user = JSON.parse(res.text);
				ProductDetailActionCreators.receiveUser(user);
			});
	},
	getIntroduction: function(id) {
		request
			.get('/cooka-productDetail-web/m/productDescription')
			.use(CKFM.ajaxLoading())
			.query({
				productId: id
			})
			.end(function(err, res) {
				var introduction = res.text;
				ProductDetailActionCreators.receiveIntroduction(introduction);
			});
	},
	getComment: function(page, productId, cb) {
		request
			.get('/cooka-productDetail-web/m/getMobileCommentsList')
			.use(CKFM.ajaxLoading())
			.query({
				page: page,
				productId: productId
			})
			.end(function(err, res) {
				var comment = JSON.parse(res.text);
				if (cb && typeof cb === 'function') {
					cb(comment);
				}
			});
	},
	getRecommend: function(id) {
		request
			.post('/cooka-productDetail-web/m/recommend')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send({
				productId: id
			})
			.end(function(err, res) {
				var recommend = JSON.parse(res.text);
				ProductDetailActionCreators.receiveRecommend(recommend);
			});
	},
	addToCart: function(data) {

		var addToCartData = submitData;
		addToCartData.combination = [];
		data.valArr.map(function(item) {
			if (item.getamount > 0) {
				var addToCartArr = {};
				addToCartArr['combinationId'] = item.combId;
				addToCartArr['getamount'] = item.getamount;
				addToCartData.combination.push(addToCartArr);
			}
		});

		request
			.post('/cooka-productDetail-web/m/addToCart')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send(addToCartData)
			.end(function(err, res) {
				res = JSON.parse(res.text);
				if (res.result === 'success') {
					ProductDetailActionCreators.receiveUser(res);
				}
			});		
	},

	handleFavorite: function(data, cb) {
		
		var d = {};
		d.productId = data;
		request
			.post('/cooka-productDetail-web/m/addToFavourite')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send(d)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				if (cb && typeof cb === 'function') {
					cb(data.result);
				}
			});
		
	}
};
