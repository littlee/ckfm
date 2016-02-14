require('../../less/order-coupons.less');
var React = require('react');
var Header = require('./Header.js');
var CkRadio = require('./CkRadio.js');
var OrderCouponsStore = require('../stores/OrderCouponsStore.js');
var OrderCouponsActionCreator = require('../actions/OrderCouponsActionCreators.js');
var History = require('react-router').History;

var CKFM = require('../CKFM.js');
function getStateFromStores() {
	return {
		coupons: OrderCouponsStore.getData(),
		selectNum: OrderCouponsStore.getSelect()
	};
}
var CouponsList = React.createClass({
	changeCoupons: function(item) {
		this.props.onChangeCoupons(item);
	},
	render: function() {
		var couponsItems = [];
		var selectNum = this.props.selectNum;
		var self = this;
		couponsItems = this.props.coupons.map(function(item, index) {
			if (item.isAvailable) {
				return (
					<div className="order-coupons-list-item" key={index}>
						<div className="order-coupons-list-item-radio">
							<CkRadio name="myradio" onChange={self.changeCoupons.bind(self, item)} defaultChecked={selectNum === null ? false : (item.couponSerialNum === selectNum.couponSerialNum)}/>
						</div>
						<div className="order-coupons-box">
							<div className="order-coupons-box-head">
								<div className="order-coupons-box-head-img">
								</div>
							</div>
							<div className="order-coupons-box-body">
								<div className="order-coupons-box-body-coupons">
									<span className="order-coupons-box-body-coupons-price">
									{CKFM.getDisplayPrice(item.subPrice)}
									</span>
									{__('full')}
									{CKFM.getDisplayPrice(item.priceCondition)}
								</div>
								<div className="order-coupons-box-body-info">
									<span className="order-coupons-box-body-info-title">{item.name}</span>
									<span className="order-coupons-box-body-info-time">{item.useTimeStart}-{item.useTimeEnd}</span>
								</div>
							</div>
						</div>
					</div>
					);
			} else {
				return (
					<div className="order-coupons-list-item" key={index}>
						<div className="order-coupons-list-item-radio">
							<CkRadio name="myradio" onChange={self.changeCoupons.bind(self, item)} defaultChecked={selectNum === null ? false : (item.couponSerialNum === selectNum.couponSerialNum)} disabled/>
						</div>
						<div className="order-coupons-box">
							<div className="order-coupons-box-head order-coupons-box-head-unable">
								<div className="order-coupons-box-head-img">
								</div>
							</div>
							<div className="order-coupons-box-body">
								<div className="order-coupons-box-body-coupons">
									<span className="order-coupons-box-body-coupons-price order-coupons-box-body-coupons-price-unable">
									{CKFM.getDisplayPrice(item.subPrice)}
									</span>
									{__('full')}
									{CKFM.getDisplayPrice(item.priceCondition)}
								</div>
								<div className="order-coupons-box-body-info">
									<span className="order-coupons-box-body-info-title">{item.name}</span>
									<span className="order-coupons-box-body-info-time">{item.useTimeStart}-{item.useTimeEnd}</span>
								</div>
							</div>
						</div>
					</div>
					);
			}
		});

		return (
			<div className="order-coupons-list">
				{couponsItems}
			</div>
			);
	}
});

var OrderCoupons = React.createClass({
	mixins: [History],
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		OrderCouponsStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		OrderCouponsStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('coupons')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="order-coupons">
						<CouponsList coupons={this.state.coupons} selectNum={this.state.selectNum} onChangeCoupons={this.handleCoupons}/>
						<div className="order-coupons-form-btn">
							<button type="button" className="btn btn-primary btn-block" onClick={this.handleConfirm}>
								{__('confirm')}
							</button>
						</div>
					</div>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	handleCoupons: function(item) {
		OrderCouponsActionCreator.receiveSelectNum(item);
	},

	handleConfirm: function() {
		var data = getStateFromStores().selectNum;
		sessionStorage.setItem('couponsNum', JSON.stringify(data));
		this.history.pushState(null,"/ordersettlement");
	}
});

module.exports = OrderCoupons;