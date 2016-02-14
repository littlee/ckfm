var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	securityStatus: null
};

function _setStatus(d) {
	_data.securityStatus = d;
}

var AccountSecurityStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getStatus: function() {
		return _data.securityStatus;
	}
});

AccountSecurityStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.SECURITY_RECEIVE_STATUS:
			_setStatus(action.data);
			AccountSecurityStore.emitChange();
			break;
		default:
	}
});

module.exports = AccountSecurityStore;