require('../../less/recharge.less');

var CKFM = require('../CKFM.js');
var Modal = require('react-modal');
var React = require('react');
var Header = require('./Header.js');
var History = require('react-router').History;
var FormUtil = require('../utils/FormUtil.js');
var RechargeStore = require('../stores/RechargeStore.js');
var LinkedStateMixin = require('react/lib/LinkedStateMixin');

function getStateFromStores() {
	return RechargeStore.getData();
}

var FormBox = React.createClass({
	mixins: [LinkedStateMixin, History],
	getInitialState: function() {
		/**
		 * paymentId 为支付方式
		 * 1: cooka 帐号支付
		 * 3: 线下支付
		 * 4: 信用卡
		 */
		return {
			paymentId: 4,
			modalIsOpen: false
		};
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		this.history.pushState(null, '/bankcardrecharge', data);
	},

	openModal: function() {
		this.setState({
			modalIsOpen: true
		});
	},

	closeModal: function() {
		this.setState({
			modalIsOpen: false
		});
	},

	_handleFocus: function(e) {
		this.refs.rechargeAmount.focus();
	},

	_handleSelectRechargeWay: function(e) {
		var selectWay = parseInt(e.target.getAttribute('data-paymentid'));
		if (this.state.paymentId !== selectWay) {
			this.setState({
				paymentId: selectWay
			});
		}
		this.closeModal();
	},

	render: function() {
		var amountArr, start;
		var amountString = this.props.balance.toString();
		var amount = amountString;
		if (amountString.length > 3) {
			amountArr = amountString.split('');
			start = amountArr.length - 3;
			amountArr.splice(start, 0, '.');
			amount = amountArr.join('');
		}

		var rechargeWay;

		switch (this.state.paymentId) {
			case 4:
				rechargeWay = __('credit card');
				break;
			default:
				rechargeWay = __('unknown');
		}

		var selectRechargeWayStyle = {
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
				height: '168px',
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
			<div className="recharge-form-box">
				<div className="recharge-form-current-balance">
					{__('current balance')}&nbsp;:&nbsp;
					<span className="num-text">{ amount } {CKFM.getCurrency()}</span>
				</div>
				<div className="col-xs-12">
					<form className="form-horizontal amount-input-form" onSubmit={this._handleSubmit}>
						<input type="hidden" name="paymentId" valueLink={this.linkState('paymentId')}></input>
						<div className="form-group" onClick={this._handleFocus}>
							<label className="col-xs-4 control-label f-recharge-amount-label">{__('recharge money')} :</label>
							<div className="col-xs-8">
								<div className="f-recharge-amount-input">
									<input type="number" name="rechargeAmount" className="form-control f-recharge-amount" ref="rechargeAmount" placeholder="0.00" min="1000" required/>
								</div>
							</div>
						</div>
						<div className="form-group" onClick={this.openModal}>
							<label className="col-xs-4 control-label f-payment-option-label">{__('recharge way')} :</label>
							<div className="col-xs-7">
								<span className="form-control text">{ rechargeWay }</span>
							</div>
							<div className="col-xs-1 forward-icon">
								<span className="icon-forward-arrow"></span>
							</div>
						</div>

						<div className="form-group">
							<div className="col-xs-10 col-xs-offset-1">
								<button type="submit" className="btn btn-primary btn-block">
									{__('next step')}
								</button>
							</div>
						</div>
					</form>

					<Modal isOpen={this.state.modalIsOpen} style={selectRechargeWayStyle}>
						<div className="recharge-way-selection">
							<span className="icon-close close-modal-button" onClick={this.closeModal}></span>
							<div className="recharge-way-items">
								<p className="tips">{__('choose a recharge way')}</p>
								<button type="button" data-paymentid="4" className="btn btn-primary center-block recharge-way-item" onClick={this._handleSelectRechargeWay}>{__('credit card')}</button>
								<button type="button" data-paymentid="2" className="btn btn-primary center-block recharge-way-item" onClick={this._handleSelectRechargeWay}>{__('test')}</button>
							</div>
						</div>
					</Modal>
				</div>
			</div>
			);
	}
});

var Recharge = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		RechargeStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		RechargeStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('recharge')} hasSearch={false}/>
				</div>
				<div className="recharge-module">
					<FormBox balance={this.state.balance}/>
				</div>
      </div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Recharge;
