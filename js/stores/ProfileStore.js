var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	image: '',
	name: '',
	gender: '',
	country: '',
	state: '',
	city: '',
	region: '',
	addrDetail: '',
	addrCount: 0
};

function _setData(d) {
	_data = d;
}

function _setName(n) {
	_data.name = n;
}
function _setGender(g) {
	_data.gender = g;
}
function _setLocation(loc) {
	_data.country = loc.country;
	_data.state = loc.state;
	_data.city = loc.city;
	_data.region = loc.region;
	_data.addrDetail = loc.addrDetail;
}

var ProfileStore = assign({}, EventEmitter.prototype, {
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

ProfileStore.dispatchToken = AppDispatcher.register(function(action) {
	// console.log(action);
	switch (action.type) {
	case ActionTypes.PROFILE_RECEIVE_DATA:
		_setData(action.data);
		ProfileStore.emitChange();
		break;
	case ActionTypes.PROFILE_MODIFY_NAME:
		_setName(action.name);
		ProfileStore.emitChange();
		break;
	case ActionTypes.PROFILE_MODIFY_GENDER:
		_setGender(action.gender);
		ProfileStore.emitChange();
		break;
	case ActionTypes.PROFILE_MODIFY_LOCATION:
		_setLocation(action.location);
		ProfileStore.emitChange();
		break;
	default:
	}
});

module.exports = ProfileStore;