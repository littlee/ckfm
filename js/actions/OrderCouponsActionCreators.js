var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.COUPONS_LIST_RECEIVE_DATA,
			data: data
		});
	},
	receiveSelectNum: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.COUPONS_NUM_RECEIVE_DATA,
			data: data
		});
	}
};