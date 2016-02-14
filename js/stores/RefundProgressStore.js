var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {};

function _setData(d) {
	_data = d;
}

var RefundProgressStore = assign({}, EventEmitter.prototype, {
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
	}

});

RefundProgressStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
	case ActionTypes.REFUND_RECEIVE_DATA:
		
		_setData(action.data);
		RefundProgressStore.emitChange();
		break;

	default:
	}
});

module.exports = RefundProgressStore;