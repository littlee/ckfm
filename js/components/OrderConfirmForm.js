require('../../less/order-cancel.less');
var React = require('react');

var FormUtil = require('../utils/FormUtil.js');
var OrderListUtil = require('../utils/OrderListUtil.js');

var ErrMsg = React.createClass({
	render: function() {
		var errMsgMap = {
			'empty_pay_password': __('pay password is required'),
			'account_not_active': __('account is inactive, you can activate it in finance center'),
			'invalid_pay_password': __('invalid pay password'),
			'invalid_order_number': __('invalid order number'),
			'should_deal_with_dispute_first': __('this order is in dispute, you should deal with it first'),
			'the_current_order_can_not_be_confirmed': __('confirm failed')
		};
		var show = this.props.err.length > 0;

		if (!show) {
			return null;
		}

		return (
			<div className="alert alert-danger">
				{errMsgMap[this.props.err]}
			</div>
		);
	}
});

var OrderCancelForm = React.createClass({

	getInitialState: function() {
		return {
			err: ''
		};
	},

	render: function() {
		return (
			<form onSubmit={this._handleConfirmReceive} noValidate>
				<h3 className="text-center">{__('confirm receipt')}</h3>
				<input type="hidden" name="orderSerialNum" value={this.props.currentOSN} />
				<div className="form-group">
					<input type="password" className="form-control" name="payPassword" placeholder={__('pay password')} required/>
				</div>
				<ErrMsg err={this.state.err} />
				<div className="form-group order-cancel-btns">
					<button type="button" className="btn btn-default btn-rect" onClick={this.props._closeModal}>
						{__('cancel')}
					</button>
					<button type="submit" className="btn btn-primary btn-rect">
						{__('confirm')}
					</button>
				</div>
			</form>
			);
	},

	_handleConfirmReceive: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.payPassword) {
			this.setState({
				err: 'empty_pay_password'
			});
			return false;
		}

		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					err: 'empty_pay_password'
				});
				return false;
			}
		}

		OrderListUtil.confirmReceive(data, function(res) {

			if (!res.accountActive) {
				this.setState({
					err: 'account_not_active'
				});
				return false;
			}

			if (!res.passwordValid) {
				this.setState({
					err: 'invalid_pay_password'
				});
				return false;
			}

			if (!res.result) {
				this.setState({
					err: res.reason
				});
				return false;
			}

			if (this.props.confirmSuccess && typeof this.props.confirmSuccess === 'function') {
				this.props.confirmSuccess();
			}

			return false;

		}.bind(this));

		return false;
	}
});

module.exports = OrderCancelForm;