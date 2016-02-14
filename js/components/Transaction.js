require('../../less/transaction.less');

var CKFM = require('../CKFM.js');
var React = require('react');
var assign = require('lodash/object/assign.js');
var Header = require('./Header.js');
var History = require('react-router').History;
var ScrollLoad = require('../components/ScrollLoad.js');
var TransactionUtil = require('../utils/TransactionUtil.js');
var TransactionStore = require('../stores/TransactionStore.js');
var TransactionActionCreators = require('../actions/TransactionActionCreators.js');

function getStateFromStores() {
	return TransactionStore.getData();
}

var TableTitle = React.createClass({
	render: function() {
		return (
			<div className="transaction-table-title">
				<div className="transaction-table-title-item">
					{__("trade time")}
				</div>
				<div className="transaction-table-title-item">
					{__("trade amount")}
				</div>
				<div className="transaction-table-title-item">
					{__("trade status")}
				</div>
				<div className="transaction-table-title-item">
				</div>
			</div>
		);
	}
});

var Item = React.createClass({
	mixins: [ History ],
	_handleClick: function(e) {
		var parentNode = e.target.parentNode;
		while (parentNode.nodeName != 'TR') {
			parentNode = parentNode.parentNode;
		}
		var orderId = parentNode.getAttribute('data-orderid');
		this.history.pushState(null, `/transactiondetail/${orderId}`);
	},

	render: function() {
		var color = this.props.status !== 80 ? 'color-red' : 'color-green';
		var cl = 'transaction-item-amount ' + color;

		var statusTextMap = {
			waitPay: __('waiting for payment'),
			waitSent: __('waiting for delivery'),
			waitShip: __('waiting for shipment'),
			waitConfirm: __('waiting for confirm receipt'),
			tradeSuccess: __('trade succeed'),
			disputingOrders: __('disputing orders'),
			tradeClose: __('trade closed')
		};

		var statusName = this.props.statusName;

		return (
			<tr className="transaction-item" data-orderid={this.props.orderId} onClick={this._handleClick}>
				<td className="transaction-item-time">
					{this.props.date}
				</td>
				<td className={cl}>
					{CKFM.getDisplayPrice(this.props.amount)}
				</td>
				<td className="transaction-item-status">
					{statusTextMap[statusName]}
				</td>
				<td>
					<span className="icon-forward-arrow next-icon"></span>
				</td>
			</tr>
		);
	}
});

var TransactionList = React.createClass({
	mixins: [History],

	getInitialState: function() {
		return {
			tableHeight: 400,
			loading: false
		};
	},

	componentDidMount: function() {
		this._handleWindowScroll();
		window.addEventListener('scroll', this._handleWindowScroll, false);
	},

	componentWillUnmount: function() {
		window.removeEventListener('scroll', this._handleWindowScroll, false);
	},

	_getNextPageTransaction: function() {
		if (this.props.hasNextPage) {
			this.setState({
				loading: true
			});

			var query = {
				pageSize: 10,
				page: this.props.pageNum + 1
			};

			TransactionUtil.getNextPage(query, function(res) {
				this.setState({
					loading: false
				});

				TransactionActionCreators.receiveNextPageData(res);

			}.bind(this));
		}
	},

	_handleWindowScroll: function() {
		this.setState({
			tableHeight: (window.innerHeight - this.refs.listTable.offsetTop)
		});
	},

	render: function() {
		var transaction = this.props.transaction.map(function(item, index){
			return (
				<Item orderId={item.orderSerialnum} date={item.createTimeString} amount={item.totalPrice} status={item.status} key={index} statusName={item.statusName}/>
			);
		});

		return (
			<ScrollLoad
				ref="scrollLoad"
				containerHeight={this.state.tableHeight}
				loading={this.state.loading}
				onReachBottom={this._getNextPageTransaction}>

				<table className="table transaction-table" ref="listTable">
					<tbody>
						{transaction}
					</tbody>
				</table>
			</ScrollLoad>
		);
	}
});

var Transaction = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var query = this.props.location.query;
		TransactionUtil.getData(assign( {}, query, { pageSize: 10 } ));
		TransactionStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		TransactionStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
      <div className="row">
				<Header title={__('transaction')} hasSearch={false}/>
				<div className="transaction-module">
					<TableTitle />
					<TransactionList
						transaction={this.state.transaction}
						pageNum={this.state.pageNum}
						hasNextPage={this.state.hasNextPage}/>
				</div>
      </div>
		);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Transaction;
