require('../../less/order-detail.less');
var React = require('react');
var History = require('react-router').History;
var Link = require('react-router').Link;
var Modal = require('react-modal');

var CKFM = require('../CKFM.js');

var OrderDetailActionCreators = require('../actions/OrderDetailActionCreators.js');
var OrderDetailStore = require('../stores/OrderDetailStore.js');
var OrderDetailUtil = require('../utils/OrderDetailUtil.js');

function getStateFromStores() {
	return OrderDetailStore.getData();
}

var Header = require('../components/Header.js');
var OrderCancelForm = require('../components/OrderCancelForm.js');
var OrderConfirmForm = require('../components/OrderConfirmForm.js');

var OrderDetailStatus = React.createClass({
	render: function() {

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
			<div className="order-detail-status">
				<div className="order-detail-status-bubble">
					{statusTextMap[this.props.statusName]}
				</div>
			</div>
			);
	}
});

var OrderDetailAddress = React.createClass({
	render: function() {
		return (
			<div className="order-detail-address">
				<dl>
					<dt>{__('recipient')}:</dt>
					<dd>{this.props.deliverAddr.name} {this.props.deliverAddr.phone}</dd>
					<dt>{__('delivery address')}:</dt>
					<dd>
						{this.props.deliverAddr.country}
						{this.props.deliverAddr.state}
						{this.props.deliverAddr.city}
						{this.props.deliverAddr.region}
						{this.props.deliverAddr.addrDetail}
					</dd>
				</dl>
			</div>
			);
	}
});

var OrderItemStatus = React.createClass({
	render: function() {
		var disputeStatusTextMap = {
			'normal': {
				color: '#999',
				text: __('normal trading')
			},
			'refund': {
				color: '#d4420e',
				text: __('refunding')
			},
			'return': {
				color: '#d4420e',
				text: __('returning')
			},
			'refundSuccess': {
				color: '#03A60B',
				text: __('refund success')
			},
			'returnSuccess': {
				color: '#03A60B',
				text: __('return success')
			}
		};

		if (this.props.status === 'normal') {
			if (this.props.applyDisputePermit) {
				if (this.props.canDispute) {
					return (<span style={{color: disputeStatusTextMap[this.props.status].color}}>{disputeStatusTextMap[this.props.status].text}</span>);
				}
				return null;
			}
			else if (this.props.return || this.props.returnRefund) {
				return (<Link to={'/refunddetail/' + this.props.itemSerialNum} style={{color: '#999'}}>{__('application revoked') + ' >>'}</Link>);
			}
			return null;
		}
		else {
			return (<Link to={'/refunddetail/' + this.props.itemSerialNum} style={{color: disputeStatusTextMap[this.props.status].color}}>{disputeStatusTextMap[this.props.status].text + ' >>'}</Link>);
		}
	}
});

var OrderDetailItem = React.createClass({
	mixins: [ History ],

	render: function() {

		var products = this.props.orderProducts.map(function(p, i) {

			var specs = p.orderItems.map(function(pp, j) {

				var colSpan = Object.keys(pp.specificationValues).length + 1;

				var	tds = Object.keys(pp.specificationValues).map(function(key, k) {
					return (
						<td key={k}>
							{key}:{pp.specificationValues[key]}
						</td>
						);
				});

				return (
					<tbody key={j}>
						<tr>
							{tds}
							<td>
								× {pp.amount}
							</td>
						</tr>
						<tr>
							<td colSpan={colSpan} className="order-detail-disputing">
								<OrderItemStatus 
									status={pp.status}
									applyDisputePermit={pp.applyDisputePermit}
									itemSerialNum={pp.itemSerialNum}
									return={pp.return}
									returnRefund={pp.returnRefund}
									canDispute={this.props.canDispute} />
							</td>
						</tr>
					</tbody>
					);
			}, this);

			return (
				<div key={i} className="order-detail-product">
					<div className="order-detail-info">
						<div className="order-detail-thumb">
							<img src={p.imageUrl} width="100"/>
						</div>
						<div className="order-detail-title">
							<span>{p.title}</span>
						</div>
					</div>
					<table className="table order-detail-spec">
						{specs}
					</table>
					{
						this.props.statusName === 'tradeClose' ?
						<div className="order-detail-comment-btn">
							<button type="button" className={'btn btn-rect btn-' + (p.isCommented ? 'default' : 'primary')} onClick={this._comment} data-comment={JSON.stringify({
								title: p.title,
								imageUrl: p.imageUrl,
								productId: p.productId,
								isCommented: p.isCommented,
								orderSerialNum: this.props.orderSerialnum
							})}>
								{p.isCommented ? __('additional comment') : __('comment')}
							</button>
						</div> : null
					}
				</div>
				);
		}, this);

		return (
			<div className="order-detail-item">
				<div className="order-detail-num">
					<span>{__('order number') + ':' + this.props.orderSerialnum}</span>
				</div>
				{products}
			</div>
			);
	},

	_comment: function(e) {
		var commentData = e.target.getAttribute('data-comment');
		sessionStorage.setItem('ck_comment_from', commentData);
		this.history.pushState(null, '/comment');
	}
});

