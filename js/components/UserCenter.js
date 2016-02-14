require('../../less/user-center.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var UserCenterStore = require('../stores/UserCenterStore.js');
var CKFM = require('../CKFM.js');

var UserCenterUtil = require('../utils/UserCenterUtil.js');

function getStateFromStores() {
	return UserCenterStore.getData();
}

var Header = require('../components/Header.js');

var UserCenterHeader = React.createClass({
	propTypes: {
		username: React.PropTypes.string,
		avatar: React.PropTypes.string,
		orderWaitingPayment: React.PropTypes.number,
		orderWaitingReceipt: React.PropTypes.number
	},

	getDefaultProps: function() {
		return {
			username: '[name]',
			avatar: 'images/avatar.jpg',
			orderWaitingPayment: 0,
			orderWaitingReceipt: 0
		};
	},

	render: function() {
		return (
			<div className="user-center-header">
				<div className="user-center-avatar">
					{/*<Link to="/profile">
						<img src={this.props.avatar} width="85" height="85" className="user-center-avatar-img"/>
					</Link>*/}
					<img src={this.props.avatar} width="85" height="85" className="user-center-avatar-img"/>
				</div>
				<div className="user-center-username">
					{this.props.username}
				</div>

				<div className="user-center-order">
					<Link to="/orderlist" query={{tradeCode: 'waitPay'}} className="user-center-order-link">
						{__('waiting payment') + ' (' + this.props.orderWaitingPayment + ')'}
					</Link>
					<Link to="/orderlist" query={{tradeCode: 'waitConfirm'}} className="user-center-order-link">
						{__('waiting receipt') + ' (' + this.props.orderWaitingReceipt + ')'}
					</Link>
				</div>
			</div>
			);
	}
});

var UserCenterNav = React.createClass({
	render: function() {
		return (
			<div className="user-center-nav">
				<Link to="/orderlist" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-order-o"></span>
					</span>
					<span className="user-center-nav-text">
						{__('my orders')}
					</span>
				</Link>
				<Link to="/cart" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-cart"></span>
					</span>
					<span className="user-center-nav-text">
						{__('cart')}
					</span>
				</Link>
				<Link to="/collectedfolder" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-star"></span>
					</span>
					<span className="user-center-nav-text">
						{__('favorites')}
					</span>
				</Link>
				<Link to="/financialaccount" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-finance"></span>
					</span>
					<span className="user-center-nav-text">
						{__('finance center')}
					</span>
				</Link>
				<Link to="/couponslist" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-coupon-o"></span>
					</span>
					<span className="user-center-nav-text">
						{__('coupons')}
					</span>
				</Link>
				<Link to="/accountsecurity" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-security"></span>
					</span>
					<span className="user-center-nav-text">
						{__('account setting')}
					</span>
				</Link>
				<Link to="/commentlist" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-comment-o"></span>
					</span>
					<span className="user-center-nav-text">
						{__('comments')}
					</span>
				</Link>
				<Link to="/notification" className="user-center-nav-item">
					<span className="user-center-nav-icon">
						<span className="icon-horn-o"></span>
					</span>
					<span className="user-center-nav-text">
						{__('notifications')}
					</span>
				</Link>
			</div>
			);
	}
});

var UserCenterLinks = React.createClass({
	render: function() {
		return (
			<div className="user-center-links">
				<Link to="/addresslist" className="user-center-link">
					{__('delivery address')}
					<span className="icon-forward-arrow"></span>
				</Link>
				<Link to="/feedback" className="user-center-link">
					{__('feedback')}
					<span className="icon-forward-arrow"></span>
				</Link>
			</div>
			);
	}
});

var UserCenterSignOut = React.createClass({
	mixins: [ History ],

	render: function () {
		return (
			<button type="button" className="user-center-sign-out" onClick={this._handleSignOut}>
			{__('sign out')}
			</button>
			);
	},

	_handleSignOut: function(e) {
		e.preventDefault();
		UserCenterUtil.signOut(function() {
			CKFM.removeUID();
			this.history.replaceState(null, '/signin');
		}.bind(this));
	}
});

var UserCenter = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		UserCenterStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		UserCenterStore.removeChangeListener(this._onChange);
	},
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('user center')} />
				</div>
				<div className="col-xs-12 trim-col">
					<div className="user-center">
						<UserCenterHeader {...this.state}/>
						<UserCenterNav />
						<UserCenterLinks />
						<UserCenterSignOut />
					</div>
				</div>
			</div>
			);
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = UserCenter;
