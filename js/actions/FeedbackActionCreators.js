var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	submitFeedback: function(data,category) {
		AppDispatcher.dispatch({
			type: ActionTypes.FEEDBACK_SUBMIT,
			data: data,
			category: category
		});
	}
};