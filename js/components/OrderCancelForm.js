require('../../less/order-cancel.less');
var React = require('react');

var FormUtil = require('../utils/FormUtil.js');
var OrderListUtil = require('../utils/OrderListUtil.js');

var ErrMsg = React.createClass({
	render: function() {
		var errMsgMap = {
			'empty_reason': __('reason is required'),
			'cancelFail': __('order cancel failed')
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

	componentDidMount: function() {
		console.log('order cancel form', this.props);
	},

	render: function() {
		return (
			<form onSubmit={this._handleCancelOrder}>
				<h3 className="text-center">{__('cancel order')}</h3>
				<input type="hidden" name="orderSerialnum" value={this.props.currentOSN} />
				<div className="form-group">
					<select name="reason" className="form-control" required>
						<option value="">{__('please choose a reason')}</option>
						<option value="i_have_found_another_better">{__('I\'ve found another better')}</option>
						<option value="i_do_not_want_it_any_more">{__('I don\'t want it any more')}</option>
						<option value="high_price_of_the_item">{__('high price of the item')}</option>
						<option value="delivery_address_or_method_needs_changing">{__('delivery information needs changing')}</option>
						<option value="payment_failed">{__('payment failed')}</option>
						<option value="false_or_repetitive_order">{__('wrong or repetitive order')}</option>
						<option value="high_delivery_cost">{__('high delivery cost')}</option>
						<option value="other">{__('other reasons')}</option>
					</select>
				</div>
				<ErrMsg err={this.state.err} />
				<div className="form-group order-cancel-btns">
					<button type="button" className="btn btn-default btn-rect" onClick={this.props._closeModal}>
						{__('back')}
					</button>
					<button type="submit" className="btn btn-primary btn-rect">
						{__('confirm')}
					</button>
				</div>
			</form>
			);
	},

	_handleCancelOrder: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.reason) {
			this.setState({
				err: 'empty_reason'
			});
			return false;
		}

		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					err: 'empty_reason'
				});
				return false;
			}
		}

		OrderListUtil.cancelOrder(data, function(res) {

			if (res.result === 'cancelSuccess') {
				if (this.props.cancelSuccess && typeof this.props.cancelSuccess === 'function') {
					this.props.cancelSuccess();
				}
				return false;
			}

			this.setState({
				err: res.result
			});
			return false;

		}.bind(this));

		return false;
	}
});

module.exports = OrderCancelForm;