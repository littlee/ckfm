require('../../less/refund-progress.less');
require('../../less/refund-status.less');
var React = require('react');
var Link = require('react-router').Link;
var Modal = require('react-modal');

var CKFM = require('../CKFM.js');
var Header = require('../components/Header.js');
var RefundStatus = require('../components/RefundStatus.js');

var RefundStore = require('../stores/RefundProgressStore.js');
var RefundUtil = require('../utils/RefundProgressUtil.js');

var statusMap = {
	'refund': __("apply for refund"),
	'return': __("apply for return refund")
};

Date.prototype.Format = function(fmt) {
	var deadline = this.getTime();
	var o = {
		"D+": Day(deadline), //日 
		"H+": Hours(deadline), //小时 
		"M+": Minutes(deadline), //分 
		"S+": Seconds(deadline), //秒 
	};
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}

	}
	return fmt;
};

function Day(th) {
	var t = 0;
	var p = 24 * 3600 * 1000;
	t = parseInt(th / p);
	return t;
}

function Hours(th) {
	var t = 0;
	var p = 3600 * 1000;
	var cut = th % (24 * 3600 * 1000);
	t = parseInt(cut / p);
	return t;
}

function Minutes(th) {
	var t = 0;
	var p = 60 * 1000;
	var cut = th % (3600 * 1000);
	t = parseInt(cut / p);
	return t;
}

function Seconds(th) {
	var t = 0;
	var p = 1000;
	var cut = th % (60 * 1000);
	t = parseInt(cut / p);
	return t;
}

function getStateFromStores() {
	return {
		order: RefundStore.getData()
	};
}

var Apply = React.createClass({

	render: function() {

		return (
			<div className="refund-progress-main">
				<span className="icon-wait-o"></span>
				<h2>{__("please wait for the seller to process the application")}</h2>
				<div className="refund-progress-main-p">
					{__("if the seller refuses you can modify the application again the seller will reprocess")}
				</div>
			</div>
			);
	}
});

var Closed = React.createClass({

	render: function() {

		return (
			<div className="refund-progress-main">
				<span className="revoke-circle-o"></span>
				<h2>{__("application has been cancelled")}</h2>
				<div className="refund-progress-main-p">
					<dl className="dl-horizontal refund-progress-main-dl">
						<dt>{__("handler")}：</dt>
						<dd>{this.props.order.cancelType === 0 ? __("buyer") : "Cooka"}</dd>
					</dl>
					<dl className="dl-horizontal refund-progress-main-dl">
						<dt>{__("reason")}：</dt>
						<dd>{reasonMap[this.props.order.cancelReason]}</dd>
					</dl>
				</div>
			</div>
			);
	}
});

var Success = React.createClass({

	render: function() {
		return (
			<div className="refund-progress-main">
				<span className="icon-check-circle-o" style={{
					color: '#008000'
				}}></span>
				<h2 style={{
					color: '#008000'
				}}>{__("refund success")}</h2>
				<div className="refund-progress-main-p">
					<dl className="dl-horizontal refund-progress-main-dl">
						<dt>{__("refund number")}：</dt>
						<dd>{this.props.order.disputeSerialNum}</dd>
					</dl>
					<dl className="dl-horizontal refund-progress-main-dl">
						<dt>{__("refund amount")}：</dt>
						<dd>
							{CKFM.getDisplayPrice(this.props.order.refundMoney) + ' ' + CKFM.getCurrency()}
						</dd>
					</dl>
				</div>
			</div>
			);
	}
});

