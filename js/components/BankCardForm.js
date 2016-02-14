require('../../less/bank-card-form.less');

var React = require('react');
var BankCardFormUtil = require('../utils/BankCardFormUtil.js');

var BankCardForm = React.createClass({
	getInitialState: function() {
		return {
			cardNumLength: 0
		};
	},

	getDefaultProps: function() {
		return {
			paymentId: 4,
			countries: [],
			rechargeAmount: 0,
			type: 'recharge'
		};
	},

	_handleCardNumInput: function(e) {
		var cardNum = e.target.value.toString();
		if (cardNum.length > 10) {
			BankCardFormUtil.getCardType(parseInt(cardNum));
		}
		this.setState({
			cardNumLength: cardNum.length
		});
	},

	render: function() {
		var countries = this.props.countries.map(function (country) {
			return (
				<option value={country.countryCode} key={country.countryId}>{country.country}</option>
			);
		});

		var cardIcon = (
			<span className="icon-bind-card"></span>
		);

		switch (this.props.cardType) {
			case 'error':
				cardIcon = (
					<span className="exception">{__('your card could not be verified')}</span>
				);

				if (this.state.cardNumLength < 11) {
					cardIcon = (
						<span className="icon-bind-card"></span>
					);
				}
				break;
			case 'unknown':
				break;
			case 'UnionPay':
			case 'JCB':
			case 'Mastercard':
			case 'Visa':
				var dir = '../../images/pay/' + this.props.cardType + '.png';
				cardIcon = (
					<img src={dir}/>
				);
				break;
			default:
		}

		return (
			<div className="bank-card-form">
				<form className="form-horizontal" onSubmit={this.props.handleSubmitBankCardForm}>
					<div className="form-group">
						<div className="col-xs-12 card-icon">
							{cardIcon}
						</div>
					</div>
					<div className="form-group">
						<label className="control-label">{__('country')}</label>
						<span className="colon">&nbsp;:&nbsp;</span>
						<div className="col-xs-8">
							<select name="countryCode" className="form-control" required>
								{countries}
							</select>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label">{__('bank')}</label>
						<span className="colon">&nbsp;:&nbsp;</span>
						<div className="col-xs-8">
							<input type="text" name="issuer" className="form-control" required/>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label">{__('card number')}</label>
						<span className="colon">&nbsp;:&nbsp;</span>
						<div className="col-xs-8">
							<input type="text" ref="cardNum" pattern="[0-9]{16}" maxLength="16" name="cardNum" onChange={this._handleCardNumInput} className="form-control" required/>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label">{__('cardholder')}</label>
						<span className="colon">&nbsp;:&nbsp;</span>
						<div className="col-xs-8">
							<input type="text" name="cardholder" className="form-control" required/>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label">{__('expire time')}</label>
						<span className="colon">&nbsp;:&nbsp;</span>
						<div className="col-xs-8">
							<input type="month" name="date" className="form-control" required/>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label">C V V</label>
						<span className="colon">&nbsp;:&nbsp;</span>
						<div className="col-xs-8">
							<input type="text" name="csc" className="form-control" pattern="[0-9]{3}" maxLength="3" required/>
						</div>
					</div>

					{/*充值*/}
					{
						this.props.type === 'recharge' ?
						<div>
							<input type="hidden" name="paymentId" defaultValue={this.props.paymentId}></input>
							<input type="hidden" name="cardType" value={this.props.cardType}></input>
							<input type="hidden" name="money" defaultValue={this.props.rechargeAmount}></input>
						</div>
						:
						null
					}

					{/*支付*/}
					{
						this.props.type === 'pay' ?
						<div>
							<input type="hidden" name="paymentId" defaultValue={this.props.paymentId}></input>
							<input type="hidden" name="cardType" value={this.props.cardType}></input>
							<input type="hidden" name="paymentSerialNum" value={this.props.paymentSerialNum}></input>
						</div>
						:
						null
					}

					<div className="form-group">
						<button type="submit" className="btn btn-primary col-xs-10 col-xs-offset-1">
							{__('next step')}
						</button>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = BankCardForm;
