var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveCartData: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.CART_RECEIVE_DATA,
			cart: data
		});
	},

	changeCombAmount:function(handleData){
		AppDispatcher.dispatch({
			type: ActionTypes.CART_CHANGE_AMOUNT,
			handleData:handleData
		});
	},

	handleChecked:function(handleData){
		AppDispatcher.dispatch({
			type: ActionTypes.CART_HANDLE_CHECKED,
			handleData:handleData
		});
	},

	removeCombination:function(removeData){
		AppDispatcher.dispatch({
			type: ActionTypes.CART_REMOVE_COMBINATION,
			removeData:removeData
		});
	},

	handleFavorite:function(handleData){
		AppDispatcher.dispatch({
			type: ActionTypes.CART_FAVORITE_PRODUCT,
			handleData:handleData
		});
	},

	handleCheckedAll:function(){
		AppDispatcher.dispatch({
			type: ActionTypes.CART_CHECKED_All
		});
	}
};
