require('../../less/sign-in.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var Header = require('./Header.js');
var VerifyCode = require('./VerifyCode.js');

var SignInUtil = require('../utils/SignInUtil.js');
var FormUtil = require('../utils/FormUtil.js');

var CKFM = require('../CKFM.js');

var errMsgMap = {
	'error': __('incorrect account or password'),
	'notExistAccount': __('account not exist'),
	'invalidatePassword': __('wrong password'),
	'wrongPasswordAndShowCaptcha': __('wrong password'),
	'wrongCaptcha': __('wrong verify code'),
	'to_active': __('account not activated'),
	'not_active': __('account not activated'),
	'is_forbidden': __('account is forbidden, please contact us')
};

var ErrorMessage = React.createClass({

	propTypes: {
		msg: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			msg: 'error'
		};
	},

	render: function() {
		return (
			<div>
				{this.props.msg.length > 0 ?
				<div className="alert alert-danger sign-in-alert">
					{errMsgMap[this.props.msg]}
				</div> : null
				}
			</div>
			);
	}
});

var SignInAccount = React.createClass({

	getInitialState: function() {
		return {
			method: 'email'
		};
	},

	render: function() {
		var isEmail = this.state.method === 'email';
		return (
			<div className="form-group">
				<div className="input-group">
				{
					isEmail ?
					<span className="input-group-addon">
						<span className="icon-envelope-o"></span>
					</span>
					:
					<span className="input-group-addon sign-in-c-code">
						<span className="sign-in-c-code-caret"></span>
						<select className="sign-in-c-code-select" name="c-code">
							<option value="+84">(+84)</option>
							<option value="+86">(+86)</option>
						</select>
					</span>
				}
				<input
					type={isEmail ? 'email' : 'tel'}
					className="form-control"
					placeholder={isEmail ? __('email') : __('mobile number')}
					name="account" ref="account" maxLength="32" required/>
					<a href="#" className="sign-in-switch" onClick={this._toggleMethod}>
						<span className="icon-mobile-email-switch"></span>
					</a>
				</div>
			</div>
			);
	},

	_toggleMethod: function(e) {
		e.preventDefault();
		if (this.state.method === 'email') {
			this.setState({
				method: 'mobile'
			});
		} else if (this.state.method === 'mobile') {
			this.setState({
				method: 'email'
			});
		}
		this.refs.account.value = '';
	}
});

var SignIn = React.createClass({

	mixins: [ History ],

	getInitialState: function() {
		return {
			msg: '',
			needCaptcha: false,
			t: 0
		};
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('sign in')}/>
				</div>
				<div className="col-xs-12">
					<div className="sign-in">
						<div className="sign-in-logo">
							<img src="images/logo_dark.png"/>
						</div>

						<form className="form-horizontal sign-in-form" onSubmit={this._handleSubmit}>
							<SignInAccount ref="signInAccount"/>
							<div className="form-group">
								<div className="input-group">
									<span className="input-group-addon">
										<span className="icon-lock-o"></span>
									</span>
									<input type="password" className="form-control" placeholder={__('password')} name="password" ref="password" maxLength="32" required/>
								</div>
							</div>

							{this.state.needCaptcha ? <VerifyCode t={this.state.t}/> : null}

							<ErrorMessage msg={this.state.msg}/>

							<div className="form-group sign-in-links">
								<Link to="/forgetpassword" className="pull-left">{__('forget password')}</Link>
								<Link to="/signup" className="pull-right">{__('sign up')}</Link>
							</div>
							<div className="form-group">
								<button type="submit" className="btn btn-primary btn-block btn-rect">
								{__('sign in')}
								</button>
							</div>
						</form>

						<div className="sign-in-hint">
							{__('click')}
							<span style={{
								fontSize: '24px',
								display: 'inline-block',
								color: 'white',
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								padding: '3px',
								verticalAlign: 'middle',
								marginLeft: '5px',
								marginRight: '5px'
							}} className="icon-mobile-email-switch" />
							{__('to switch the way to sign in')}
						</div>

						{/*<div className="sign-in-social">
							<div className="sign-in-social-text">
								<span>{__('sign in with')}</span>
							</div>
							<div className="sign-in-social-links">
								<a href="#" className="sign-in-social-facebook">
									<span className="icon-facebook"></span>
								</a>
								<a href="#" className="sign-in-social-google">
									<span className="icon-google-plus"></span>
								</a>
							</div>
						</div>*/}
					</div>
				</div>
			</div>
			);
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.account ||
			!data.password ||
			data.account.length < 6 ||
			data.account.length > 32 ||
			data.password.length < 6 ||
			data.password.length > 32) {
			this.setState({
				msg: 'error',
				needCaptcha: this.state.needCaptcha,
				t: new Date().getTime()
			});
			return false;
		}

		// just for safari
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					msg: 'error',
					needCaptcha: this.state.needCaptcha,
					t: new Date().getTime()
				});
				return false;
			}
		}

		SignInUtil.signIn(data, function(res) {
			var loc = this.props.location;

			if (res.account) {
				this.setState({
					msg: '',
					needCaptcha: false
				});
				CKFM.setUID(res.account);

				if (loc.state && loc.state.nextPathname) {
					this.history.replaceState(null, loc.state.nextPathname);
				}
				else {
					this.history.pushState(null, '/usercenter');
				}
				return;
			}

			if (res.result === 'wrongPasswordAndShowCaptcha' || res.result === 'wrongCaptcha') {
				this.setState({
					msg: res.result,
					needCaptcha: true,
					t: new Date().getTime()
				});
				return;
			}

			this.setState({
				msg: res.result,
				needCaptcha: this.state.needCaptcha,
				t: new Date().getTime()
			});
		}.bind(this));

		return false;
	}
});

module.exports = SignIn;
