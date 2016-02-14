require('../../less/order-list.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var Modal = require('react-modal');

var CKFM = require('../CKFM.js');

var OrderListActionCreators = require('../actions/OrderListActionCreators.js');
var OrderListStore = require('../stores/OrderListStore.js');
var OrderListUtil = require('../utils/OrderListUtil.js');

var statusTextMap = {
	waitPay: __('waiting for payment'),
	waitSent: __('waiting for delivery'),
	waitShip: __('waiting for shipment'),
	waitConfirm: __('waiting for confirm receipt'),
	tradeSuccess: __('trade succeed'),
	disputingOrders: __('disputing orders'),
	tradeClose: __('trade closed')
};

function getStateFromStores() {
	return OrderListStore.getData();
}

var Header = require('../components/Header.js');
var ScrollLoad = require('../components/ScrollLoad.js');
var OrderCancelForm = require('../components/OrderCancelForm.js');
var OrderConfirmForm = require('../components/OrderConfirmForm.js');

var OrderListFilter = React.createClass({

	propTypes: {
		onFilterChange: React.PropTypes.func
	},

	render: function() {

		var tradeCode = '';
		if (this.props.tradeCode) {
			tradeCode = this.props.tradeCode;
		}

		return (
			<div className="order-list-filter">
				<select className="form-control order-list-filter-select" name="tradeCode" ref="tradeCode" onChange={this._handleFilter} value={tradeCode}>
					<option value="">{__('all orders')}</option>
					<option value="waitPay">{statusTextMap['waitPay']}</option>
					<option value="waitSent">{statusTextMap['waitSent']}</option>
					<option value="waitShip">{statusTextMap['waitShip']}</option>
					<option value="waitConfirm">{statusTextMap['waitConfirm']}</option>
					<option value="tradeSuccess">{statusTextMap['tradeSuccess']}</option>
					<option value="disputingOrders">{statusTextMap['disputingOrders']}</option>
					<option value="tradeClose">{statusTextMap['tradeClose']}</option>
				</select>
			</div>
			);
	},

	_handleFilter: function(e) {

		var tradeCode = this.refs.tradeCode.value;

		if (this.props.onFilterChange && typeof this.props.onFilterChange === 'function') {
			this.props.onFilterChange(e, tradeCode);
		}
	}
});

var WaitPayBtns = React.createClass({
	getInitialState: function() {
		return {
			showGuide: false
		};
	},

	render: function() {
		var useOffline = this.props.payment && this.props.payment === 'Cash on delivery';

		return (
			<div className="order-list-item-btns">
				<Link to={'/orderdetail/' + this.props.orderSerialnum} className="btn btn-default btn-rect">
					{__('order detail')}
				</Link>
				<button type="button" className="btn btn-default btn-rect" onClick={this.props._openModal} data-order={JSON.stringify({
					orderSerialnum: this.props.orderSerialnum,
					type: 'cancel_order'
				})}>
					{__('cancel order')}
				</button>
				{
					useOffline ?
					<button className="btn btn-primary btn-rect" type="button" onClick={this._toggleGuide}>
						{__('offline payment guidelines')}
					</button>
					:
					<Link to={'/orderpayment/' + this.props.orderSerialnum} className="btn btn-primary btn-rect">
						{__('pay')}
					</Link>	
				}

				{
					this.state.showGuide ?
					<div className="order-list-guide">
						<p>{__('please go to store for payment')}</p>
						<p>
							{__('store address')} : {CKFM.getStoreAddress()}
						</p>
					</div>
					: null
				}
			</div>
			);
	},

	_toggleGuide: function() {
		this.setState({
			showGuide: !this.state.showGuide
		});
	}
});

var OrderListItems = React.createClass({
	mixins: [ History ],

	propTypes: {
		list: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			list: []
		};
	},

	getInitialState: function() {
		return {
			modalType: 'cancel_order', // or confirm_receive
			modalIsOpen: false,
			currentOSN: null
		};
	},

	render: function() {
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

		var items = [];
		if (this.props.list.length === 0) {
			items = <h4 className="text-center">{__('no orders')}</h4>;
		} else {
			items = this.props.list.map(function(o, i) {
				var orderProducts = o.orderProducts.map(function(p, i) {

					var tds = p.orderItems.map(function(t, i) {
						var spec = [];
						Object.keys(t.specificationValues).forEach(function(sk, i) {
							spec.push(<td key={i}>{sk} : {t.specificationValues[sk]}</td>);
						});
						return (
							<tr key={i}>
								{spec}
								<td>× {t.amount}</td>
							</tr>
							);
					});

					return (
						<div className="order-list-item-info" key={i}>
							<div className="order-list-item-breif">
								<div className="order-list-item-thumb">
									<img src={p.imageUrl} />
								</div>
								<div className="order-list-item-title">
									<Link to={'/productdetail/' + p.productId}>
									{p.title}
									</Link>
								</div>
							</div>
							<table className="table order-list-item-table">
								<tbody>
									{tds}
								</tbody>
							</table>
						</div>
						);
				});

				var orderItemBtns = null;

				switch (o.statusName) {
				case 'waitPay':
					orderItemBtns = 
						<WaitPayBtns
							orderSerialnum={o.orderSerialnum}
							_openModal={this._openModal} 
							payment={o.payment} />;

					break;
				case 'waitSent':
					orderItemBtns = <div className="order-list-item-btns">
						<Link to={'/orderdetail/' + o.orderSerialnum} className="btn btn-default btn-rect">
							{__('order detail')}
						</Link>
					</div>;
					break;
				case 'waitShip':
					orderItemBtns = <div className="order-list-item-btns">
						<Link to={'/orderdetail/' + o.orderSerialnum} className="btn btn-default btn-rect">
							{__('order detail')}
						</Link>
					</div>;
					break;
				case 'waitConfirm':
					orderItemBtns = <div className="order-list-item-btns">
						<Link to={'/orderdetail/' + o.orderSerialnum} className="btn btn-default btn-rect">
							{__('order detail')}
						</Link>
						<button type="button" className="btn btn-primary btn-rect" onClick={this._openModal} data-order={JSON.stringify({
							orderSerialnum: o.orderSerialnum,
							type: 'confirm_receive'
						})}>
							{__('confirm receipt')}
						</button>
					</div>;
					break;
				case 'tradeSuccess':
					orderItemBtns = <div className="order-list-item-btns">
						<Link to={'/orderdetail/' + o.orderSerialnum} className="btn btn-default btn-rect">
							{__('order detail')}
						</Link>
					</div>;
					break;
				case 'tradeClose':
					orderItemBtns = <div className="order-list-item-btns">
						<Link to={'/orderdetail/' + o.orderSerialnum} className="btn btn-default btn-rect">
							{__('order detail')}
						</Link>
					</div>;
					break;
				default:
				}

				return (
					<div className="order-list-item" key={i}>
						<div className="order-list-item-heading">
							<div className="order-list-item-num">
								<span>{__('order number')} : </span>
								<span>{o.orderSerialnum}</span>
							</div>
							<div className="order-list-item-status">
								{statusTextMap[o.statusName]}
							</div>
						</div>
						{orderProducts}

						<div className="order-list-item-total">
							<span>{__('total amount')} : <strong className="order-list-item-strong">{o.totalAmount}</strong></span>
							<br/>
							<span>{__('total price')} : <strong className="order-list-item-strong">{CKFM.getDisplayPrice(o.totalPrice) + ' ' + CKFM.getCurrency()}</strong></span>
						</div>

						{orderItemBtns}
					</div>
					);
			}, this);
		}

		return (
			<div className="order-list-items">
				{items}

				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this._closeModal}
					style={mStyle}>

					{ this.state.modalType === 'cancel_order' ?
					<OrderCancelForm
						currentOSN={this.state.currentOSN}
						_closeModal={this._closeModal}
						cancelSuccess={this._cancelSuccess}/>
					:
					<OrderConfirmForm
						currentOSN={this.state.currentOSN}
						_closeModal={this._closeModal}
						confirmSuccess={this._confirmSuccess} />
					}
				</Modal>
			</div>
			);
	},

	_closeModal: function() {
		this.setState({
			modalIsOpen: false,
			currentOSN: ''
		});
	},

	_openModal: function(e) {
		var o = JSON.parse(e.target.getAttribute('data-order'));
		this.setState({
			modalType: o.type,
			modalIsOpen: true,
			currentOSN: o.orderSerialnum
		});
	},

	_cancelSuccess: function() {
		this.history.pushState(null, '/orderdetail/' + this.state.currentOSN);
	},

	_confirmSuccess: function() {
		this.history.pushState(null, '/orderdetail/' + this.state.currentOSN);
	}
});


