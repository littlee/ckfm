var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	"paymentSerialNum": "14528297343191616",
  "paymentAmount": 0,
  "cookaAmount": 0,
	"payBy": [],
	"accountActive": true,
	'errorText': '',
	"passModify": false
};

function _setData(d) {
	_data.errorText = d.errorText;
	if (d.errorText === null) {
		_data.paymentAmount = d.totalPrice;
		_data.cookaAmount = d.balance;
		_data.paymentSerialNum = d.paymentSerialNum;
		_data.payBy = d.onlinePayments.concat(d.otherPayments);
		_data.accountActive = d.accountActive;
		_data.passModify = d.passModify;
	}
}

var OrderPaymentStore = assign({}, EventEmitter.prototype, {
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

OrderPaymentStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.ORDER_PAYMENT_RECEIVE_DATA:
			_setData(action.data);
			OrderPaymentStore.emitChange();
			break;
		default:
	}
});

module.exports = OrderPaymentStore;
