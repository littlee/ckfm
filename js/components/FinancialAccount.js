require('../../less/financial-account.less');

var Link = require('react-router').Link;
var CKFM = require('../CKFM.js');
var React = require('react');
var Header = require('./Header.js');
var FuncUtil = require('../utils/FuncUtil.js');
var FinancialAccountStore = require('../stores/FinancialAccountStore.js');

function getStateFromStores() {
	return FinancialAccountStore.getData();
}

var OptItem = React.createClass({
	propTypes: {
		link: React.PropTypes.string,
		iconName: React.PropTypes.string,
		title: React.PropTypes.string,
		style: React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			link: '/yourLink',
			iconName: 'icon-login',
			title: __('recharge'),
			style: 'grid'
		};
	},
	render: function() {
		var cl = 'financial-account-operation-item ' + this.props.style;
		return (
			<Link to={this.props.link} className={cl}>
				<span className={this.props.iconName}></span>
				<span>{this.props.title}</span>
				{this.props.style !== 'grid' ? <span className="icon-forward-arrow"></span> : null }
			</Link>
			);
	}
});

var Operation = React.createClass({
	render: function() {
		return (
			<div className="col-xs-12 trim-col">
				<div className="financial-account-operation fix-bottom">
					<OptItem link={`/recharge`} iconName={`icon-recharge`} title={__('recharge')} style={`grid`}/>
					<OptItem link={`/transaction`} iconName={`icon-transaction`} title={__('transaction')} style={`grid`}/>
					{ /*<OptItem link={`financialaccount/bindbankcard`} iconName={`icon-bind-card`} title={__('bind bank card')} style={`line`}/>*/ }
				</div>
			</div>
			);
	}
});

var AmountBox = React.createClass({
	getDefaultProps: function(){
		return {
			balance: 0
		};
	},
	render: function() {
		var amount = FuncUtil.disCountryPrice(this.props.balance);
		return (
			<div className="col-xs-12 trim-col">
				<div className="financial-account-amount-box">
					<div className="financial-account-total-amount">
						<h3 className="amount money-text">{ amount }&nbsp;{CKFM.getCurrency()}</h3>
						<p className="des">{__('account amount')}</p>
					</div>
				</div>
      </div>
			);
	}
});

var FinancialAccount = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		FinancialAccountStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		FinancialAccountStore.removeChangeListener(this._onChange);
	},

	render: function() {
		var title = __('financial account');
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={title}/>
				</div>
				<div className="financial-account-module">
					<AmountBox balance={this.state.balance}/>
					<Operation />
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = FinancialAccount;
