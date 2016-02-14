var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	selectedIdS: -1,
	orderAddressJsonS: null,
	orderProductsJsonS: null,
	orderCoupons: [],
	endPrice: null,
	selectedCoupons: null
};

function _setSelectedId(id) {
	_data.selectedIdS = id;
}

function _setOrderAddressJson(data) {
	_data.orderAddressJsonS = data.addressList;
}

function _setOrderProductsJson(data) {
	_data.orderProductsJsonS = data.orderProcedureForms;
}
function _setOrderCouponsJson(data) {
	sessionStorage.setItem('orderCoupons', JSON.stringify(data));
	_data.orderCoupons = data;
	//var oo = sessionStorage.getItem('orderCoupons');
	//console.log("hhh"+JSON.stringify(oo));
}
function _setEndPrice(data) {
	_data.endPrice = data;
}
function _setCouponsNum(data) {
	_data.selectedCoupons = data;
}
var OrderSettlementStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getSelectedId: function() {
		return _data.selectedIdS;
	},

	getOrderAddressJson: function() {
		return _data.orderAddressJsonS;
	},

	getOrderProductsJson: function() {
		return _data.orderProductsJsonS;
	},

	getCouponsJson: function() {
		return _data.orderCoupons;
	},

	getEndPrice: function() {
		return _data.endPrice;
	},

	getCouponsNum: function() {
		return _data.selectedCoupons;
	}
});

OrderSettlementStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.ORDERSETTLEMENT_RECEIVE_DATA:
			_setSelectedId(action.selectedId);
			_setOrderAddressJson(action.data);
			_setOrderProductsJson(action.data);

			OrderSettlementStore.emitChange();
			break;
		case ActionTypes.ORDER_COUPONS_RECEIVE_DATA:
			_setOrderCouponsJson(action.data);
			OrderSettlementStore.emitChange();
			break;
		case ActionTypes.END_PRICE_RECEIVE_DATA:
			_setEndPrice(action.data);
			OrderSettlementStore.emitChange();
			break;
		case ActionTypes.COUPONS_SELECT_RECEIVE_DATA:
			_setCouponsNum(action.data);
			OrderSettlementStore.emitChange();
			break;
		default:
	}
});

module.exports = OrderSettlementStore;
