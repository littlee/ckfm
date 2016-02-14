var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';
var Big =  require('big.js');

var _data = {};
var _removeCombinationArr = [];
var _favoriteProductArr = [];
var _submitData = {};
var amountData = [];

function _setData(d) {
	_data = d;
	if(_data.product){			
		_data.product.map(function(productItem,productIndex){
			productItem.combination.map(function(combinationItem,combinationIndex){
				combinationItem.checked=false;
			});
			productItem.nowPrice=productItem.price[0];
			productItem.productPieces=0;
		});
	}
	_data.totalPieces = 0;
	_data.total = 0;
	_data.checkedAll = false;
}

function _changeAmount(handleData) {
	var thisItem = _data
		.product[handleData.productIndex]
		.combination[handleData.combinationIndex];

	thisItem.amount=handleData.newVal;
	thisItem.checked=true;
	var changed = false;
	for (var i = amountData.length - 1; i >= 0; i--) {
		if(amountData[i].itemId===thisItem.itemId){
			changed = true;
			amountData[i].amount = thisItem.amount;
			break;
		}
	}
	if(!changed){
		var itemArr={};
		itemArr['itemId'] = thisItem.itemId;
		itemArr['amount'] = thisItem.amount;
		amountData.push(itemArr);
	}
	sessionStorage.setItem('amountData', JSON.stringify(amountData));
	_setPrice(handleData);
	_setCheckedAll();
}

function _handleChecked(handleData){
	var thisItem = _data
		.product[handleData.productIndex]
		.combination[handleData.combinationIndex];

	thisItem.checked = !thisItem.checked;

	_setPrice(handleData);
	_setCheckedAll();
}

function _removeCombination(handleData){
	if(handleData.combinationIndex !== -1){	
		_removeCombinationArr.push(_data
										.product[handleData.productIndex]
										.combination[handleData.combinationIndex]
										.itemId);
		_data
			.product[handleData.productIndex]
			.combination
			.splice(handleData.combinationIndex,1);

		_setPrice(handleData);

	}else{
		for (var i = _data.product[handleData.productIndex].combination.length - 1; i >= 0; i--) {
			_removeCombinationArr.push(_data.product[handleData.productIndex].combination[i]);
		}
		_data.product.splice(handleData.productIndex,1);
	}
}

function _handleFavorite(productIndex){
	_favoriteProductArr.push(_data.product[productIndex].productId);
	_data.product[productIndex].collected=true;
}

function _setPrice(handleData) {
	var totalPieces = 0;
	var thisItem = _data.product[handleData.productIndex];
	var rangeArr = thisItem.range;
	var price = thisItem.price[0];


/************************
      get nowPrice
************************/
	thisItem.combination.map(function(elem, index) {
		if(elem.checked)
			totalPieces += elem.amount;
	});
	_data.product[handleData.productIndex].productPieces=totalPieces;

	for (var i = rangeArr.length - 1; i >= 0; i--) {
		if (totalPieces >= rangeArr[i]) {
			price = thisItem.price[i];
			break;
		}
	}
	_data.product[handleData.productIndex].nowPrice=price;


/************************
 get totalPieces & total
************************/
	var allTotal = new Big(0);
	var allTotalPieces = 0;
	_data.product.map(function(item,index){/*bug here*/
		allTotalPieces += item.productPieces;		
	});
	_data.totalPieces = allTotalPieces;

	_data.product.map(function(item,index){
		var itemTotal = new Big(item.nowPrice).times(item.productPieces);
		allTotal = allTotal.plus(itemTotal);
	});
	_data.total = allTotal;
}

function _setCheckedAll(){
	var checkedAll = true;
	for(var i=0;i<_data.product.length;i++){
		if(_data.product[i].active){				
			for (var j = _data.product[i].combination.length - 1; j >= 0; j--) {
				if(!_data.product[i].combination[j].checked){
					checkedAll=false;
					i=_data.product.length;
					break;
				}
			}
		}
	}
	_data.checkedAll = checkedAll;
}

function _handleCheckedAll(){
	_data.checkedAll = !_data.checkedAll;

	for(var i=0;i<_data.product.length;i++){
		if(_data.product[i].active){
			for (var j = _data.product[i].combination.length - 1; j >= 0; j--) {
				_data.product[i].combination[j].checked = _data.checkedAll;
			}
		}
	}

/************************
      get nowPrice
************************/
	var totalPieces = 0;
	var allTotalPieces = 0;
	var allTotal = new Big(0);
	var price=0;

	if(_data.checkedAll){
		_data.product.map(function(productItem,index) {
			if(productItem.active){
				totalPieces = 0;
				price = productItem.price[0];

				productItem.combination.map(function(combinationItem, index) {
					totalPieces += combinationItem.amount;
					allTotalPieces += combinationItem.amount;
				});
				productItem.productPieces = totalPieces;

				for (var i = productItem.range.length - 1; i >= 0; i--) {
					if (totalPieces >= productItem.range[i]) {
						price = productItem.price[i];
						break;
					}
				}

				allTotal = allTotal.plus(new Big(price).times(totalPieces));
				productItem.nowPrice = price;
			}
		});
	}else{
		_data.product.map(function(productItem,index) {
			productItem.nowPrice =productItem.price[0];
			productItem.productPieces = 0;
		});
	}

	/*get totalPieces & total*/
	_data.totalPieces = allTotalPieces;
	_data.total = allTotal;
}

var CartStore = assign({}, EventEmitter.prototype, {
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

	getPrice:function(){
		if(_data.length>0){

		}else{
			return 0;
		}
	},

	getFavorite:function(){
		return _favoriteProductArr;
	},

	removeCombination:function(){
		return _removeCombinationArr;
	}
});

CartStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {

		case ActionTypes.CART_RECEIVE_DATA:
			_setData(action.cart);
			CartStore.emitChange();
			break;

		case ActionTypes.CART_CHANGE_AMOUNT:
			_changeAmount(action.handleData);
			CartStore.emitChange();
			break;

		case ActionTypes.CART_HANDLE_CHECKED:
			_handleChecked(action.handleData);
			CartStore.emitChange();
			break;

		case ActionTypes.CART_REMOVE_COMBINATION:
			_removeCombination(action.removeData);
			CartStore.emitChange();
			break;

		case ActionTypes.CART_FAVORITE_PRODUCT:
			_handleFavorite(action.handleData);
			CartStore.emitChange();
			break;

		case ActionTypes.CART_CHECKED_All:
			_handleCheckedAll();
			CartStore.emitChange();
			break;

		default:
	}
});

module.exports = CartStore;
