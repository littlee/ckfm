var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.CATEGORY_RECEIVE_DATA,
			data: data
		});
	},

	changeActive: function(index) {
		AppDispatcher.dispatch({
			type: ActionTypes.CATEGORY_CHANGE_ACTIVE,
			index: index
		});
	}
};