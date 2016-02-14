require('../../less/refund-choose-items.less');
require('../../less/refund-detail.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var Modal = require('react-modal');

var CKFM = require('../CKFM.js');
var CkCheckbox = require('./CkCheckbox.js');
var Header = require('../components/Header.js');
var FormUtil = require('../utils/FormUtil.js');
var RefundStore = require('../stores/RefundDetailStore.js');
var RefundUtil = require('../utils/RefundDetailUtil.js');
var RefundActionCreators = require('../actions/RefundDetailActionCreators.js');


var statusMap = {
	waitSent: __('waiting for delivery'),
	waitShip: __('waiting for shipment'),
	waitConfirm: __('waiting for confirm receipt'),
	tradeSuccess: __('trade succeed'),
	tradeClose: __('trade closed')
};

var reasonMap = {
	/* the word "I" should be UPPERCASE, think about "what do i want ?", no practical way to uppercas-ify "i" */
	'i_have_communication_with_the_seller_and_solve_the_after_sales_problem':__("I have communication with the seller and solve the after sales problem"),
	'i_dont_want_to_have_refunds':__("I don\'t want to have refunds"),
	'other':__("other")
};

var refundReasonMap = {
	'':__("please select a reason"),
	'take_the_wrong_multi_take_do_not_want':__("take the wrong multi take do not want"),
	'return_shipping_price_differences':__("return shipping price differences"),
	'not_deliver_goods_in_the_agreed_time':__("not deliver goods in the agreed time"),
	'other':__("other"),
	'commodity_damage':__("commodity damage"),
	'commodity_information_description_does_not_match':__("commodity information description does not match"),
	'counterfeit_products':__("counterfeit products"),
	'quality_problem':__("quality problem"),
	'empty_package':__("empty package")
};

var logisticsMap = {
	waitSent: 'refund',
	waitShip: 'refund',
	waitConfirm: 'return',
	tradeSuccess: 'return'
};

var Reason = React.createClass({

	getInitialState: function() {
		return{reason:''};
	},

	render: function() {
		var r = reasonMap;
		var item=[];

		Object.keys(r).forEach(function(s, i) {
			item.push(
				<option value={s} key={i}>{r[s]}</option>
			)
		});

		return (
			<select className="form-control" name="reason">
				{item}
			</select>
			);
	}
});

var customStyles = {
	overlay : {
		position          : 'fixed',
		top               : 0,
		left              : 0,
		right             : 0,
		bottom            : 0,
		backgroundColor   : 'rgba(0, 0, 0, 0.75)',
		zIndex			  : 1000
	},
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)',
		width 				  : '80%',
		borderRadius		  : '10px',
		textAlign			  : 'center',
		padding  			  : '15px'
	}
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
		
		var  o = this.props.o;
		var spec = [];
		if(o.specificationValues){
			Object.keys(o.specificationValues).forEach(function(sk, i) {
				spec.push(<span key={i} className="refund-choose-item-table-span">{sk} : {o.specificationValues[sk]}</span>);
			});
		}

		return (
			<div className="refund-choose-items">
				<div className="refund-detail-head">
					{o.status === "success" || o.status === "closed"?
						null:						
						<span className="refund-detail-handling">
							<span className="icon-wait-o"></span>
							<span className="">{__("please wait for processing...")}</span>
						</span>
					}
					<Link to={"/refundprogress/"+ o.itemSerialNum} className="pull-right">{__("application status")}>></Link>
				</div>
				<div className="refund-choose-item">
					<div className="refund-order-head">
						<span className="refund-order-icon"> &nbsp; </span>
						<span>{__("list of applications")}</span>
					</div>
					<div className="refund-choose-item-heading">
						<div className="refund-choose-item-num">
							<span>{__('order number')} : </span>
							<span>{o.orderSerialnum}</span>
						</div>
					</div>
					<div className="refund-choose-item-info">
						<div className="refund-choose-item-breif">
							<div className="refund-choose-item-thumb">
								<img src={o.productImageUrl} />
							</div>
							<div className="refund-choose-item-title">
								<Link to={'/productdetail/' + o.productId}>
									{o.title}
								</Link>
							</div>
						</div>
						<div className="refund-choose-item-table">
							{spec}
							<span className="refund-choose-item-table-amount">× {o.amount}</span>
						</div>
					</div>

				</div>
			</div>
		);
	}
});