var OrderListWrap = React.createClass({
	mixins: [History],

	getInitialState: function() {
		return {
			wrapHeight: 300,
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

	render: function() {
		return (
			<div className="order-list" ref="wrap">
					<OrderListFilter tradeCode={this.props.tradeCode} onFilterChange={this._onFilterChange}/>
					<ScrollLoad
						ref="scrollLoad"
						containerHeight={this.state.wrapHeight}
						loading={this.state.loading}
						onReachBottom={this._getNextPageOrderList}>

						<OrderListItems list={this.props.list} />

					</ScrollLoad>
				</div>
			);
	},

	_handleWindowScroll: function() {
		this.setState({
			wrapHeight: (window.innerHeight - this.refs.wrap.offsetTop)
		});
	},

	_getNextPageOrderList: function() {
		if (this.props.hasNextPage) {
			this.setState({
				loading: true
			});

			var q = {
				tradeCode: this.props.tradeCode || '',
				page: this.props.pageNum + 1
			};

			OrderListUtil.getNextPage(q, function(res) {
				this.setState({
					loading: false
				});
				OrderListActionCreators.receiveNextPageData(res);

			}.bind(this));
		}
	},

	_onFilterChange: function(e, tradeCode) {
		if (tradeCode === 'disputingOrders') {
			this.history.pushState(null, '/disputelist');
			return;
		}

		// BAD WAY TO SCROLL TO TOP, FIX LATER
		this.refs.scrollLoad.refs.wrap.scrollTop = 0;

		this.history.pushState(null, '/orderlist', {
			tradeCode: tradeCode
		});
	}
});

var OrderList = React.createClass({
	mixins: [History],

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var query = this.props.location.query;
		OrderListUtil.getData(query);
		OrderListStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		OrderListStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		var query = nextProps.location.query;
		OrderListUtil.getData(query);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('my orders')} />
				</div>
				<div className="col-xs-12 trim-col">
					<OrderListWrap
						tradeCode={this.props.location.query.tradeCode}
						list={this.state.list}
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

module.exports = OrderList;
