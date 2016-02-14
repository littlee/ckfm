var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveType: function(type,typeOne) {
		AppDispatcher.dispatch({
			type: ActionTypes.SECURITYCOMMON_RECEIVE_TYPE,
			dataType: type,
			dataTypeOne: typeOne
		});
	},
	receiveStep: function(step) {
		AppDispatcher.dispatch({
			type: ActionTypes.SECURITYCOMMON_RECEIVE_STEP,
			data: step
		});
	},
	receiveSecurityAns: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.SECURITYCOMMON_SECURITYANS,
			data: data
		});
	},
	receiveSubmitResult: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.SECURITYCOMMON_SUBMITRESULT,
			data: data
		});
	},
	receiveErr: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.SECURITYCOMMON_ERR,
			data: data
		});
	}
};
