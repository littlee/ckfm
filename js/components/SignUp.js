require('../../less/sign-up.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var Header = require('./Header.js');
var VerifyCode = require('./VerifyCode.js');

var SignUpUtil = require('../utils/SignUpUtil.js');
var FormUtil = require('../utils/FormUtil.js');

var errMsgMap = {
	'wrongFormSubmit': __('incorrect register information'),
	'invalidateCaptcha': __('wrong verify code'),
	'wrongCaptcha': __('wrong verify code'),
	'userIsExist': __('account has already registered'),
	'passwordNotMatch': __('confirm password does not match'),
	'invalidEmail': __('invalid email'),
	'invalidMobileNumber': __('invalid mobile number'),
	'wrongPasswordPattern': __('password should contain 6 - 32 characters, excluding space'),
	'emptyEmailOrCaptcha': __('please fill in e-mail and captcha'),
	'emptyMobileOrCaptcha': __('please fill in mobile number and captcha'),
	'sendEmailFail': __('send faild, may be an invalid e-mail'),
	'sendPhoneCodeFail': __('send faild, may be an invalid mobile number'),
	'frequently': __('frequent operation, retry in 1 minute'),
	'randomCodeWrong-email': __('wrong e-mail verify code'),
	'randomCodeWrong-mobile': __('wrong mobile verify code')
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
				<div className="alert alert-danger sign-in-alert">
				{errMsgMap[this.props.error]}
			</div> : null
			}
			</div>
			);
	}
});

