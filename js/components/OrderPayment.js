require('../../less/order-payment.less');

var Link = require('react-router').Link;
var CKFM = require('../CKFM.js');
var React = require('react');
var Modal = require('react-modal');
var assign = require('lodash/object/assign.js');
var Header = require('./Header.js');
var History = require('react-router').History;
var CkRadio = require('./CkRadio.js');
var FormUtil = require('../utils/FormUtil.js');
var FuncUtil = require('../utils/FuncUtil.js');
var PaymentSuccess = require('./PaymentSuccess.js');
var OrderPaymentUtil = require('../utils/OrderPaymentUtil.js');
var OrderPaymentStore = require('../stores/OrderPaymentStore.js');

function getStateFromStores() {
	return OrderPaymentStore.getData();
}

var PayBy = React.createClass({
	getInitialState: function() {
		return {
			showMsg: false
		};
	},

	componentDidMount: function() {
		var cookaAmount = this.props.cookaAmount;
		var paymentAmount = this.props.paymentAmount;
		var enoughMoney = cookaAmount > paymentAmount;
		var accountActive = this.props.accountActive;
		var passModify = this.props.passModify;

		if (!enoughMoney || !accountActive || !passModify) {
			this.setState({
				showMsg: true
			});
		}
	},

	componentWillReceiveProps: function(nextProps) {

		var cookaAmount = nextProps.cookaAmount;
		var paymentAmount = nextProps.paymentAmount;
		var enoughMoney = cookaAmount > paymentAmount;
		var accountActive = nextProps.accountActive;
		var passModify = nextProps.passModify;

		if (!enoughMoney || !accountActive || !passModify) {
			this.setState({
				showMsg: true
			})
		}
	},

	render: function() {

		/**
		 * payment
		 * 1: "Account Balance"
		 * 3: "Cash on delivery"
		 * 4: "Crediet Card"
		 */

		var paymentMap = {
			"Account Balance": __('cooka account'),
			"Crediet Card": __('credit card'),
			"Cash on delivery": __('payment offline')
		};

		var cookaAmount = this.props.cookaAmount;
		var paymentAmount = this.props.paymentAmount;
		var enoughMoney = cookaAmount > paymentAmount;
		var accountActive = this.props.accountActive;

		var paymentMethods = this.props.payBy.map(function(paymentMethod, index) {
			var text = paymentMap[paymentMethod.payment];
			var isDefaultChecked = false;
			var isDisabled = false;

			if (accountActive && enoughMoney) {
				if (paymentMethod.paymentId === 1) {
					isDefaultChecked = true;
				}
			} else {
				if (paymentMethod.paymentId === 4) {
					isDefaultChecked = true;
				}

				if (paymentMethod.paymentId === 1) {
					isDisabled = true;
					isDefaultChecked = false;
				}
			}
			if (paymentMethod.isActive) {
				var style = 'col-xs-12 order-payment-way-item';
				if (isDisabled) {
					style += ' locked';
				}
				return (
					<div className={style} key={index}>
						<CkRadio
							name="paymentId"
							text={ text }
							value={ paymentMethod.paymentId.toString() }
							defaultChecked={ isDefaultChecked }
							disabled={ isDisabled }/>
						{
							paymentMethod.payment === 'Account Balance' ?
							<div className= { enoughMoney ? 'order-payment-cooka-amount green' : 'order-payment-cooka-amount red' }>（ { FuncUtil.disCountryPrice(cookaAmount) } {CKFM.getCurrency()} ）</div>
						:
						null
					}
					</div>
					);
			} else {
				return (
					<div />
					);
			}
		});

		var showMsg = (<div />);

		if (!this.props.passModify) {
			showMsg = (
				<div className="tips">
					{__('your cooka payment password is weak, please modify as fast as possible.')}
				</div>
			);
		}
		if (!enoughMoney) {
			showMsg = (
				<div className="tips">
					{__('your cooka amount does not enough to pay this bill, could not select cooka amount to pay.')}
				</div>
			);
		}
		if (!accountActive) {
			showMsg = (
				<div className="tips">
					{__('your cooka amount was locked ,until you go to security center to unlock, then could be used.')}
				</div>
			)
		}

		return (
			<div className="form-group order-payment-way">
				{ paymentMethods }
				{ this.state.showMsg ? showMsg : null }
			</div>
		);
	}
});

