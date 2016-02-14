require('../../less/bank-card-recharge.less');

var CKFM = require('../CKFM.js');
var React = require('react');
var Modal = require('react-modal');
var Header = require('./Header.js');
var History = require('react-router').History;
var FormUtil = require('../utils/FormUtil.js');
var BankCardForm = require('./BankCardForm.js');
var BankCardFormUtil = require('../utils/BankCardFormUtil.js');
var BankCardFormStore = require('../stores/BankCardFormStore.js');

function getStateFromStores() {
	return BankCardFormStore.getData();
}

var CheckBillModal = React.createClass({
	mixins: [ History ],

	getDefaultProps: function() {
		return {
			rechargeAmount: 0,
			modalIsOpen: false,
			rechargeStatus: {
				status: false,
				reason: null
			}
		};
	},

	_handleReturnButtonClick: function(e) {
		var btnType = e.target.getAttribute("buttontype");
		BankCardFormUtil.closeModal();
		if (btnType === 'center') {
			this.history.pushState(null, '/financialaccount');
		} else {
			this.history.pushState(null, '/financialaccount/recharge');
		}
	},

	render: function() {
		var checkBillStyle = {
			overlay: {
				position: 'fixed',
				zIndex: 999,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.75)'
			},
			content: {
				position: 'absolute',
				top: '30%',
				left: '0',
				right: '0',
				height: '180px',
				marginLeft: 'auto',
				marginRight: 'auto',
				border: '1px solid #ccc',
				background: '#fff',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: '4px',
				outline: 'none',
				padding: '10px',
				width: '90%'
			}
		};

		var rechargeResult;
		var reason;

		if (this.props.rechargeStatus.status) {
			rechargeResult = (
				<div className="bank-card-recharge-result">
					<div className="bank-card-recharge-result-logo">
						<span className="icon-check-circle-o success-icon"></span><span className="success-text">{__('recharge successfully')}</span>
					</div>
					<p className="amount-text">{__('recharge amount')}: <strong>{CKFM.getCurrency()} {this.props.rechargeAmount}</strong></p>
					<button type="button" className="btn btn-primary back-to-home" data-buttontype="center" onClick={this._handleReturnButtonClick}>{__('confirm')}</button>
				</div>
			);
		} else {
			if (!this.props.rechargeStatus.reason) {
				reason = __('unknown');
			} else {
				reason = this.props.rechargeStatus.reason;
			}
			rechargeResult = (
				<div className="bank-card-recharge-result">
					<div className="bank-card-recharge-result-logo">
						<span className="icon-failed-circle-o failure-icon"></span><span className="failure-text">{__('recharge failure')}</span>
					</div>
					<p className="failure-reason">{__('reason')}: <strong>{ reason }</strong></p>

					<button type="button" className="btn btn-primary back-to-home" data-buttontype="recharge" onClick={this._handleReturnButtonClick}>{__('recharge')}</button>
				</div>
			);
		}

		return (
			<Modal isOpen={this.props.modalIsOpen} style={checkBillStyle}>
				{ rechargeResult }
			</Modal>
		);
	}
});

var BankCardRecharge = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		BankCardFormStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		BankCardFormStore.removeChangeListener(this._onChange);
	},

	handleSubmitBankCardForm: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		BankCardFormUtil.getRechargeStatus(data);
	},

	render: function() {
		var data = this.props.location.query;
		return (
      <div className="row">
				<div className="col-xs-12">
					<Header title={__('recharge')} hasSearch={false}/>
				</div>
				<div className="col-xs-12 bank-card-recharge-module">
					<div className="bank-card-recharge-amount">
						{__('recharge amount')}&nbsp;:&nbsp;
						<span className="num-text"> {data.rechargeAmount} {CKFM.getCurrency()}</span>
					</div>
					<BankCardForm
						countries={this.state.countries}
						cardType={this.state.cardType}
						handleSubmitBankCardForm={this.handleSubmitBankCardForm}
						rechargeAmount={data.rechargeAmount}
						type="recharge"/>
				</div>
				<CheckBillModal rechargeAmount={ data.rechargeAmount } modalIsOpen={ this.state.modalIsOpen } rechargeStatus={this.state.rechargeStatus}/>
      </div>
		);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}

});

module.exports = BankCardRecharge;
