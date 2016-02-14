var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveStatus: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.SECURITY_RECEIVE_STATUS,
			data: data
		});
	}
};