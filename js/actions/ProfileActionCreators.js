var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PROFILE_RECEIVE_DATA,
			data: data
		});
	},

	modifyUsername: function(n) {
		AppDispatcher.dispatch({
			type: ActionTypes.PROFILE_MODIFY_NAME,
			name: n
		});
	},

	modifyGender: function(g) {
		AppDispatcher.dispatch({
			type: ActionTypes.PROFILE_MODIFY_GENDER,
			gender: g
		});
	},

	modifyLocation: function(loc) {
		AppDispatcher.dispatch({
			type: ActionTypes.PROFILE_MODIFY_LOCATION,
			location: loc
		});
	}
};