var OrderDetailTotal = React.createClass({
	render: function() {
		return (
			<div className="order-detail-total">
				<dl>
					<dt>
						{__('original price')} :
					</dt>
					<dd>
						{CKFM.getDisplayPrice(this.props.originalPrice) + ' ' + CKFM.getCurrency()}
					</dd>
					<dt>
						{__('total price')} :
					</dt>
					<dd>
						<span className="order-detail-total-hl">
							{CKFM.getDisplayPrice(this.props.totalPrice || 0) + ' ' + CKFM.getCurrency()}
						</span>
					</dd>
				</dl>
			</div>
			);
	}
});

var OrderDetailService = React.createClass({
	render: function() {
		return (
			<div className="order-detail-service">
				<a href={'tel:' + CKFM.getStoreHotline()} className="btn btn-default btn-rect">
					{__('customer hotline')}
				</a>
			</div>
			);
	}
});

var OrderDetailTime = React.createClass({
	render: function() {
		return (
			<div className="order-detail-time">
				<div className="order-detail-time-heading">
					{__('order info')}
				</div>
				<div className="order-detail-time-body">
					<p>
						{__('order time')}
						&nbsp;:&nbsp; 
						{this.props.createTimeString}
					</p>
					{
						this.props.shippingTimeString ?
						<p>
							{__('shipping time')}
							&nbsp;:&nbsp; 
							{this.props.shippingTimeString}
						</p> : null
					}
					{
						this.props.completeTimeString ?
						<p>
							{__('completion time')}
							&nbsp;:&nbsp; 
							{this.props.completeTimeString}
						</p> : null
					}
				</div>				
			</div>
			);
	}
});

