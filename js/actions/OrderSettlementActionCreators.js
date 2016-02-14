var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveData: function(data,selectedId) {
		AppDispatcher.dispatch({
			type: ActionTypes.ORDERSETTLEMENT_RECEIVE_DATA,
			data: data,
			selectedId: selectedId
		});
	},
	receiveCoupons: function(coupons) {
		AppDispatcher.dispatch({
			type: ActionTypes.ORDER_COUPONS_RECEIVE_DATA,
			data: coupons
		});
	},
	setEndPrice: function(price) {
		AppDispatcher.dispatch({
			type: ActionTypes.END_PRICE_RECEIVE_DATA,
			data: price
		});
	},
	receiveCouponsNum: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.COUPONS_SELECT_RECEIVE_DATA,
			data: data
		});
	}
};
