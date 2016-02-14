require('../../less/transaction-detail.less');

var Link = require('react-router').Link;
var React = require('react');
var Header = require('./Header.js');
var FuncUtil = require('../utils/FuncUtil.js');
var TransactionDetailUtil = require('../utils/TransactionDetailUtil.js');
var TransactionDetailStore = require('../stores/TransactionDetailStore.js');

var History = require('react-router').History;

function getStateFromStores() {
	return TransactionDetailStore.getData();
}

var Logo = React.createClass({
	render: function() {

		var style = {};

		if (this.props.transactionStatus === 1) {
			style.background = '#fca650';
		} else {
			style.background = '#f15a24';
		}

		var statusTextMap = {
			waitPay: __('waiting for payment'),
			waitSent: __('waiting for delivery'),
			waitShip: __('waiting for shipment'),
			waitConfirm: __('waiting for confirm receipt'),
			tradeSuccess: __('trade succeed'),
			disputingOrders: __('disputing orders'),
			tradeClose: __('trade closed')
		};

		return (
			<div className="col-xs-12 trim-col transaction-detail-title" style={style}>
        <span className="icon-coin transaction-detail-title-icon"></span>
        <p className="transaction-detail-title-price"> - { FuncUtil.disCountryPrice(this.props.amount) }</p>
        <p className="transaction-detail-title-status">{ statusTextMap[this.props.statusName] }</p>
      </div>
			);
	}
});

var Detail = React.createClass({
	mixins: [History],

	_handleClickOrderDetail: function() {
		this.history.pushState(null, '/orderdetail/' + this.refs.orderNum.innerHTML);
	},

	render: function() {
		return (
			<div className="col-xs-12 trim-col transaction-detail-items">
        <table className="table transaction-detail-items-table">
          <tbody>
            <tr onClick={this._handleClickOrderDetail}>
              <td><p>{__('order number')}</p></td>
							<td>:</td>
              <td><span className="transaction-detail-items-amount" ref="orderNum">{this.props.orderNum}</span><span className="transaction-detail-link-icon">&gt;&gt;</span></td>
            </tr>
						<tr>
							<td><p>{__('trading business')}</p></td>
							<td>:</td>
							<td>{this.props.business}</td>
						</tr>
            <tr>
              <td><p>{__('trade time')}</p></td>
							<td>:</td>
              <td>{this.props.tradeTime}</td>
            </tr>
          </tbody>
        </table>
        <Link to="/" className="transaction-detail-contact">{__('contact and server')} &gt;&gt; </Link>

				{ this.props.transactionStatus === 1 ? <Link to={'/orderpayment/' + this.props.orderNum} className="btn btn-primary btn-block transaction-detail-pay">{__('pay now')}</Link> : null }
      </div>
			);
	}
});

var TransactionDetail = React.createClass({
	getInitialState: function() {
		var orderNum = this.props.params.orderNum;
		TransactionDetailUtil.getData(orderNum);
		return getStateFromStores();
	},

	componentDidMount: function() {
		TransactionDetailStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		TransactionDetailStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<Header title={__('trading funds')} hasSearch={false}/>
				<div className="transaction-detail-module">
					<Logo amount={this.state.amount} transactionStatus={this.state.transactionStatus} statusName={this.state.statusName}/>
					<Detail orderNum={this.state.orderNum} payWay={this.state.payWay} business={this.state.business} tradeTime={this.state.tradeTime} transactionStatus={this.state.transactionStatus}/>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = TransactionDetail;
