var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	collectedFolder : []
};

function _setData(d) {
	_data.collectedFolder = d;
}

var CollectedFolderStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getCollectedFolder: function() {
		return _data;
	}
});

CollectedFolderStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.COLLECTED_FOLDER_RECEIVE_DATA:
			_setData(action.data);
			CollectedFolderStore.emitChange();
			break;
		default:
	}
});

module.exports = CollectedFolderStore;
