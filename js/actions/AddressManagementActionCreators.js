var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data,id) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADDRESSMANAGEMENT_RECEIVE_DATA,
			data: data,
			selectedId: id
		});
	}
};