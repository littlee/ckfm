var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	type: null,
	step: "1",
	typeOne: "",
	securityAns: true,
	submitResult: true,
	err: ""
};

function _setType(d) {
	_data.type = d;
}
function _setStep(d) {
	_data.step = d;
}
function _setTypeOne(d) {
	_data.typeOne = d;
}
function _setSecurityAns(d) {
	_data.securityAns = d;
}
function _setSubmitResult(d) {
	_data.submitResult = d;
}
function _setErr(d) {
	_data.err = d;
}
var SecurityCommonStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getType: function() {
		return _data.type;
	},
	getStep: function() {
		return _data.step;
	},
	getTypeOne: function() {
		return _data.typeOne;
	},
	getSecurityAns: function() {
		return _data.securityAns;
	},
	getSubmitResult: function() {
		return _data.submitResult;
	},
	getErr: function() {
		return _data.err;
	}
});

SecurityCommonStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.SECURITYCOMMON_RECEIVE_TYPE:
			_setType(action.dataType);
			_setTypeOne(action.dataTypeOne);
			SecurityCommonStore.emitChange();
			break;
		case ActionTypes.SECURITYCOMMON_RECEIVE_STEP:
			_setStep(action.data);
			SecurityCommonStore.emitChange();
			break;
		case ActionTypes.SECURITYCOMMON_SECURITYANS:
			_setSecurityAns(action.data);
			SecurityCommonStore.emitChange();
		break;
		case ActionTypes.SECURITYCOMMON_SUBMITRESULT:
			_setSubmitResult(action.data);
			SecurityCommonStore.emitChange();
		break;
		case ActionTypes.SECURITYCOMMON_ERR:
			_setErr(action.data);
			SecurityCommonStore.emitChange();
		break;
	default:
	}
});

module.exports = SecurityCommonStore;
