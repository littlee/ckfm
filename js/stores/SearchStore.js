var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	history: [],
	trend: []
};

function _setData(d) {
	_data = d;
}

function _pushHistory(h) {
	_data.history.push(h);
	if (_data.history.length > 4) {
		_data.history = _data.history.slice(-4);
	}
	localStorage.setItem('ck_history', JSON.stringify(_data.history));
}

function _clearHistory() {
	_data.history = [];
	localStorage.setItem('ck_history', JSON.stringify(_data.history));
}

var SearchStore = assign({}, EventEmitter.prototype, {
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

SearchStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
	case ActionTypes.SEARCH_RECEIVE_DATA:
		_setData(action.data);
		SearchStore.emitChange();
		break;
	case ActionTypes.SEARCH_PUSH_HISTORY:
		_pushHistory(action.h);
		SearchStore.emitChange();
		break;
	case ActionTypes.SEARCH_CLEAR_HISTORY:
		_clearHistory();
		SearchStore.emitChange();
		break;
	default:
	}
});

module.exports = SearchStore;
