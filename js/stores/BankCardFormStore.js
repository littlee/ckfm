var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	countries : [],
	cardType: 'unknown',
	rechargeStatus: {
		status: false,
		reason: null
	},
	paymentStatus: {
		status: false,
		reason: null
	},
	modalIsOpen: false
};

function _setCountry(d) {
	_data.countries = d;
}

function _setCardType(d) {
	_data.cardType = d.cardType;
}

function _setRechargeStatus(d) {
	_data.rechargeStatus = d;
	_data.modalIsOpen = true;
}

function _setPaymentStatus(d) {
	_data.paymentStatus = d;
	if (_data.paymentStatus.result === false) {
		_data.modalIsOpen = true;
	}
}

function _setModalIsOpen(d) {
	_data.modalIsOpen = d.modalIsOpen;
	_data.cardType = 'unknown';
}

var BankCardFormStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getData: function() {
		return _data;
	}
});

BankCardFormStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.BANK_CARD_FORM_RECEIVE_COUNTRIES:
			_setCountry(action.countries);
			BankCardFormStore.emitChange();
			break;
		case ActionTypes.BANK_CARD_FORM_RECEIVE_CARD_TYPE:
			_setCardType(action.cardType);
			BankCardFormStore.emitChange();
			break;
		case ActionTypes.BANK_CARD_FORM_RECEIVE_RECHARGE_STATUS:
			_setRechargeStatus(action.rechargeStatus);
			BankCardFormStore.emitChange();
			break;
		case ActionTypes.BANK_CARD_FORM_RECEIVE_PAYMENT_STATUS:
			_setPaymentStatus(action.paymentStatus);
			BankCardFormStore.emitChange();
			break;
		case ActionTypes.BANK_CARD_FORM_RECEIVE_MODAL_IS_OPEN:
			_setModalIsOpen(action.modalIsOpen);
			BankCardFormStore.emitChange();
			break;
		default:
	}
});

module.exports = BankCardFormStore;