var OrderPaymentForm = React.createClass({
	mixins: [History],

	propTypes: {
		accountActive: React.PropTypes.bool,
		cookaAmount: React.PropTypes.number,
		paymentAmount: React.PropTypes.number,
		payBy: React.PropTypes.array,
		paymentSerialNum: React.PropTypes.string,
		location: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			modalIsOpen: false,
			selectFormOpen: true,	// 选择支付方式表单是否关闭
			showMsg: false,
			paymentId: 4,
			showPwdErr: false
		};
	},

	openModal: function() {
		this.setState({
			modalIsOpen: true
		});
	},

	closeModal: function() {
    this.setState({
			modalIsOpen: false,
			showPwdErr: false
		});
  },

	_handlePaymentPwdForm: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		var queryItem = assign({paymentId: this.state.paymentId}, {paymentSerialNum: this.props.paymentSerialNum}, data);

		OrderPaymentUtil.getPayStatus(queryItem, function(paymentResult) {
			var result = paymentResult.result;
			if (result) {
				this.closeModal();
				this.setState({
					selectFormOpen: false
				});
			} else {
				if (!paymentResult.passwordTrue) {
					this.setState({
						showPwdErr: true
					})
				}
				if (paymentResult.passwordEnterCount >=3) {
					OrderPaymentUtil.getData({
						orderSerialnum: this.props.orderSerialnum
					});
					this.closeModal();
				}
			}
		}.bind(this));
	},

	_paySuccess: function(e) {
		this.setState({
			selectFormOpen: false
		});
	},

	_handlePaymentChoice: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		var paymentId = parseInt(data.paymentId);
		this.setState({
			paymentId: paymentId
		});

		/**
		 * payment
		 * 1: "Account Balance"
		 * 3: "Cash on delivery"
		 * 4: "Crediet Card"
		 */
		var queryItem = {};
		switch (paymentId) {
			case 1:
				this.openModal();
				break;
			case 3:
				queryItem = {
					paymentId: 3,
					paymentSerialNum: this.props.paymentSerialNum
				};
				OrderPaymentUtil.getPayStatus(queryItem, function(paymentResult) {
					var result = paymentResult.result;
					if (result) {
						this.setState({
							selectFormOpen: false
						});
					}
				}.bind(this));
				break;
			case 4:
				queryItem = {
					paymentId: 4,
					paymentAmount: this.props.paymentAmount,
					paymentSerialNum: this.props.paymentSerialNum,
					orderSerialnum: this.props.orderSerialnum
				};
				this.history.pushState(null, '/bankcardpay', queryItem);
				break;
			default:

		}
	},

	render: function() {

		var inputPwdModalStyle = {
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
				height: '200px',
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

		var amount = this.props.paymentAmount;
		amount = FuncUtil.disCountryPrice(amount);

		return (

			<div className="col-xs-12 trim-col">
				{ this.state.selectFormOpen ?
					<form className="form-horizontal order-payment-form" onSubmit={this._handlePaymentChoice}>
						<div className="form-group">
							<label className="col-xs-6 control-label f-pay-amount-label">{__('payment amount')} :</label>
							<div className="col-xs-6">
								<span className="form-control order-payment-amount-text">
									{amount} {CKFM.getCurrency()}
								</span>
							</div>
						</div>
						<div className="form-group order-payment-payby-label">
							{__('choose a payment way')}
						</div>

						<PayBy
							cookaAmount={this.props.cookaAmount}
							paymentAmount={this.props.paymentAmount}
							accountActive={this.props.accountActive}
							payBy={this.props.payBy}
							passModify={this.props.passModify}/>

						{
							this.state.showMsg ?
							<div className="form-group tips">
								{__('your cooka amount does not enough to pay this bill, could not select cooka amount to pay.')}
							</div>
							:
							null
						}
						<div className="form-group order-payment-protocol">
							{__('I have read and agree')} <Link to={`help`}>{__('the payment protocol')}</Link>
						</div>
						<div className="form-group">
							<div className="col-xs-10 col-xs-offset-1">
								<button type="submit" className="btn btn-primary btn-block">
									{__('next step')}
								</button>
							</div>
						</div>
					</form> :
					<PaymentSuccess paymentId={this.state.paymentId} orderSerialnum={this.props.orderSerialnum} location={this.props.location} paymentAmount={this.props.paymentAmount}/>
				}
			 <Modal isOpen={this.state.modalIsOpen} style={inputPwdModalStyle}>
				 <p className="order-payment-modal-title">{__('please input your payment password')}</p>
				 <form className="order-payment-password-form" onSubmit={this._handlePaymentPwdForm}>
					 <div className="form-group">
						 <input type="password" className="form-control f-payment-password" name="payPassword" placeholder={__('payment password')} required/>
					 </div>
					 <div className="form-group error-message">
						 {
							 this.state.showPwdErr ?
							 <span className="alert-danger">{__('password error')}</span>
							 :
							 null
						 }
					 </div>
					 <div className="form-group confirm-button-group">
						 <div className="col-xs-6">
							 <button type="button" className="btn btn-block" onClick={this.closeModal}>{__('cancel')}</button>
						 </div>
						 <div className="col-xs-6">
							 <button type="submit" className="btn btn-block btn-primary">{__('confirm')}</button>
						 </div>
					 </div>
				 </form>
			 </Modal>
			</div>
		);
	}
});

var OrderPayment = React.createClass({
	getInitialState: function() {
		OrderPaymentUtil.getData(this.props.params);
		return getStateFromStores();
	},

	componentDidMount: function() {
		OrderPaymentStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		OrderPaymentStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		OrderPaymentUtil.getData(nextProps.params);
	},

	render: function() {
		var errorTextMap = {
			order_has_been_paid: __('the order you requested was paid.'),
			payment_order_is_expired_or_illegal: __('payment order is expired or illegal.')
		};
		return (
			<div className="row">
				<Header title={__('order payment')}/>
				<div className="order-payment-module">
					{
						this.state.errorText == null ?
						<OrderPaymentForm
							accountActive={this.state.accountActive}
							cookaAmount={this.state.cookaAmount}
							paymentAmount={this.state.paymentAmount}
							payBy={this.state.payBy}
							paymentSerialNum={this.state.paymentSerialNum}
							location={this.props.location}
							orderSerialnum={this.props.params.orderSerialnum}
							passModify={this.state.passModify}/>
							:
							<div className="col-xs-12 trim-col">
								<div className="order-payment-bad-request">
									<div className="order-payment-bad-request-logo">
										<span className="icon-clear"></span>
									</div>
									<p className="order-payment-bad-request-tips">{__('page request fails')}</p>
									<div className="order-payment-bad-request-result">
										<span>{__('reason')}: </span>
										<span className="order-payment-bad-request-rt">{errorTextMap[this.state.errorText]}</span>
									</div>
								</div>
							</div>
					}
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = OrderPayment;
