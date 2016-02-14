var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _order = {};

function _setOrder(d) {
	_order = d;
}


var CommentStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getOrder: function() {
		return _order;
	},

});

CommentStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {

		case ActionTypes.COMMENT_RECEIVE_ORDER:			
			_setOrder(action.order);
			CommentStore.emitChange();
			break;

		default:
	}
});

module.exports = CommentStore;