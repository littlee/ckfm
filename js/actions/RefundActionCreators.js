var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.REFUND_RECEIVE_DATA,
			data: data
		});
	},
	upLoad: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.REFUND_UP_LOAD,
			data: data
		});
	},
	setTotal: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.REFUND_SET_TOTAL,
			data: data
		});
	}
};