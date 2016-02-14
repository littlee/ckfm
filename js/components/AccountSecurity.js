var React = require('react');
var Header = require('./Header.js');
var AccountSecurityStore = require('../stores/AccountSecurityStore.js');
require('../../less/account-security.less');
var Modal = require('react-modal');
var History = require('react-router').History;
const customStyles = {
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
	content: {
		top: '50%',
		left: '50%',
		right: '30%',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};

function getStateFromStores() {
	return {
		securityStatus: AccountSecurityStore.getStatus(),
		modalIsOpen: false
	};
}
var Set = React.createClass({
	saveTypeSet: function(type) {
		this.props.onChangeType(type);
		this.props.onOpenModal();
	},
	render: function() {
		return (<span>
				<span className="account-security-list-status">
					<span className="account-security-list-status-icon account-security-list-status-set">
						<span className="icon-checked-o"></span>
					</span>
					{__('already set')}
				</span>
				{this.props.defaultLogin ?
				<span className="account-security-list-edit account-security-list-edit-unable">
					{__('modify')}
					<span className="icon-forward-arrow account-security-list-edit-arrow"></span>
				</span> :
				<span className="account-security-list-edit" onClick={this.saveTypeSet.bind(this, this.props.type)}>
					{__('modify')}
					<span className="icon-forward-arrow account-security-list-edit-arrow"></span>
				</span>}
			</span>);
	}
});
var UnSet = React.createClass({
	mixins: [History],
	saveTypeUnSet: function(type, typeOne) {
		this.props.onChangeType(type);
		this.props.onSetTypeOne(typeOne);
		this.history.pushState(null, "/securitycommon");
	},
	render: function() {
		return (<span>
				<span className="account-security-list-status">
					<span className="account-security-list-status-icon account-security-list-status-unset">
						<span className="icon-clear"></span>
					</span>
					{this.props.type === "isFinancialActive" ? __('not activated') : __('not set')}
				</span>
				<span className="account-security-list-edit" onClick={this.saveTypeUnSet.bind(this, this.props.type, "stepOnePsd")}>
					{this.props.type === "isFinancialActive" ? __('activate') : __('set up')}
					<span className="icon-forward-arrow account-security-list-edit-arrow"></span>
				</span>
			</span>);
	}
});
var SecurityItem = React.createClass({
	render: function() {
		var securityItem = [];
		var self = this;
		if (this.props.statusArray) {
			securityItem = this.props.statusArray.map(function(item, index) {
				switch (item.name) {
				case "isSetSecurityAns":
					return (<div className="account-security-list-item" key={index}>
								<span className="account-security-list-icon">
								<span className="icon-psd-security"></span>
								</span>
								{__('security question')}
								{item.value ? <Set onOpenModal={self.handleModal} type="isSetSecurityAns" onChangeType={self.handleChangeType}/> : <UnSet type="isSetSecurityAns" onChangeType={self.handleChangeType} onSetTypeOne={self.setTypeOne.bind(self, "stepOnePsd")}/>}
							</div>);
					break;
				case "isFinancialActive":
					return (<div className="account-security-list-item" key={index}>
								<span className="account-security-list-icon">
									<span className="icon-pay-psd"></span>
								</span>
								{__('payment password')}
								{item.value ? <Set onOpenModal={self.handleModal} type="isFinancialActive" onChangeType={self.handleChangeType}/> : <UnSet type="isFinancialActive" onChangeType={self.handleChangeType} onSetTypeOne={self.setTypeOne.bind(self, "stepOnePsd")}/>}
							</div>);
					break;
				case "isSetEmail":
					return (<div className="account-security-list-item" key={index}>
								<span className="account-security-list-icon">
									<span className="icon-verify-email"></span>
								</span>
								{__('verify mailbox')}
								{item.value ? <Set onOpenModal={self.handleModal} type="isSetEmail" onChangeType={self.handleChangeType} defaultLogin={item.isDefault}/> : <UnSet type="isSetEmail" onChangeType={self.handleChangeType} onSetTypeOne={self.setTypeOne.bind(self, "stepOnePsd")}/>}
							</div>);
					break;
				case "isSetPhone":
					return (<div className="account-security-list-item" key={index}>
								<span className="account-security-list-icon">
									<span className="icon-verify-phone"></span>
								</span>
								{__('verify phone')}
								{item.value ? <Set onOpenModal={self.handleModal} type="isSetPhone"  onChangeType={self.handleChangeType} defaultLogin={item.isDefault}/> : <UnSet type="isSetPhone"  onChangeType={self.handleChangeType} onSetTypeOne={self.setTypeOne.bind(self, "stepOnePsd")}/>}
								</div>);
					break;
				case "isSetPassword":
					return (<div className="account-security-list-item" key={index}>
								<span className="account-security-list-icon">
									<span className="icon-login-psd"></span>
								</span>
								{__('login password')}
								{item.value ? <Set onOpenModal={self.handleModal} type="isSetPassword"  onChangeType={self.handleChangeType}/> : <UnSet type="isSetPassword"  onChangeType={self.handleChangeType} onSetTypeOne={self.setTypeOne.bind(self, "stepOnePsd")}/>}
								</div>);
					break;
				}
			});
		}
		return (<div className="account-security-list">
					{securityItem}
				</div>);
	},
	handleChangeType: function(type) {
		var data = {
			"type": type
		};
		sessionStorage.setItem('securityType', JSON.stringify(data));
	},
	handleModal: function() {
		this.props.onOpenModal();
	},
	setTypeOne: function(typeOne) {
		this.props.onTypeOneOrigin(typeOne);
	}
});
var VerifyMeans = React.createClass({
	mixins: [History],
	render: function() {
		var means = [];
		var self = this;
		if (this.props.statusArray) {
			means = this.props.statusArray.map(function(item, index) {
				switch (item.name) {
				case "isSetEmail":
					if (item.value) return (<span className="account-security-modal-means-item" onClick={self.setTypeOne.bind(self, "stepOneEmail")} key={index}>
									<span className="account-security-modal-means-icon">
										<span className="icon-verify-email"></span>
									</span>
									<span className="account-security-modal-means-text">
										{__('email verification')}
									</span>
								</span>);
					break;
				case "isSetPhone":
					if (item.value) return (<span className="account-security-modal-means-item" onClick={self.setTypeOne.bind(self, "stepOnePhone")} key={index}>
									<span className="account-security-modal-means-icon">
										<span className="icon-verify-phone"></span>
									</span>
									<span className="account-security-modal-means-text">
										{__('phone verification')}
									</span>
								</span>);
					break;
				case "isSetSecurityAns":
					if (item.value) return (<span className="account-security-modal-means-item" onClick={self.setTypeOne.bind(self, "stepOneSecurityAns")} key={index}>
									<span className="account-security-modal-means-icon">
										<span className="icon-psd-security"></span>
									</span>
									<span className="account-security-modal-means-text">
										{__('security verification')}
									</span>
								</span>);
					break;
				}
			});
		}
		return (<div className="account-security-modal-means">
				{means}
			</div>);
	},
	setTypeOne: function(typeOne) {
		this.props.onTypeOneOrigin(typeOne);
		this.history.pushState(null, "/securitycommon");
	}
});
var AccountSecurity = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
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
	componentDidMount: function() {
		AccountSecurityStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AccountSecurityStore.removeChangeListener(this._onChange);
	},
	render: function() {
		//caculate rate
		var rate = null;
		var trueNum = 0;
		if (this.state.securityStatus) {
			var len = this.state.securityStatus.length;
			this.state.securityStatus.map(function(item) {
				if (item.value) trueNum++;
			});
			rate = trueNum / len * 100;
		}
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('account security')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="account-security">
						<div className="account-security-level">
							<div className="account-security-level-circle">
								{rate}
							</div>
							<span className="account-security-level-name">
								{__('security level')}
							</span>
						</div>
						<SecurityItem statusArray={this.state.securityStatus} onOpenModal={this.openModal} onTypeOneOrigin={this.handleTypeOne}/>
						<Modal
							isOpen={this.state.modalIsOpen}
							onRequestClose={this.closeModal}
							style={customStyles} className="account-security-modal">
							<div>
								<span className="account-security-modal-close" onClick={this.closeModal}>
									<span className="icon-close"></span>
								</span>
								<VerifyMeans statusArray={this.state.securityStatus} onTypeOneOrigin={this.handleTypeOne}/>
							</div>
						</Modal>
					</div>
				</div>
			</div>
			);
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	},
	handleTypeOne: function(typeOne) {
		var data = {
			typeOne: typeOne
		};
		sessionStorage.setItem('securityTypeOne', JSON.stringify(data));
	}
});
module.exports = AccountSecurity;