var Reject = React.createClass({
	getInitialState: function() {
		return{
			time:this._getTime(true),
			t:null
		}
	},

	componentDidMount: function() {	
		this.setState({
            t:setInterval(function() {
				this._getTime();
	        }.bind(this), 1000)
        });		 
	},

	componentWillUnmount: function() {
		clearTimeout(this.state.t);
	},

	_getTime:function(query){
		var timeStamp = this.props.order.timeStamp + 7*24*3600*1000;
		var now = new Date().getTime();
		var deadline = timeStamp - now;
		var time = new Date(deadline).Format("DD" + __('days') + "HH" + __('hours') + "MM" + __('minutes') + "SS" + __('seconds'));
		if (query) return time;
		this.setState({
			time: time
		});
	},

	render: function() {

		setTimeout(function() {
			this._getTime();
		}.bind(this), 1000);

		return (
			<div className="refund-progress-main">
				<span className="icon-failed-circle-o"></span>
				<h2>{__("application is rejected")}</h2>
				<div className="refund-progress-main-p">
					<dl className="dl-horizontal refund-progress-main-dl text-danger">
						<dt>{__("the remaining processing time")}：</dt>
						<dd>{this.state.time}</dd>
					</dl>
					{__("you can modify the application again the seller will reprocess")}
					<dl className="dl-horizontal refund-progress-main-dl">
						<dt>{__("reason")}：</dt>
						<dd>{reasonMap[this.props.order.rejectReason]}</dd>
					</dl>
				</div>
			</div>
			);
	}
});

var ReturnAgree = React.createClass({

	getInitialState: function() {
		return{
			time:this._getTime(true),
			t:null
		}
	},

	componentDidMount: function() {	
		this.setState({
            t:setInterval(function() {
				this._getTime();
	        }.bind(this), 1000)
        });		 
	},

	componentWillUnmount: function() {
		clearTimeout(this.state.t);
	},

	_getTime:function(query){
		var timeStamp = this.props.order.timeStamp + 7*24*3600*1000;
		var now = new Date().getTime();
		var deadline = timeStamp - now;
		var time = new Date(deadline).Format("DD" + __('days') + "HH" + __('hours') + "MM" + __('minutes') + "SS" + __('seconds'));
		if (query) return time;
		this.setState({
			time: time
		});
	},
	render: function() {			

		return (
			<div className="refund-progress-main">
				<span className="icon-return"></span>
				<h2>{__("the seller agrees to refunds")}</h2>
				<div className="refund-progress-main-p">
					<dl className="dl-horizontal refund-progress-main-dl text-danger">
						<dt>{__("the remaining processing time")}：</dt>
						<dd>{this.state.time}</dd>
					</dl>
					<dl className="dl-horizontal refund-progress-main-dl">
						<dt>{__("refund number")}：</dt>
						<dd>{this.props.order.disputeSerialNum}</dd>
					</dl>
					{__("please select goods returned to the shop")}
				</div>
			</div>
			);
	}
});

var Reception = React.createClass({

	render: function() {

		return (
			<div className="refund-progress-main">
				<span className="icon-return"></span>
				<h2>{__("the seller has received a return of the goods, a refund processing")}</h2>
				<div className="refund-progress-main-p">
					{__("the seller has received your return goods, processing refunds according to the commodity related situation")}
				</div>
			</div>
			);
	}
});

/*{t.addrDetail+' , '+t.region+' , '+t.city+' , '+t.state+' , '+t.country}
<div>
	{t.phone}
</div>*/
var Store = React.createClass({

	render: function() {
		if(this.props.office){

		var items = this.props.office.map(function(t, i) {
			return (
				<div className="refund-progress-store-item" key={i}>
						<h3>	
							<span className="icon-address-o"></span>
							<span>{t.name}</span>
						</h3>
						<div className="refund-progress-store-item-p">
							
							<div>{CKFM.getStoreAddress()}</div>
							<div>{CKFM.getStoreHotline()}</div>								
								
						</div>			
					</div>
				)
			})
		}			

		return (
			<div className="refund-progress-store">
				<div className="refund-progress-store-head">					
					<span className="refund-progress-store-icon"> &nbsp; </span>
					<span>{__("the current store")}</span>
				</div>
				{this.props.office?items:null}
			</div>
		);
	}
});

