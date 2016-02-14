var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTDETAIL_RECEIVE_DATA,
			data: data
		});
	},
	receiveUser: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTDETAIL_RECEIVE_USER,
			user: data
		});
	},
	receiveCollected: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTDETAIL_RECEIVE_COLLECTED,
			collected: data
		});
	},
	receiveIntroduction: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTDETAIL_RECEIVE_INTRODUCTION,
			introduction: data
		});
	},
	receiveComment: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTDETAILCOMMENT_RECEIVE_DATA,
			comment: data
		});
	},
	receiveRecommend: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTRECOMMEND_RECEIVE_DATA,
			recommend: data
		});
	},
	changeCombAmount:function(data,combId) {
		AppDispatcher.dispatch({
			type: ActionTypes.PRODUCTDETAIL_CHANGE_COMBAMOUNT,
			combAmount: data,
			combId:combId
		});
	}
};
