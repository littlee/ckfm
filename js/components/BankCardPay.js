require('../../less/bank-card-pay.less');

var CKFM = require('../CKFM.js');
var Link = require('react-router').Link;
var React = require('react');
var Modal = require('react-modal');
var Header = require('./Header.js');
var History = require('react-router').History;
var FormUtil = require('../utils/FormUtil.js');
var FuncUtil = require('../utils/FuncUtil.js');
var BankCardForm = require('./BankCardForm.js');
var PaymentSuccess = require('../components/PaymentSuccess.js');
var BankCardFormUtil = require('../utils/BankCardFormUtil.js');
var BankCardFormStore = require('../stores/BankCardFormStore.js');

function getStateFromStores() {
	return BankCardFormStore.getData();
}

var PaymentCheckModal = React.createClass({
	mixins: [ History ],

	getDefaultProps: function() {
		return {
			modalIsOpen: false,
			paymentStatus: {
				status: false,
				reason: null
			}
		};
	},

	// responsive modal https://github.com/rackt/react-modal/issues/62

	render: function() {
		var paymentCheckModalStyle = {
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
				height: '230px',
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

		return (
			<Modal isOpen={this.props.modalIsOpen} style={paymentCheckModalStyle}>
				<div className="bank-card-pay-result">
					<div className="bank-card-pay-result-logo">
						<span className="icon-failed-circle-o failure-icon"></span><span className="failure-text">{__('payment failure')}</span>
					</div>
					<p className="amount-text">{__('payment amount')}: <strong>{CKFM.getCurrency()} {FuncUtil.disCountryPrice(this.props.paymentAmount)}</strong></p>
					<p className="failure-reason">{__('reason')}: <strong>{ this.props.paymentStatus.reason }</strong></p>
					<Link to={'/orderpayment/' + this.props.orderSerialnum} className="btn btn-primary back-to-repay">{__('pay again')}</Link>
				</div>
			</Modal>
		);
	}
});

var BankCardPay = React.createClass({
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
		BankCardFormUtil.getPaymentStatus(data);
	},

	render: function() {

		var data = this.props.location.query;

		var paymentStatus;

		if (this.state.paymentStatus.status === true) {
			paymentStatus = true;
		} else {
			paymentStatus = false;
		}

		return (
      <div className="row">
				<div className="col-xs-12">
					<Header title={__('order payment')}/>

				</div>
				<div className="col-xs-12 bank-card-pay-module">
				{
					!paymentStatus ?
					<div>
						<div className="bank-card-pay-amount">
							{__('payment amount')}&nbsp;:&nbsp;
							<span className="num-text"> {FuncUtil.disCountryPrice(data.paymentAmount)} {CKFM.getCurrency()}</span>
						</div>
						<BankCardForm
							countries={this.state.countries}
							cardType={this.state.cardType}
							handleSubmitBankCardForm={this.handleSubmitBankCardForm}
							paymentAmount={data.paymentAmount}
							paymentSerialNum={data.paymentSerialNum}
							type="pay"/>
					</div>
					:
					<PaymentSuccess paymentId={4} paymentAmount={data.paymentAmount} orderSerialnum={data.orderSerialnum}/>
				}
				</div>
				<PaymentCheckModal
					paymentAmount={data.paymentAmount}
					modalIsOpen={this.state.modalIsOpen}
					paymentStatus={this.state.paymentStatus}
					orderSerialnum={data.orderSerialnum}/>
      </div>
		);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}

});

module.exports = BankCardPay;
