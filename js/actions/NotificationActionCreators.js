var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.NOTIFICATION_RECEIVE_DATA,
			data: data
		});
	},

	receiveNextPageData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.NOTIFICATION_RECEIVE_NEXT_PAGE_DATA,
			data: data
		});
	}
};