var OrderDetailBtns = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return {
			modalType: 'cancel_order', // or confirm_receive
			modalIsOpen: false
		};
	},

	render: function() {
		var btns = null;
		var mStyle = {
			overlay: {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.75)',
				zIndex: 999
			},
			content: {
				position: 'absolute',
				top: '20px',
				left: '20px',
				right: '20px',
				bottom: 'auto',
				border: '1px solid #ccc',
				background: '#fff',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: '0',
				outline: 'none',
				padding: '20px'
			}
		};

		var canRefund = false;

		if (this.props.orderListForm.canDispute) {
			canRefund = true;
		}

		if (this.props.orderListForm && this.props.orderListForm.orderProducts) { 
			this.props.orderListForm.orderProducts.every(function(pro) {
				var hasNormalPermit = pro.orderItems.filter(function(item) {
					return item.status === 'normal' && item.applyDisputePermit;
				}).length > 0;

				if (hasNormalPermit) {
					canRefund = true;
					return false;
				}
				return true;
			});
		}

		switch (this.props.statusName) {
		case 'waitPay':
			btns = 
				<div className="order-detail-btns">
					<button type="button" className="btn btn-default btn-rect" onClick={this._openModal.bind(this, 'cancel_order')}>
						{__('cancel order')}
					</button>

					{
						this.props.orderListForm.payment && this.props.orderListForm.payment === 'Cash on delivery' ?
						null
						:
						<Link to={'/orderpayment/' + this.props.orderSerialnum} className="btn btn-primary btn-rect">
							{__('pay')}
						</Link>
					}

					<Modal
						isOpen={this.state.modalIsOpen}
						onRequestClose={this._closeModal}
						style={mStyle}>
						{ this.state.modalType === 'cancel_order' ?
						<OrderCancelForm
							currentOSN={this.props.orderSerialnum}
							_closeModal={this._closeModal}
							cancelSuccess={this._cancelSuccess}/>
						:
						<OrderConfirmForm
							currentOSN={this.props.orderSerialnum}
							_closeModal={this._closeModal}
							confirmSuccess={this._confirmSuccess} />
						}
					</Modal>
				</div>;
			break;
		case 'waitSent':
			btns =
				<div className="order-detail-btns">
					{
						canRefund ?
						<button type="button" className="btn btn-default btn-rect" onClick={this._goToRefund}>
							{__('return or refund')}
						</button>
						:
						null
					}
				</div>;
			break;
		case 'waitShip':
			btns =
				<div className="order-detail-btns">
					{
						canRefund ?
						<button type="button" className="btn btn-default btn-rect" onClick={this._goToRefund}>
							{__('return or refund')}
						</button>
						:
						null
					}
				</div>;
			break;
		case 'waitConfirm':
			btns =
				<div className="order-detail-btns">
					<button type="button" className="btn btn-primary btn-rect" onClick={this._openModal.bind(this, 'confirm_receive')}>
						{__('confirm receipt')}
					</button>
					{
						canRefund ?
						<button type="button" className="btn btn-default btn-rect" onClick={this._goToRefund}>
							{__('return or refund')}
						</button>
						:
						null
					}

					<Modal
						isOpen={this.state.modalIsOpen}
						onRequestClose={this._closeModal}
						style={mStyle}>
						{
							this.state.modalType === 'cancel_order' ?
							<OrderCancelForm
								currentOSN={this.props.orderSerialnum}
								_closeModal={this._closeModal}
								cancelSuccess={this._cancelSuccess}/>
							:
							<OrderConfirmForm
								currentOSN={this.props.orderSerialnum}
								_closeModal={this._closeModal}
								confirmSuccess={this._confirmSuccess} />
						}
					</Modal>
				</div>;
			break;
		case 'tradeSuccess':
			btns =
				<div className="order-detail-btns">
					{
						canRefund ?
						<button type="button" className="btn btn-default btn-rect" onClick={this._goToRefund}>
							{__('return or refund')}
						</button>
						:
						null
					}
				</div>;
			break;
		case 'tradeClose':
			btns = null;
			break;
		default:
		}


		return (btns);
	},

	_closeModal: function() {
		this.setState({
			modalIsOpen: false
		});
	},

	_openModal: function(type) {
		this.setState({
			modalType: type,
			modalIsOpen: true
		});
	},

	_cancelSuccess: function() {
		var onum = this.props.orderSerialnum;
		OrderDetailUtil.getData(onum, function(res) {
			this._closeModal();
			OrderDetailActionCreators.receiveData(res);
		}.bind(this));
	},

	_confirmSuccess: function() {
		var onum = this.props.orderSerialnum;
		OrderDetailUtil.getData(onum, function(res) {
			this._closeModal();
			OrderDetailActionCreators.receiveData(res);
		}.bind(this));
	},

	_goToRefund: function() {
		sessionStorage.setItem('ck_refund_from_order', JSON.stringify(this.props.orderListForm));
		this.history.pushState(null, '/refund');
	}
});

var OrderDetail = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var onum = this.props.params.orderSerialNum;
		OrderDetailUtil.getData(onum, function(res) {
			OrderDetailActionCreators.receiveData(res);
		}.bind(this));
		OrderDetailStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		OrderDetailStore.removeChangeListener(this._onChange);
	},

	render: function() {

		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('order detail')} />
				</div>
				<div className="col-xs-12 trim-col">
					<div className="order-detail">
						<OrderDetailStatus statusName={this.state.orderListForm.statusName}/>
						{
							this.state.orderListForm.payment && this.state.orderListForm.payment === 'Cash on delivery' ?
							<div className="order-detail-guide">
								<p>{__('please go to store for payment')}</p>
								<p>
									{__('store address')} : {CKFM.getStoreAddress()}
								</p>
							</div>
							: null
						}
						<OrderDetailAddress deliverAddr={this.state.deliverAddr}/>
						<OrderDetailItem 
							orderSerialnum={this.state.orderListForm.orderSerialnum}
							orderProducts={this.state.orderListForm.orderProducts}
							statusName={this.state.orderListForm.statusName}
							canDispute={this.state.orderListForm.canDispute}/>

						<OrderDetailTotal originalPrice={this.state.orderListForm.priceBefore} totalPrice={this.state.orderListForm.totalPrice}/>
						<OrderDetailService />
						<OrderDetailTime createTimeString={this.state.createTimeString}/>

						<OrderDetailBtns
							statusName={this.state.orderListForm.statusName}
							orderSerialnum={this.state.orderListForm.orderSerialnum}
							orderListForm={this.state.orderListForm}/>
					</div>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = OrderDetail;