require('../../less/profile.less');
var React = require('react');
var Modal = require('react-modal');
var Link = require('react-router').Link;
var ProfileActionCreators = require('../actions/ProfileActionCreators.js');
var ProfileStore = require('../stores/ProfileStore.js');
var CKFM = require('../CKFM.js');

function getStateFromStores() {
	return ProfileStore.getData();
}

var Header = require('../components/Header.js');

var errMsgMap = {
	'invalidName': __('username can not be empty and should be less than 32 characters')
};

var ErrorMessage = React.createClass({

	propTypes: {
		error: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			error: 'error'
		};
	},

	render: function() {
		var show = false;
		show = this.props.error.length > 0;
		return (
			<div>
			{show ?
				<div className="alert alert-danger">
				{errMsgMap[this.props.error]}
			</div> : null
			}
			</div>
			);
	}
});

var ProfileAvatar = React.createClass({
	render: function() {
		return (
			<div className="profile-avatar">
				<span className="profile-avatar-title">
					{__('avatar')}
				</span>

				<img src={this.props.avatar} className="profile-avatar-img" onClick={this._handleClickAvatar} ref="img"/>

				<input type="file" name="avatar" ref="avatarfile" accept="image/*" className="hidden" onChange={this._handleChangeAvatar}/>
			</div>
			);
	},

	_handleClickAvatar: function(e) {
		e.preventDefault();
		this.refs.avatarfile.click();
	},

	_handleChangeAvatar: function(e) {
		var input = e.target;
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				this.refs.img.src = e.target.result;
			}.bind(this);

			reader.readAsDataURL(input.files[0]);
		}
	}
});

var ProfileName = React.createClass({
	getInitialState: function() {
		return {
			openModal: false,
			valid: ''
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
				backgroundColor: 'rgba(0, 0, 0, 0.75)'
			},
			content: {
				position: 'absolute',
				top: '50px',
				left: '0',
				right: '0',
				bottom: '10px',
				marginLeft: 'auto',
				marginRight: 'auto',
				border: '1px solid #ccc',
				background: '#fff',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: '0',
				outline: 'none',
				padding: '10px',
				width: '90%'
			}
		};

		return (
			<div>
				<div className="profile-link" onClick={this._openModal}>
					<div className="profile-link-key">
						{__('username')}
					</div>
					<div className="profile-link-value">
						{this.props.name}
					</div>

					<span className="profile-link-icon">
						<span className="icon-forward-arrow"></span>
					</span>
				</div>
				<Modal
					isOpen={this.state.openModal}
					onRequestClose={this._closeModal}
					style={mStyle}>

					<h4 className="text-center">{__('edit username')}</h4>
					<input type="text" name="name" className="form-control" defaultValue={this.props.name} ref="name"/>
					<ErrorMessage error={this.state.valid}/>
					<div className="profile-link-modal-btns">
						<button type="button" className="btn btn-primary btn-rect btn-block" onClick={this._modifyUsername}>
							{__('ok')}
						</button>
						<button type="button" className="btn btn-default btn-rect btn-block" onClick={this._closeModal}>
							{__('cancel')}
						</button>
					</div>
				</Modal>
			</div>
			);
	},

	_openModal: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		this.setState({
			openModal: true,
			valid: ''
		});
	},

	_closeModal: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		this.setState({
			openModal: false
		});
	},

	_modifyUsername: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		var nameVal = this.refs.name.value;

		if (nameVal.length === 0 || nameVal.length > 32) {
			this.setState({
				valid: 'invalidName'
			});
			return;
		}

		ProfileActionCreators.modifyUsername(nameVal);
		this._closeModal();
	}
});

