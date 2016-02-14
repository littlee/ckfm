var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	editJson: null,
	err: ''
};

function _setEditJson(d) {
	_data.editJson = d;
}
function _changeEditJson(data,type,levelValue) {
	if (data!==null) {
		var level = data.name;
		var index = null;

		switch(level) {
			case "state":
				index = 1;
				_data.editJson.state=null;
				break;
			case "city":
				index = 2;
				_data.editJson.city=null;
				break;
			case "region":
				index = 3;
				_data.editJson.region=null;
				break;
		}
		_data.editJson[type]=levelValue;
		_data.editJson.address[index] = data;
		for(var i=index+1;i<=3;i++) {
			if (_data.editJson.address[i]) {
				_data.editJson.address[i] = {};
			}
		}
	}
	
	else {
		_data.editJson["region"] = levelValue;
	}
}
function _setErr(d) {
	_data.err = d;
}
var EditAddressListStore = assign({}, EventEmitter.prototype, {
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
		return _data.editJson;
	},
	getErr: function() {
		return _data.err;
	}
});

EditAddressListStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.EDITADDRESSLIST_DATA:
			_setEditJson(action.data);
			EditAddressListStore.emitChange();
			break;
		case ActionTypes.EDITADDRESSLISTCHANGE_DATA:
			_changeEditJson(action.data,action.category,action.levelValue);
			EditAddressListStore.emitChange();
			break;
		case ActionTypes.EDIT_ADDRESSLIST_SUBMIT:
			_setErr(action.data);
		EditAddressListStore.emitChange();
		break;
		default:
	}
});

module.exports = EditAddressListStore;