var Detail = React.createClass({

	getInitialState: function() {
		return{
			agree:true
		};
	},

	render: function() {
		var o = this.props.o;

		return (
			<div className="">
				<div className="refund-order-head">
					<span className="refund-order-icon"> &nbsp; </span>
					<span>{__("list of applications")}</span>
				</div>
				<div className="refund-detail-line">{__("refund number")}：{o.disputeSerialNum}</div>
				<div className="refund-detail-item">{__("refund amount")}：{o.money?CKFM.getDisplayPrice(o.money)+' '+ CKFM.getCurrency():null}</div>
				<div className="refund-detail-item">{__("reason")}：{refundReasonMap[o.reason]}</div>
				<div className="refund-detail-item">{__("explain")}：{o.description}</div>
				<div className="refund-detail-item">{__("logistics status")}：{statusMap[o.statusName]}</div>
				<div className="refund-detail-item">{__("order date")}：{o.createTimeString}</div>
			</div>
		);
	}
});

var Footer = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return{
			agree:true,
			modalIsOpen: false
		}
	},

	openModal: function() {
		this.setState({
			modalIsOpen: true
		});
	},

	closeModal: function() {
		this.setState({modalIsOpen: false});
	},

	_cancel:function(e){
		e.preventDefault();
		var data = FormUtil.formToObject(e.target).reason;
		var q = {};
		q.reason = data;
		q.itemSerialNum = this.props.o.itemSerialNum;
		RefundUtil.cancel(q,function(res){
			if(res.result === "cancelSuccess"){
				this.history.pushState(null, "/refundprogress/"+ this.props.o.itemSerialNum);
			}
		}.bind(this));
	},

	render: function() {
		var status = this.props.o.status;
		if(status==='success' || status==='closed'){
			
			var btn = <div className="refund-detail-btn">
				<Link type="button" className="btn btn-primary btn-rect" to="/">{__("home")}</Link>	
				<Link type="button" className="btn refund-detail-additional-btn btn-rect" to="/orderlist">{__("my orders")}</Link>	
			</div>
			
		}else{
			var modify = status === "apply" || status === "reject";

			var btn =
				<div className="refund-detail-btn">
					{modify?	
						<Link className="btn refund-detail-additional-btn btn-rect" to={`/refund/refundapply/${this.props.o.itemSerialNum}`}>
							{__("modify the application")}
						</Link>					
					:null}
					<button type="button" className="btn btn-primary btn-rect" onClick = {this.openModal}>{__("cancel the application")}</button>
				</div>				
		}
			
		return (
			<div className="refund-detail-btn">	
				{btn}
				<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>

					<form onSubmit={this._cancel}>
						<h2 className="refund-detail-modal-title">{__("reasons for cancel the application")}</h2>
						<Reason />
						<button type="button" className="btn btn-default btn-rect refund-detail-modal-btn" onClick={this.closeModal}>{__("cancel")}</button>	
						<button type="submit" className="btn btn-primary btn-rect refund-detail-modal-btn">{__("submit")}</button>	
					</form>

				</Modal>
			</div>
		);
	}
});

function getStateFromStores() {
	return {
		order:RefundStore.getData()
	};
}

var RefundOrder = React.createClass({	

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var itemSerialNum = this.props.params.itemSerialNum;
		RefundUtil.getData(itemSerialNum);
		RefundStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		RefundStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		/*change to nextProps*/
		var itemSerialNum = nextProps.params.itemSerialNum;
		RefundUtil.getData(itemSerialNum);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__("dispute order details")} />
				</div>
				<div className="col-xs-12">
				{
					this.state.order?
					<div className="refund-choose" id="form">
						<RefundOrderItems o={this.state.order}/>
						<Detail o={this.state.order}/>
						<Footer o={this.state.order}/>
					</div>
					:
					null
				}
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = RefundOrder;
