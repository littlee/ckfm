var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveMessage: function(message) {
		AppDispatcher.dispatch({
			type: ActionTypes.RECHARGE_RECEIVE_MESSAGE,
			message: message
		});
	},
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.RECHARGE_RECEIVE_DATA,
			data: data
		});
	}
};
