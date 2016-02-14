var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	orderNum : 12334,
	amount: 10000,
	business: 'COOKA自营',
	payWay: '线下支付',
	tradeTime: '2015-09-04 16:00',
	transactionStatus: 80,
	statusName: '成功'
};

function _setData(d) {
	var orderListForm = d.orderListForm;
	_data.orderNum = orderListForm.orderSerialnum;
	_data.amount = orderListForm.priceBefore;
	_data.tradeTime = orderListForm.createTimeString;
	_data.transactionStatus = orderListForm.status;
	_data.statusName = orderListForm.statusName;
}

var TransactionDetailStore = assign({}, EventEmitter.prototype, {
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

TransactionDetailStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.TRANSACTION_DETAIL_RECEIVE_DATA:
			_setData(action.data);
			TransactionDetailStore.emitChange();
			break;
		default:
	}
});

module.exports = TransactionDetailStore;
