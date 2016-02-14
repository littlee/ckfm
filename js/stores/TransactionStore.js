var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	transaction : [],
	pageNum: 0,
	hasNextPage: false
};

function _setData(d) {
	_data.transaction = d.list;
	_data.pageNum = d.pageNum;
	_data.hasNextPage = d.hasNextPage;
}

function _concatTransaction(d) {
	var transaction = _data.transaction;
	_data.pageNum = d.pageNum;
	_data.hasNextPage = d.hasNextPage;
	_data.transaction = transaction.concat(d.list);
}

var TransactionStore = assign({}, EventEmitter.prototype, {
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

TransactionStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.TRANSACTION_RECEIVE_DATA:
			_setData(action.data);
			TransactionStore.emitChange();
			break;
		case ActionTypes.TRANSACTION_RECEIVE_NEXT_PAGE_DATA:
			_concatTransaction(action.data);
			TransactionStore.emitChange();
			break;
		default:
	}
});

module.exports = TransactionStore;
