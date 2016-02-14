require('../../less/order-list.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var CKFM = require('../CKFM.js');

var DisputeListActionCreators = require('../actions/DisputeListActionCreators.js');
var DisputeListStore = require('../stores/DisputeListStore.js');
var DisputeListUtil = require('../utils/DisputeListUtil.js');

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
	return DisputeListStore.getData();
}

var Header = require('../components/Header.js');
var ScrollLoad = require('../components/ScrollLoad.js');

var OrderListFilter = React.createClass({

	propTypes: {
		onFilterChange: React.PropTypes.func
	},

	render: function() {

		return (
			<div className="order-list-filter">
				<select className="form-control order-list-filter-select" name="tradeCode" ref="tradeCode" onChange={this._handleFilter} defaultValue="disputingOrders">
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

var DisputeListeFilter = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return {
			disputeTradeStat: this.props.disputeTradeStat || ''
		};
	},

	render: function() {
		return (
			<div className="dispute-list-filter">
				<div 
					className={'dispute-list-filter-nav' + (this.state.disputeTradeStat === '' ? ' active' : '')} 
					onClick={this._changeDisputeFilter.bind(this, '')}>
					{__('all orders')}
				</div>
				<div  
					className={'dispute-list-filter-nav' + (this.state.disputeTradeStat === 'return' ? ' active' : '')} 
					onClick={this._changeDisputeFilter.bind(this, 'return')}>
					{__('returning')}
				</div>
				<div 
					className={'dispute-list-filter-nav' + (this.state.disputeTradeStat === 'refund' ? ' active' : '')} 
					onClick={this._changeDisputeFilter.bind(this, 'refund')}>
					{__('refunding')}
				</div>
				<div 
					className={'dispute-list-filter-nav' + (this.state.disputeTradeStat === 'returnSuccess' ? ' active' : '')} 
					onClick={this._changeDisputeFilter.bind(this, 'returnSuccess')}>
					{__('return success')}
				</div>
				<div 
					className={'dispute-list-filter-nav' + (this.state.disputeTradeStat === 'refundSuccess' ? ' active' : '')} 
					onClick={this._changeDisputeFilter.bind(this, 'refundSuccess')}>
					{__('refund success')}
				</div>
			</div>
			);
	},

	_changeDisputeFilter: function(dts) {
		this.setState({
			disputeTradeStat: dts
		});
		this.history.pushState(null, '/disputelist', {
			disputeTradeStat: dts
		});
	}
});

var DisputeListItems = React.createClass({
	mixins: [ History ],

	propTypes: {
		list: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			list: []
		};
	},

	render: function() {

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

				return (
					<div className="order-list-item" key={i}>
						<div className="order-list-item-heading">
							<span>{__('order number')} : </span>
							<span>{o.orderSerialnum}</span>
						</div>
						{orderProducts}

						<div className="order-list-item-total">
							<span>{__('total price')} : <strong className="order-list-item-strong">{CKFM.getDisplayPrice(o.totalPrice) + ' ' + CKFM.getCurrency()}</strong></span>
						</div>

						<div className="order-list-item-btns">
							<Link to={'/orderdetail/' + o.orderSerialnum} className="btn btn-default btn-rect">
								{__('order detail')}
							</Link>
						</div>
					</div>
					);
			}, this);
		}
		return (
			<div className="order-list-items">
				{items}
			</div>
			);
	}
});


var DisputeListWrap = React.createClass({
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
			<div className="order-list dispute-list" ref="wrap">
					<OrderListFilter onFilterChange={this._onFilterChange}/>
					<DisputeListeFilter disputeTradeStat={this.props.disputeTradeStat}/>
					<ScrollLoad
						ref="scrollLoad"
						containerHeight={this.state.wrapHeight}
						loading={this.state.loading}
						onReachBottom={this._getNextPageOrderList}>

						<DisputeListItems list={this.props.list}/>

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
				disputeTradeStat: this.props.disputeTradeStat || '',
				page: this.props.pageNum + 1
			};

			DisputeListUtil.getNextPage(q, function(res) {
				this.setState({
					loading: false
				});
				DisputeListActionCreators.receiveNextPageData(res);

			}.bind(this));
		}
	},

	_onFilterChange: function(e, tradeCode) {
		if (tradeCode === 'disputingOrders') {
			return;
		}

		// BAD WAY TO SCROLL TO TOP, FIX LATER
		this.refs.scrollLoad.refs.wrap.scrollTop = 0;

		this.history.pushState(null, '/orderlist', {
			tradeCode: tradeCode
		});
	}
});

var DisputeList = React.createClass({
	mixins: [History],

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var query = this.props.location.query;
		DisputeListUtil.getData(query);
		DisputeListStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		DisputeListStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		var query = nextProps.location.query;
		DisputeListUtil.getData(query);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('dispute orders')} />
				</div>
				<div className="col-xs-12 trim-col">
					<DisputeListWrap
						disputeTradeStat={this.props.location.query.disputeTradeStat}
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

module.exports = DisputeList;
