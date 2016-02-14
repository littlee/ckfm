var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	addressList: null,
	selectedId: -1,
};

function _setData(d) {
	_data.addressList = d;
}
function _setSelectedId(d) {
	_data.selectedId = d;
}

var AddressManagementStore = assign({}, EventEmitter.prototype, {
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
		return _data.addressList;
	},
	getSelectedId: function() {
		return _data.selectedId;
	}
});

AddressManagementStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.ADDRESSMANAGEMENT_RECEIVE_DATA:

			_setData(action.data);
			_setSelectedId(action.selectedId);
			AddressManagementStore.emitChange();
			break;
	}
});

module.exports = AddressManagementStore;
