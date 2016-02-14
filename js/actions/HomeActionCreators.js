var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.HOME_RECEIVE_DATA,
			data: data
		});
	}
};