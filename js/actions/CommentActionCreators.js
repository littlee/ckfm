var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveOrder: function(order) {
		AppDispatcher.dispatch({
			type: ActionTypes.COMMENT_RECEIVE_ORDER,
			order: order
		});
	}
};
