var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {};
var file = {};
var _total = 0;

function _setData(d) {
	_data = d;
}

function _upLoad(d) {
	// if(!file[d.refundKey]) file[d.refundKey]={};
	file[d.i] = d.file;
}

function _setTotal(d) {
	_total = d;
}

var RefundStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		file = {};
		this.removeListener(CHANGE_EVENT, cb);
	},

	getData: function() {
		return _data;
	},

	getFile:function(){
		return file;
	},

	getTotal: function() {
		return _total;
	}

});

RefundStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
	case ActionTypes.REFUND_RECEIVE_DATA:
		
		_setData(action.data);
		RefundStore.emitChange();
		break;
	case ActionTypes.REFUND_UP_LOAD:
		
		_upLoad(action.data);
		break;
	case ActionTypes.REFUND_SET_TOTAL:
	
		_setTotal(action.data);
		RefundStore.emitChange();
	break;

	default:
	}
});

module.exports = RefundStore;