var ProfileGender = React.createClass({
	render: function() {
		return (
			<div>
				<div className="profile-link" onClick={this._openModal}>
					<div className="profile-link-key">
						{__('gender')}
					</div>
					<div className="profile-link-value">
						<select name="gender" defaultValue={this.props.gender} className="profile-link-select">
							<option value="">{__('not set')}</option>
							<option value="male">{__('male')}</option>
							<option value="femail">{__('female')}</option>
						</select>
					</div>

					<span className="profile-link-icon">
						<span className="icon-forward-arrow"></span>
					</span>
				</div>
			</div>
			);
	}
});

var ProfileLocation = React.createClass({
	getInitialState: function() {
		return {
			openModal: false,
			valid: ''
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
				backgroundColor: 'rgba(0, 0, 0, 0.75)'
			},
			content: {
				position: 'absolute',
				top: '50px',
				left: '0',
				right: '0',
				bottom: '10px',
				marginLeft: 'auto',
				marginRight: 'auto',
				border: '1px solid #ccc',
				background: '#fff',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: '0',
				outline: 'none',
				padding: '10px',
				width: '90%'
			}
		};

		return (
			<div>
				<div className="profile-link" onClick={this._openModal}>
					<div className="profile-link-key">
						{__('location')}
					</div>
					<div className="profile-link-value">
						{this.props.region},
						{this.props.city},
						{this.props.state},
						{this.props.country}
					</div>

					<span className="profile-link-icon">
						<span className="icon-forward-arrow"></span>
					</span>
				</div>
				<Modal
					isOpen={this.state.openModal}
					onRequestClose={this._closeModal}
					style={mStyle}>

					<h4 className="text-center">{__('edit location')}</h4>
					<div>
						<label>{__('location detail')}</label>
						<div className="form-group">
							<select name="country" className="form-control">
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</select>
						</div>
						<div className="form-group">
							<select name="state" className="form-control">
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</select>
						</div>
						<div className="form-group">
							<select name="city" className="form-control">
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</select>
						</div>
						<div className="form-group">
							<select name="region" className="form-control">
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</select>
						</div>
						<div className="form-group">
							<label>{__('location detail')}</label>
							<input type="text" name="addrDetail" className="form-control" />
						</div>
					</div>
					<ErrorMessage error={this.state.valid}/>
					<div className="profile-link-modal-btns">
						<button type="button" className="btn btn-primary btn-rect btn-block" onClick={this._modifyUsername}>
							{__('ok')}
						</button>
						<button type="button" className="btn btn-default btn-rect btn-block" onClick={this._closeModal}>
							{__('cancel')}
						</button>
					</div>
				</Modal>
			</div>
			);
	},

	_openModal: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		this.setState({
			openModal: true,
			valid: ''
		});
	},

	_closeModal: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		this.setState({
			openModal: false
		});
	},

	_modifyUsername: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		var nameVal = this.refs.name.value;

		if (nameVal.length === 0 || nameVal.length > 32) {
			this.setState({
				valid: 'invalidName'
			});
			return;
		}

		ProfileActionCreators.modifyUsername(nameVal);
		this._closeModal();
	}
});

var ProfileAddress = React.createClass({
	render: function() {
		return (
			<div>
				<Link to="/addressmanagement" className="profile-link" onClick={this._openModal}>
					<div className="profile-link-key">
						{__('recipient address')}
					</div>
					<div className="profile-link-value">
						{this.props.count}
					</div>

					<span className="profile-link-icon">
						<span className="icon-forward-arrow"></span>
					</span>
				</Link>
			</div>
			);
	}
});

var Profile = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		ProfileStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ProfileStore.removeChangeListener(this._onChange);
	},
	
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('user profile')} />
				</div>
				<div className="col-xs-12 trim-col">
					<div className="profile">
						<ProfileAvatar avatar={this.state.image} />
						<ProfileName name={this.state.name} />
						<ProfileGender gender={this.state.gender} />
						<ProfileAddress count={this.state.addrCount} />
						<ProfileLocation
							country={this.state.country}
							state={this.state.state}
							city={this.state.city}
							region={this.state.region} />
					</div>
				</div>
			</div>
			);
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Profile;