var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	getData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.EDITADDRESSLIST_DATA,
			data: data
		});
	},
	changeData: function(data,type,levelValue) {
		AppDispatcher.dispatch({
			type: ActionTypes.EDITADDRESSLISTCHANGE_DATA,
			data: data,
			category: type,
			levelValue: levelValue
		});
	},
	submitEditAddress: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.EDIT_ADDRESSLIST_SUBMIT,
			data: data
		});
	}
};