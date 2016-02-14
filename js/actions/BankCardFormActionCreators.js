var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveCountries: function(countries) {
		AppDispatcher.dispatch({
			type: ActionTypes.BANK_CARD_FORM_RECEIVE_COUNTRIES,
			countries: countries
		});
	},
	receiveCardType: function(cardType) {
		AppDispatcher.dispatch({
			type: ActionTypes.BANK_CARD_FORM_RECEIVE_CARD_TYPE,
			cardType: cardType
		});
	},
	receiveRechargeStatus: function(rechargeStatus) {
		AppDispatcher.dispatch({
			type: ActionTypes.BANK_CARD_FORM_RECEIVE_RECHARGE_STATUS,
			rechargeStatus: rechargeStatus
		});
	},
	receivePaymentStatus: function(paymentStatus) {
		AppDispatcher.dispatch({
			type: ActionTypes.BANK_CARD_FORM_RECEIVE_PAYMENT_STATUS,
			paymentStatus: paymentStatus
		});
	},
	receiveModalIsOpen: function(modalIsOpen) {
		AppDispatcher.dispatch({
			type: ActionTypes.BANK_CARD_FORM_RECEIVE_MODAL_IS_OPEN,
			modalIsOpen: modalIsOpen
		});
	}
};
