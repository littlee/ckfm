var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.SEARCH_RECEIVE_DATA,
			data: data
		});
	},

	pushHistory: function(h) {
		AppDispatcher.dispatch({
			type: ActionTypes.SEARCH_PUSH_HISTORY,
			h: h
		});
	},

	clearHistory: function() {
		AppDispatcher.dispatch({
			type: ActionTypes.SEARCH_CLEAR_HISTORY
		});
	}
};