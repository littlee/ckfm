var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	err: '',
	textLength: 0,
	submitResult: false
};
function _setErrData(d) {
	_data.err = d;
}
function _setTextLengthData(d) {
	_data.textLength = d;
}
function _setSubmitResultData(d) {
	_data.submitResult = d;
}

var FeedbackStore = assign({}, EventEmitter.prototype, {
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

FeedbackStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.FEEDBACK_SUBMIT:
			if(action.category==='err')
			 {
			 	_setErrData(action.data);
			 }
			 else if (action.category==="textLength"){
			 	_setTextLengthData(action.data);
			 }
			 else
			 	_setSubmitResultData(action.data);
			FeedbackStore.emitChange();
			break;
		default:
	}
});

module.exports = FeedbackStore;
