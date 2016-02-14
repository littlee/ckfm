require('../../less/coupons-list.less');
var React = require('react');
var Header = require('./Header.js');
var CouponsListStore = require('../stores/CouponsListStore.js');
var CKFM = require('../CKFM.js');
function getStateFromStores() {
	return {
		coupons: CouponsListStore.getData(),
		tab: 'unused'
	};
}
var CouponsItem = React.createClass({
	render: function() {
		var couponsItems = [];
		if (this.props.coupons.length !== 0) {
			var tab = this.props.tab;
			var couponsList = [];
			switch (tab) {
			case 'unused':
				couponsList = this.props.coupons.unused;
				break;
			case 'used':
				couponsList = this.props.coupons.used;
				break;
			case 'expired':
				couponsList = this.props.coupons.expired;
				break;
			}
			couponsItems = couponsList.map(function(item, index) {
				if (item.isAvailable) {
					return (
						<div className="coupons-list-parent-item" key={index}>
								<div className="coupons-list-box">
									<div className="coupons-list-box-head">
										<div className="coupons-list-box-head-img">
										</div>
									</div>
									<div className="coupons-list-box-body">
										<div className="coupons-list-box-body-coupons">
											<span className="coupons-list-box-body-coupons-price">
											{CKFM.getDisplayPrice(item.subPrice)}
											</span>
											{__('full')}
											{CKFM.getDisplayPrice(item.priceCondition)}
										</div>
										<div className="coupons-list-box-body-info">
											<span className="coupons-list-box-body-info-title">{item.name}</span>
											<span className="coupons-list-box-body-info-time">{item.useTimeStart}-{item.useTimeEnd}</span>
										</div>
									</div>
								</div>
							</div>
						);
				} else {
					return (
						<div className="coupons-list-parent-item" key={index}>
						<div className="coupons-list-box">
							<div className="coupons-list-box-head coupons-list-box-head-unable">
								<div className="coupons-list-box-head-img">
								</div>
							</div>
							<div className="coupons-list-box-body">
								<div className="coupons-list-box-body-coupons">
									<span className="coupons-list-box-body-coupons-price coupons-list-box-body-coupons-price-unable">
									{CKFM.getDisplayPrice(item.subPrice)}
									</span>
									{__('full')}
									{CKFM.getDisplayPrice(item.priceCondition)}
								</div>
								<div className="coupons-list-box-body-info">
									<span className="coupons-list-box-body-info-title">{item.name}</span>
									<span className="coupons-list-box-body-info-time">{item.useTimeStart}-{item.useTimeEnd}</span>
								</div>
							</div>
						</div>
					</div>
						);
				}
			});
		}

		return (
			<div className="coupons-list-parent">
				{couponsItems}
			</div>
			);
	}
});
var Unused = React.createClass({
	tab: function(type) {
		this.props.onTab(type);
	},
	render: function() {
		return (
			<ul className="coupons-list-nav list-inline">
				<li role="presentation" className="active coupons-list-nav-li"><span className="coupons-list-nav-li-link">{__('not use')}</span></li>
				<li role="presentation" className="coupons-list-nav-li" onClick={this.tab.bind(this, "used")}><span className="coupons-list-nav-li-link">{__('already used')}</span></li>
				<li role="presentation" className="coupons-list-nav-li" onClick={this.tab.bind(this, "expired")}><span className="coupons-list-nav-li-link">{__('has expired')}</span></li>
			</ul>
			);
	}
});
var Used = React.createClass({
	tab: function(type) {
		this.props.onTab(type);
	},
	render: function() {
		return (
			<ul className="coupons-list-nav list-inline">
				<li role="presentation" className="coupons-list-nav-li" onClick={this.tab.bind(this, "unused")}><span className="coupons-list-nav-li-link">{__('not use')}</span></li>
				<li role="presentation" className="active coupons-list-nav-li"><span className="coupons-list-nav-li-link">{__('already used')}</span></li>
				<li role="presentation" className="coupons-list-nav-li" onClick={this.tab.bind(this, "expired")}><span className="coupons-list-nav-li-link">{__('has expired')}</span></li>
			</ul>
			);
	}
});
var Expired = React.createClass({
	tab: function(type) {
		this.props.onTab(type);
	},
	render: function() {
		return (
			<ul className="coupons-list-nav list-inline">
			<li role="presentation" className="coupons-list-nav-li" onClick={this.tab.bind(this, "unused")}><span className="coupons-list-nav-li-link">{__('not use')}</span></li>
			<li role="presentation" className="coupons-list-nav-li" onClick={this.tab.bind(this, "used")}><span className="coupons-list-nav-li-link">{__('already used')}</span></li>
			<li role="presentation" className="active coupons-list-nav-li"><span className="coupons-list-nav-li-link">{__('has expired')}</span></li>
			</ul>
			);
	}
});
var CouponsList = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		CouponsListStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		CouponsListStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('coupons')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="coupons-list">
						{this.state.tab === "unused" ? <Unused onTab={this.handleTab}/> : (this.state.tab === "used" ? <Used onTab={this.handleTab}/> : <Expired onTab={this.handleTab}/>)}
						<CouponsItem coupons={this.state.coupons} tab={this.state.tab}/>
					</div>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},
	handleTab: function(type) {
		// do not have to use switch statement
		this.setState({
			tab: type
		});
	}
});

module.exports = CouponsList;