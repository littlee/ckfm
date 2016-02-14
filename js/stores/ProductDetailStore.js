var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';
var CKFM = require('../CKFM.js');
var Big =  require('big.js');

var _data = {
	carousel: [],
	tit: '',
	level: null,
	price: [],
	range: [],
	start: null,
	combination: [
		{
			name: '',
			image: '',
			child: []
		}
	],
	combinationString: []
};

var _cart = {};

var _collected = null;

var introduction = null;

var comment = {};

var recommend = [];

var combAmount = {
	valArr: [],
	total: 0,
	totalPieces:0
};

function _setData(d) {
	_data = d;
}

function _setCart(d) {
	_cart = d;
}

function _setCollected(d) {
	_collected = d;
}

function _setComment(d) {
	comment = d;
}

function _setRecommend(d) {
	recommend = d;
}

function _setIntroduction(d) {
	introduction = d.replace(/style=\"/g, "");
}

function _changeCombAmount(newVal, combId) {
	var totalPieces = 0;
	if (combAmount.valArr.length === 0) {
		for (var i = 0; i < _data.combination.length; i++) {
			for (var j = 0; j < _data.combination[i].child.length; j++) {
				var combJson = {};
				combJson['combId'] = _data.combination[i].child[j].combinationId;
				combJson['image'] = _data.combination[i].image;
				combJson['imageName'] = _data.combination[i].name;
				combJson['name'] = _data.combination[i].child[j].name;
				if (_data.combination[i].child[j].combinationId == combId)
					combJson['getamount'] = newVal;
				else
					combJson['getamount'] = 0;
				combAmount.valArr.push(combJson);
			}
		}
		totalPieces = newVal;
	} else {
		totalPieces = 0;

		combAmount.valArr.map(function(elem, index) {
			if (elem.combId == combId) {
				elem.getamount = parseInt(newVal);
			}
			totalPieces += elem.getamount;
		});
	}
	var rangeArr = _data.range;
	var price = _data.price[0];
	for (var i = rangeArr.length - 1; i >= 0; i--) {
		if (totalPieces >= rangeArr[i]) {
			price = _data.price[i];
			break;
		}
	}

	var total = new Big(price).times(totalPieces);
	combAmount.total = total;
	combAmount.total = combAmount.total>0 ? combAmount.total : 0;
	combAmount.totalPieces = totalPieces;
	
}

function clearCombAmount(){
	combAmount = {
		valArr: [],
		total: 0,
		totalPieces:0
	};
}

var ProductDetailStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getData: function() {
		return _data;
	},

	getCart: function() {
		return _cart;
	},

	getComment: function() {
		return comment;
	},

	getRecommend: function() {
		return recommend;
	},

	getCombAmount: function() {
		return combAmount;
	},

	getIntroduction: function() {
		return introduction;
	},

	getCollected: function() {
		return _collected;
	}
});

ProductDetailStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
	case ActionTypes.PRODUCTDETAILCOMMENT_RECEIVE_DATA:
		_setComment(action.comment);
		ProductDetailStore.emitChange();
		break;
	case ActionTypes.PRODUCTDETAIL_RECEIVE_DATA:
		_setData(action.data);
		clearCombAmount();
		ProductDetailStore.emitChange();
		break;
	case ActionTypes.PRODUCTDETAIL_RECEIVE_USER:
		_setCart(action.user);
		ProductDetailStore.emitChange();
		break;
	case ActionTypes.PRODUCTRECOMMEND_RECEIVE_DATA:
		_setRecommend(action.recommend);
		ProductDetailStore.emitChange();
		break;
	case ActionTypes.PRODUCTDETAIL_CHANGE_COMBAMOUNT:
		_changeCombAmount(action.combAmount, action.combId);
		ProductDetailStore.emitChange();
		break;
	case ActionTypes.PRODUCTDETAIL_RECEIVE_INTRODUCTION:
		_setIntroduction(action.introduction);
		ProductDetailStore.emitChange();
		break;
	case ActionTypes.PRODUCTDETAIL_RECEIVE_COLLECTED:
		_setcollected(action.collected);
		ProductDetailStore.emitChange();
		break;
	default:
	}
});

module.exports = ProductDetailStore;
