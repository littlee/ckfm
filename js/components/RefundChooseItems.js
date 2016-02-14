require('../../less/refund-choose-items.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var CKFM = require('../CKFM.js');
var CkCheckbox = require('./CkCheckbox.js');
var Header = require('../components/Header.js');

var FormUtil = require('../utils/FormUtil.js');
var RefundStore = require('../stores/RefundStore.js');
var RefundUtil = require('../utils/RefundUtil.js');
var RefundActionCreators = require('../actions/RefundActionCreators.js');

var statusTextMap = {
	waitSent: __('waiting for delivery'),
	waitShip: __('waiting for shipment'),
	waitConfirm: __('waiting for confirm receipt'),
	tradeSuccess: __('trade succeed')
};

var errMsgMap = {
	'empty': __('please choose at least one item')
};

var ErrorMessage = React.createClass({

	propTypes: {
		error: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			error: ''
		};
	},

	render: function() {
		var show = false;
		show = this.props.error.length > 0;
		return (
			<div>
			{show ?
				<div className="alert alert-danger refund-choose-error">
				{errMsgMap[this.props.error]}
			</div> : null
			}
			</div>
			);
	}
});

var RefundChooseItemsItems = React.createClass({
	propTypes: {
		o: React.PropTypes.object
	},

	getDefaultProps: function() {
		return {
			o: {}
		};
	},

	_itemChange: function(){
		var res = 0;
		var orderItem = FormUtil.formToObject(document.getElementById('form')).orderItem;
		if(orderItem){				
			Object.keys(orderItem).forEach(function(pro) {
				var proItem = orderItem[pro];
				Object.keys(proItem).forEach(function(item) {
					res += proItem[item]*1;
				});
			});
			RefundActionCreators.setTotal(CKFM.getDisplayPrice(res));
		}
		else{
			RefundActionCreators.setTotal(0);
		}
	},

	render: function() {
		var isEmpty = true;
		if(this.props.o.orderProducts){
			var o = this.props.o;
			var orderProducts = o.orderProducts.map(function(p, producIdx) {
				var hasItem=false;
				var tds = p.orderItems.map(function(t, itemIdx) {
					if(t.status === "normal"){
						hasItem = true;
						isEmpty = false;
						var spec = [];
						Object.keys(t.specificationValues).forEach(function(sk, i) {
							spec.push(<td key={i}>{sk} : {t.specificationValues[sk]}</td>);
						});
						return (
							<tr key={itemIdx}>
								<td className="refund-choose-td-trim">
									<CkCheckbox type="checkbox" name={'orderItem[' + producIdx + '][' + itemIdx + ']'} value={t.realPrice.toString()} onChange = {this._itemChange}/>
								</td>
								{spec}
								<td>× {t.amount}</td>
							</tr>
						);	
					}
					
				},this);

				if(hasItem){
					return (
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
					);
				}else{
					return <div key={producIdx}></div>;
				}
				
			},this);				
		}	
		if(this.props.o.orderProducts && !isEmpty){
			return (
				<div className="refund-choose-items">
					<div className="refund-choose-item">
						<div className="refund-choose-item-heading">
							<div className="refund-choose-item-num">
								<span>{__('order number')} : </span>
								<span>{o.orderSerialnum}</span>
							</div>
							<div className="refund-choose-item-status">
								{statusTextMap[o.statusName]}
							</div>
						</div>
						{orderProducts}

					</div>
				</div>
			);
		}

		return <h2 className="text-center">{__("no orders")}</h2>;			
	}
});

var CartFooter = React.createClass({

	render: function() {

		return (
			<div className="refund-choose-footer">
				<span className="refund-choose-footer-box">
					<span>{__('total')} : </span>
					<span className="refund-choose-footer-total">{this.props.total}</span>
				</span>				
				<button type="submit" className="btn btn-primary btn-rect pull-right refund-choose-footer-submit">
					{__('submit')}
				</button>
			</div>
		);
	}
});

function getStateFromStores() {
	return {
		order:RefundStore.getData(),
		total: RefundStore.getTotal()
	};
}

var RefundChooseItems = React.createClass({

	mixins: [ History ],

	getInitialState: function() {
		RefundUtil.fromMyOrder();
		return {
			order:RefundStore.getData(),
			total: RefundStore.getTotal(),
			error: ''
		};
	},

	componentDidMount: function() {
		RefundStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		RefundStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('choose products')} />
				</div>
				<div className="col-xs-12 trim-col">
					<form className="refund-choose" onSubmit={this._handleSubmit} id="form">
						<RefundChooseItemsItems o={this.state.order}/>
						<ErrorMessage error={this.state.error}/> 						
						<CartFooter total = {this.state.total}/>
					</form>
				</div>
			</div>
			);
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var orderItem = FormUtil.formToObject(e.target).orderItem;

		if (!orderItem) {
			alert(__('please choose at least one item'));
			return false;
		}

		var data = this.state.order;
		var pieces = 0;

		Object.keys(orderItem).forEach(function(pro) {
			var proItem = orderItem[pro];
			Object.keys(proItem).forEach(function(item) {
				data.orderProducts[pro].orderItems[item].checked = true;
				pieces += data.orderProducts[pro].orderItems[item].amount;
			});
		});
		data.total = this.state.total;
		data.pieces = pieces;
		sessionStorage.setItem('refundChooseItems', JSON.stringify(data));
		this.history.pushState(null, '/refund/refundorder');
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = RefundChooseItems;