var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	carousel: null,
	f1: null,
	f2: null,
	f3: null,
	f4: null,
	f5: null,
	f6: null,
	f7: null
};

function _setData(d) {
	_data = d;
}

var HomeStore = assign({}, EventEmitter.prototype, {
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

HomeStore.dispatchToken = AppDispatcher.register(function(action) {
	// console.log(action);
	switch (action.type) {
	case ActionTypes.HOME_RECEIVE_DATA:
		
		_setData(action.data);

		HomeStore.emitChange();
		break;
	default:
	}
});

module.exports = HomeStore;