var customStyles = {
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		zIndex: 1000
	},
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '80%',
		borderRadius: '10px',
		textAlign: 'center',
		padding: '15px'
	}
};

var Btn = React.createClass({
	getInitialState: function() {
		return {
			modalIsOpen: false
		};
	},

	_cancel: function() {
		RefundUtil.cancel(this.props.order.itemSerialNum);
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

	render: function() {
		var status = this.props.order.status;
		var btn = null;
		if (status === 'success' || status === 'closed') {

			btn = <div className="refund-progress-btn">
				<Link type="button" className="btn btn-primary btn-rect" to="/">{__("home")}</Link>	
				<Link type="button" className="btn btn-primary btn-rect" to="/orderlist">{__("my orders")}</Link>	
			</div>;

		} else {
			var modify = this.props.order.status === "apply" || this.props.order.status === "reject";

			btn = <div className="refund-progress-btn">
					{
						modify ?
						<Link type="button" className="btn btn-primary btn-rect" to={"/refund/refundapply/" + this.props.order.itemSerialNum}>{__("modify the application")}</Link>
						:
						null
					}
					<button type="button" className="btn btn-primary btn-rect" onClick = {this.openModal}>{__("cancel the application")}</button>

				</div>				
		}
		return (
			<div>
				{btn}
				<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>

					<form onSubmit={this._cancel}>
						<h2 className="refund-progress-modal-title">{__("reasons for cancel the application")}</h2>
						<Reason />
						<button type="button" className="btn btn-default btn-rect refund-progress-modal-btn" onClick={this.closeModal}>{__("cancel")}</button>	
						<button type="submit" className="btn btn-primary btn-rect refund-progress-modal-btn">{__("submit")}</button>	
					</form>

				</Modal>
			</div>
			);
	}
});

var reasonMap = {
	/* the word "I" should be UPPERCASE, think about "what do i want ?", no practical way to uppercas-ify "i" */
	'i_have_communication_with_the_seller_and_solve_the_after_sales_problem': __("I have communication with the seller and solve the after sales problem"),
	'i_dont_want_to_have_refunds': __("I don\'t want to have refunds"),
	'not_comport_with_the_application': __("not comport with the application"),
	'other': __("other")
};

var Reason = React.createClass({

	getInitialState: function() {
		return {
			reason: ''
		};
	},

	render: function() {
		var r = reasonMap;
		var item = [];

		Object.keys(r).forEach(function(s, i) {
			item.push(
				<option value={s} key={i}>{r[s]}</option>
			);
		});

		return (
			<select className="form-control" name="reason">
				{item}
			</select>
			);
	}
});

var RefundProgress = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var itemSerialNum = this.props.params.itemSerialNum;
		RefundUtil.getStatus(itemSerialNum);
		RefundStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		clearTimeout();
		RefundStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		var query = nextProps.location.query;
		RefundUtil.getStatus(query);
	},

	render: function() {

		var Main = null;

		switch (this.state.order.status) {

			case 'apply' :
				Main = <Apply/>;
				break;

			case 'success' :
				Main = <Success order={this.state.order}/>;
				break;

			case 'closed' :
				Main = <Closed order={this.state.order}/>;
				break;

			case 'reject' :
				Main = <Reject order={this.state.order}/>;
				break;

			case 'returnAgree' :
				Main = <ReturnAgree order={this.state.order}/>;
				break;

			case 'reception' :
				Main = <Reception/>;
				break;

			default:
		}

		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={statusMap[this.state.order.type]} />
				</div>
				<div className="col-xs-12">
					<div className="refund-progress">
						<RefundStatus type={this.state.order.type} status={this.state.order.status}/>
						{Main}
						<Link className="refund-progress-link" to={`/refunddetail/${this.state.order.itemSerialNum}`}>
							{__("view details")}>>>
						</Link>
						{this.state.order.status === 'returnAgree' ? <Store office={this.state.order.cookaOffice}/> :null}

						<Btn order={this.state.order}/>
						
					</div>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = RefundProgress;