require('../../less/refund-choose-items.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var CkCheckbox = require('./CkCheckbox.js');
var Header = require('../components/Header.js');
var RefundStore = require('../stores/RefundStore.js');
var RefundUtil = require('../utils/RefundUtil.js');

var statusMap = {
	returnApply: __("return refund order"),
	refundApply: __("refund order"),
	tradeSuccess: __("return refund order")
};

var typeMap = {
	waitSent: "refund",
	waitShip: "refund",
	waitConfirm: "return",
	tradeSuccess: "return"
};

var RefundOrderItems = React.createClass({
	propTypes: {
		o: React.PropTypes.object
	},

	getDefaultProps: function() {
		return {
			o: {}
		};
	},

	render: function() {

		var o = this.props.o;
		var orderProducts = o.orderProducts.map(function(p, producIdx) {
			var hasCheckedItem = false;
			var tds = p.orderItems.map(function(t, itemIdx) {
				if (t.checked) {
					hasCheckedItem = true;
					var spec = [];
					Object.keys(t.specificationValues).forEach(function(sk, i) {
						spec.push(<td key={i}>{sk} : {t.specificationValues[sk]}</td>);
					});
					return (
						<tr key={itemIdx}>
							{spec}
							<td>× {t.amount}</td>
						</tr>
						);
				}
			}, this);

			return (
			hasCheckedItem ?
				<div className="refund-choose-item-info" key={producIdx}>
					<div className="refund-choose-item-breif">
						<div className="refund-choose-item-thumb">
							<img src={p.imageUrl} />
						</div>
						<div className="refund-choose-item-title">
							<Link to={'/productdetail/' + p.productId}>
							{p.title}
							</Link>
						</div>
					</div>
					<table className="table refund-choose-item-table">
						<tbody>
							{tds}
						</tbody>
					</table>
				</div>
				:
				<div key={producIdx}></div>
			);
		}, this);

		return (
			<div className="refund-choose-items">
				<div className="refund-choose-item">
					<div className="refund-order-head">
						<span className="refund-order-icon"> &nbsp; </span>
						<span>{__("list of applications")}</span>
					</div>
					<div className="refund-choose-item-heading">
						<div className="refund-choose-item-num">
							<span>{__('order number')} : </span>
							<span>{o.orderSerialnum}</span>
							<Link to={"/orderdetail/" + o.orderSerialnum} className="pull-right">{__("details")}>></Link>
						</div>
					</div>
					{orderProducts}

				</div>
				<div className="refund-order-total">
					<span>{__("refund quantity")}</span>
					<span className="refund-order-total-num">{o.pieces}</span>
				</div>
				<div className="refund-order-total">
					<span>{__("refund amount")}</span>
					<span className="refund-order-total-num">{o.total}</span>
				</div>
			</div>
			);
	}
});

var RefundFooter = React.createClass({

	getInitialState: function() {
		return {
			agree: true
		};
	},

	_change: function(e) {
		this.setState({
			agree: !e.target.checked
		});
	},

	render: function() {

		return (
			<form>	
				<div className="form-group text-center">
					<CkCheckbox type="checkbox" text={__("I have read and agree to the terms and conditions")} ref="agree" onChange = {this._change}/>			
					<Link to="" className="refund-order-link">{__("the terms and conditions")}</Link>
				</div>
				<div className="form-group">
					<button type="submit" className={this.state.agree ? "btn btn-disabled btn-rect refund-order-btn" : "btn btn-primary btn-rect refund-order-btn"} disabled = {this.state.agree}>
						{__("apply for refund")}
					</button>
				</div>
			</form>
			);
	}
});

function getStateFromStores() {
	return {
		order: RefundStore.getData()
	};
}

var RefundOrder = React.createClass({

	mixins: [History],

	getInitialState: function() {
		RefundUtil.fromRefundChooseItems();
		return getStateFromStores();
	},

	componentDidMount: function() {
		RefundStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		RefundStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		var query = nextProps.location.query;
		RefundUtil.fromRefundChooseItems(query);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={statusMap[this.state.order.statusName]} />
				</div>
				<div className="col-xs-12">
				{
			this.state.order ?
				<div className="refund-choose" onSubmit={this._handleSubmit} id="form">
						<RefundOrderItems o={this.state.order}/> 						
						<RefundFooter/>
					</div>
				:
				null
			}
				</div>
			</div>
			);
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var d = {};
		d.list = [];

		this.state.order.orderProducts.map(function(pro, indx) {
			pro.orderItems.map(function(item, indx) {
				if (item.checked) {
					var data = {};
					data.statusName = this.state.order.statusName;
					data.orderSerialnum = this.state.order.orderSerialnum;
					data.realPrice = item.realPrice;
					data.amount = item.amount;
					data.itemSerialNum = item.itemSerialNum;
					data.title = item.title;
					data.specificationValues = item.specificationValues;
					data.type = typeMap[this.state.order.statusName];
					d.list.push(data);
				}
			}.bind(this));
		}.bind(this));
		sessionStorage.setItem('refundOrder', JSON.stringify(d));
		this.history.pushState(null, '/refund/refundapply/0');
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = RefundOrder;