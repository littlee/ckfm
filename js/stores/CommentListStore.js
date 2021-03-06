var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	list: [],
	pageNum: -1
};

function _setData(d) {
	_data = d;
}

function _concatList(d) {
	var oldList = _data.list;
	_data = d;
	_data.list = oldList.concat(d.list);
}

var CommentListStore = assign({}, EventEmitter.prototype, {
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

CommentListStore.dispatchToken = AppDispatcher.register(function(action) {
	// console.log(action);
	switch (action.type) {
	case ActionTypes.COMMENT_LIST_RECEIVE_DATA:
		
		_setData(action.data);

		CommentListStore.emitChange();
		break;

	case ActionTypes.COMMENT_LIST_RECEIVE_NEXT_PAGE_DATA:
		
		_concatList(action.data);

		CommentListStore.emitChange();
		break;
	default:
	}
});

module.exports = CommentListStore;