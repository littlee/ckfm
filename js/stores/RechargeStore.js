var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	message : '',
	balance: 0
};

function _setMessage(d) {
	_data.message = d;
}

function _setData(d) {
	_data.balance = d.balance;
}

var RechargeStore = assign({}, EventEmitter.prototype, {
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

RechargeStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.RECHARGE_RECEIVE_MESSAGE:
			_setMessage(action.message);
			RechargeStore.emitChange();
			break;
		case ActionTypes.RECHARGE_RECEIVE_DATA:
			_setData(action.data);
			RechargeStore.emitChange();
			break;
		default:
	}
});

module.exports = RechargeStore;