var SignUpEmail = React.createClass({
	getInitialState: function() {
		return {
			valid: '',
			rValid: '',
			waiting: false,
			time: 60,
			send: false
		};
	},

	componentWillUnmount: function() {
		clearInterval(this.int);
	},

	render: function() {

		return (
			<div ref="wrap">
				<div className="form-group">
					<div className="input-group">
						<span className="input-group-addon">
							<span className="icon-envelope-o"></span>
						</span>
						<input type="email" className="form-control" placeholder={__('email')} name="account" onChange={this._checkAccount} ref="email" required/>
					</div>
					<div className="text-danger">
						{errMsgMap[this.state.valid]}
					</div>
				</div>
				<VerifyCode t={-1}/>
				<SignUpRandomCode 
					placeholder={__('e-mail verify code')}
					onClick={this._sendRandomCode}
					waiting={this.state.waiting}
					time={this.state.time}
					send={this.state.send}
					sendText={__('e-mail verify code has been sent')}
					infoText={__('click the \"send\" button, you will receive a verify code e-mail')}
					valid={errMsgMap[this.state.rValid]}/>
			</div>
			);
	},

	_checkAccount: function() {
		var emailVal = this.refs.email.value;
		var emailReg = /^[a-z0-9][-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

		if (!emailReg.test(emailVal)) {
			this.setState({
				valid: 'invalidEmail'
			});
			return;
		}
		SignUpUtil.checkAccountExist(emailVal, function(result) {
			if (result.valid === 'true') {
				this.setState({
					valid: ''
				});
				return;
			}
			this.setState({
				valid: 'userIsExist'
			});
		}.bind(this));
	},

	_sendRandomCode: function() {
		var data = FormUtil.formToObject(this.refs.wrap);
		if (!data.account || !data.captcha) {
			this.setState({
				rValid: 'emptyEmailOrCaptcha'
			});
			return;
		}

		if (!/^[\d]{4}$/.test(data.captcha)) {
			this.setState({
				rValid: 'wrongCaptcha'
			});
			return;
		}

		if (this.state.valid.length > 0) {
			this.setState({
				rValid: this.state.valid
			});
			return;
		}

		this.setState({
			waiting: true
		});

		SignUpUtil.sendRandomCode(data, function(res) {
			
			if (res.result === 'sendEmailSuccess') {
				this.setState({
					waiting: true,
					rValid: '',
					send: true
				});
				this.int = setInterval(this._tick, 1000);
				return;
			}

			this.setState({
				waiting: false,
				send: false,
				rValid: res.result
			});

		}.bind(this));
	},

	_tick: function() {
		this.setState({
			time: --this.state.time
		});

		if (this.state.time <= 0) {
			this._stopTick();
		}
	},

	_stopTick: function() {
		clearInterval(this.int);
		this.setState({
			waiting: false,
			time: 60
		});
	}
});

var SignUpMobile = React.createClass({
	getInitialState: function() {
		return {
			valid: '',
			rValid: '',
			waiting: false,
			time: 60,
			send: false
		};
	},

	componentWillUnmount: function() {
		clearInterval(this.int);
	},

	render: function() {
		return (
			<div ref="wrap">
				<div className="form-group">
					<div className="input-group">
						<span className="input-group-addon sign-up-c-code">
							<span className="sign-up-c-code-caret"></span>
							<select className="sign-up-c-code-select" name="c-code" ref="cCode" onChange={this._checkAccount}>
								<option value="+84">(+84)</option>
								<option value="+86">(+86)</option>
							</select>
						</span>
						<input type="tel" className="form-control" placeholder={__('mobile number')} name="account" required ref="mobile" onChange={this._checkAccount}/>
					</div>
					<div className="text-danger">
						{errMsgMap[this.state.valid]}
					</div>
				</div>
				<VerifyCode t={-1}/>
				<SignUpRandomCode 
					placeholder={__('mobile verify code')}
					onClick={this._sendRandomCode}
					waiting={this.state.waiting}
					time={this.state.time}
					send={this.state.send}
					sendText={__('mobile verify code has been sent')}
					infoText={__('click the \"send\" button, you will receive a verify code message')}
					valid={errMsgMap[this.state.rValid]}/>
			</div>
			);
	},

	_checkAccount: function() {
		var cCodeVal = this.refs.cCode.value;
		var mobileVal = this.refs.mobile.value;
		var mobileReg = /^[\d-+]{6,15}$/;

		if (!mobileReg.test(mobileVal)) {
			this.setState({
				valid: 'invalidMobileNumber'
			});
			return;
		}
		SignUpUtil.checkAccountExist(cCodeVal + mobileVal, function(result) {
			if (result.valid === 'true') {
				this.setState({
					valid: ''
				});
				return;
			}
			this.setState({
				valid: 'userIsExist'
			});
		}.bind(this));
	},

	_sendRandomCode: function() {
		var data = FormUtil.formToObject(this.refs.wrap);
		if (!data.account || !data.captcha) {
			this.setState({
				rValid: 'emptyMobileOrCaptcha'
			});
			return;
		}

		if (!/^[\d]{4}$/.test(data.captcha)) {
			this.setState({
				rValid: 'wrongCaptcha'
			});
			return;
		}

		if (this.state.valid.length > 0) {
			this.setState({
				rValid: this.state.valid
			});
			return;
		}

		this.setState({
			waiting: true
		});

		SignUpUtil.sendRandomCode(data, function(res) {
			
			if (res.result === 'sendPhoneCodeSuccess') {
				this.setState({
					waiting: true,
					rValid: '',
					send: true
				});
				this.int = setInterval(this._tick, 1000);
				return;
			}

			this.setState({
				waiting: false,
				send: false,
				rValid: res.result
			});

		}.bind(this));
	},

	_tick: function() {
		this.setState({
			time: --this.state.time
		});

		if (this.state.time <= 0) {
			this._stopTick();
		}
	},

	_stopTick: function() {
		clearInterval(this.int);
		this.setState({
			waiting: false,
			time: 60
		});
	}
});

var SignUpRandomCode = React.createClass({
	render: function() {
		var rStyle = {
			'WebkitAppearance': 'none',
			'MozAppearance': 'none'
		};

		var alertStyle = {
			'marginBottom': '0'
		};

		return (
			<div className="form-group">
				<div className="input-group">
					<span className="input-group-addon">
						<span className="icon-vertify-code-o"></span>
					</span>
					<input type="number" className="form-control" placeholder={this.props.placeholder} style={rStyle} name="randomCode" required/>
					<span className="input-group-btn">
						<button className="btn btn-primary btn-rect" type="button" onClick={this.props.onClick} disabled={this.props.waiting ? true : false}>
							{this.props.waiting ? this.props.time : __('send')}
						</button>
					</span>
				</div>
				<div className="text-danger">
					{this.props.valid}
				</div>
				{this.props.send ? <div className="text-success">{this.props.sendText}</div> : null}
				<div className="alert alert-info" style={alertStyle}>
					{this.props.infoText}
				</div>
			</div>
			);
	}
});

var SignUp = React.createClass({

	mixins: [ History ],

	getInitialState: function() {
		return {
			error: '',
			method: 'email'
		};
	},

	render: function() {
		var viaEmail = this.state.method === 'email';

		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('sign up')}/>
				</div>
				<div className="col-xs-12">
					<div className="sign-up">
						<div className="sign-up-logo">
							<img src="images/logo_dark.png"/>
						</div>

						<div className="sign-up-tabs">
							<a href="#" className={viaEmail? 'active' : ''} onClick={this._changeTab.bind(this, 'email')}>
								<span className="icon-envelope-o"></span>
								{__('via email')}
							</a>
							<a href="#" className={!viaEmail ? 'active' : ''} onClick={this._changeTab.bind(this, 'mobile')}>
								<span className="icon-mobile"></span>
								{__('via mobile')}
							</a>
						</div>

						<form className="form-horizontal sign-up-form" onSubmit={this._handleSubmit}>

							{viaEmail ? <SignUpEmail /> : <SignUpMobile />}				

							<div className="form-group">
								<div className="input-group">
									<span className="input-group-addon">
										<span className="icon-lock-o"></span>
									</span>
									<input type="password" className="form-control" placeholder={__('password')} name="password" required/>
								</div>
							</div>

							<div className="form-group">
								<div className="input-group">
									<span className="input-group-addon">
										<span className="icon-check-lock-o"></span>
									</span>
									<input type="password" className="form-control" placeholder={__('confirm password')} name="cpassword" required/>
								</div>
							</div>

							<p>
								{__('by clicking \"sign up\", you agree to our')}
								&nbsp;
								<Link to="/userprotocol">{__('user protocol')}</Link>
							</p>

							<ErrorMessage error={this.state.error}/>

							<div className="form-group">
								<button type="submit" className="btn btn-primary btn-block btn-rect">
								{__('sign up')}
								</button>
							</div>

							<div className="form-group">
								<Link to="/signin" className="btn btn-default btn-block btn-rect">
									{__('sign in')}
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
			);
	},

	_changeTab: function(m, e) {
		e.preventDefault();
		this.setState({
			method: m
		});
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.account ||
			!data.password ||
			!data.cpassword ||
			!data.captcha) {
			this.setState({
				error: 'wrongFormSubmit'
			});
			return false;
		}

		if (!/^[\d]{4}$/.test(data.captcha)) {
			this.setState({
				error: 'invalidateCaptcha'
			});
			return false;
		}

		if (!/^[\d]{6}$/.test(data.randomCode)) {
			var nErr = 'randomCodeWrong-';
			if (this.state.method === 'email') {
				nErr += 'email';
			}
			else {
				nErr += 'mobile';
			}
			this.setState({
				error: nErr
			});
			return false;
		}

		if (data.password.length < 6 || data.password.length > 32 || !/^[^\s]*$/.test(data.password)) {
			this.setState({

				error: 'wrongPasswordPattern'
			});
			return false;
		}

		if (data.password !== data.cpassword) {
			this.setState({
				error: 'passwordNotMatch'
			});
			return false;
		}

		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					error: 'wrongFormSubmit'
				});
				return false;
			}
		}

		Object.keys(data).forEach(function(k) {
			data[k] = data[k].trim();
		});

		SignUpUtil.signUp(data, function(res) {
			if (res.result === 'registerSuccess') {
				this.setState({
					error: ''
				});
				this.history.pushState(null, '/signupsuccess');
				return;
			}

			if (res.result === 'randomCodeWrong') {
				var nErr = 'randomCodeWrong-';
				if (this.state.method === 'email') {
					nErr += 'email';
				}
				else {
					nErr += 'mobile';
				}
				this.setState({
					error: nErr
				});
				return;
			}

			this.setState({
				error: res.result
			});
		}.bind(this));

		return false;
	}
});

module.exports = SignUp;