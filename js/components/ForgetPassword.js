require('../../less/forget-password.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var Header = require('./Header.js');

var FormUtil = require('../utils/FormUtil.js');
var ForgetPasswordUtil = require('../utils/ForgetPasswordUtil.js');

var stepText = [__('fill in account'), __('verification'), __('set new password'), __('complete')];
var errMsgMap = {
	'invalidEmail': __('invalid email'),
	'invalidMobileNumber': __('invalid mobile number'),
	'wrongFormSubmit': __('incorrect form information'),
	'wrongCaptcha': __('wrong verify code'),
	'notExistAccount': __('account not exist'),
	'unknowPhone': __('invalid mobile number'),
	'frequently': __('frequent operation, retry in 1 minute'),
	'sendPhoneCodeFail': __('send failed, may be an invalid mobile number'),
	'randomCodeWrong': __('wrong verify code, you can click \"resend\" to receive a new verify code if needed'),
	'passwordNotMatch': __('confirm password does not match'),
	'wrongPasswordPattern': __('password should contain 6 - 32 characters, excluding space'),
	'emptyPassword': __('password is required'),
	'resetFail': __('reset faild, please return to first step and try again')
};

var VerifyCodeImg = React.createClass({
	getInitialState: function() {
		return {
			t: 0
		};
	},

	render: function() {
		return (
			<img src={'/cooka-user-web/captchaImage.do?' + this.state.t} onClick={this._update}/>
			);
	},

	_update: function() {
		this.setState({
			t: new Date().getTime()
		});
	}
});

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
			<div className="trim-out">
			{show ?
				<div className="alert alert-danger forgetp-alert">
			{errMsgMap[this.props.error]}
			</div> : null
			}
			</div>
			);
	}
});

var EmailStep1 = React.createClass({

	render: function() {
		return (
			<form className="form-horizontal" onSubmit={this.props.onSubmit}>
				<div className="form-group forgetp-fill-block">
					<div className="col-xs-2 trim-right">
						<div className="forgetp-fill-icon">
							<span className="icon-envelope-o"></span>
						</div>
					</div>
					<div className="col-xs-9">
						<input type="email" placeholder={__('email')} name="account" className="form-control" required/>
					</div>
				</div>
				<div className="form-group forgetp-fill-block">
					<div className="col-xs-2 trim-right">
						<div className="forgetp-fill-icon">
							<span className="icon-vertify-code-o"></span>
						</div>
					</div>
					<div className="col-xs-5">
						<input type="number" placeholder={__('verify code')} name="captcha" className="form-control" required/>
					</div>
					<div className="col-xs-5">
						<VerifyCodeImg/>
					</div>
				</div>
				<ErrorMessage error={this.props.error}/>
				<div className="form-group forgetp-fill-btn">
					<button type="submit" className="btn btn-primary btn-block btn-rect">
						{__('next step')}
					</button>
				</div>
			</form>
			);
	}
});

var MobileStep1 = React.createClass({
	render: function() {
		return (
			<form className="form-horizontal" onSubmit={this.props.onSubmit}>
				<div className="form-group forgetp-fill-block">
					<div className="col-xs-3 trim-right">
						<div className="forgetp-c-code">
							<span className="forgetp-c-code-caret"></span>
							<select className="form-control forgetp-c-code-select" name="c-code" ref="cCode">
								<option value="+84">(+84)</option>
								<option value="+86">(+86)</option>
							</select>
						</div>
					</div>
					<div className="col-xs-9">
						<input type="tel" placeholder={__('mobile number')} name="account" className="form-control" required/>
					</div>
				</div>
				<div className="form-group forgetp-fill-block">
					<div className="col-xs-3 trim-right">
						<div className="forgetp-fill-icon">
							<span className="icon-vertify-code-o"></span>
						</div>
					</div>
					<div className="col-xs-5">
						<input type="number" placeholder={__('verify code')} name="captcha" className="form-control" required/>
					</div>
					<div className="col-xs-4 trim-left">
						<VerifyCodeImg/>
					</div>
				</div>
				<ErrorMessage error={this.props.error}/>
				<div className="form-group forgetp-fill-btn">
					<button type="submit" className="btn btn-primary btn-block btn-rect">
						{__('next step')}
					</button>
				</div>
			</form>
			);
	}
});

var ForgetPasswordStep2 = React.createClass({
	render: function() {
		var viaEmail = this.props.method === 'email';
		return (
			<div>
				<div className="forgetp-info">
					<p>
						{viaEmail ? __('we\'ve sent a verify code e-mail to') : __('we\'ve sent a verify code message to')}
						<br />
						<strong>{this.props.account}</strong>
						<br />
						{__('enter the verify code to continue')}
					</p>
				</div>

				<form className="form-horizontal" onSubmit={this.props.onSubmit}>
					<input type="hidden" name="account" value={this.props.account} />
					<div className="form-group forgetp-fill-block">
						<div className="col-xs-2">
							<div className="forgetp-fill-icon">
								<span className="icon-vertify-code-o"></span>
							</div>
						</div>
						<div className="col-xs-6 trim-right">
							<input type="number" className="form-control" name="randomCode" placeholder={__('verify code')} required/>
						</div>
						<div className="col-xs-4">
							<button
								type="button"
								className="btn btn-default btn-block btn-rect"
								onClick={this.props.onClick}
								disabled={this.props.waiting}>
								{this.props.waiting ? this.props.time : __('resend')}
							</button>
						</div>
					</div>
					<ErrorMessage error={this.props.error}/>

					<div className="text-success">
						{this.props.send ? __('verify code has been sent') : ''}
					</div>

					<div className="form-group forgetp-fill-btn">
						<button type="submit" className="btn btn-primary btn-block btn-rect">
							{__('next step')}
						</button>
					</div>
				</form>
			</div>
			);
	}
});

var ForgetPasswordStep3 = React.createClass({
	render: function() {
		return (
			<form className="form-horizontal forgetp-new-password" onSubmit={this.props.onSubmit}>
				<input type="hidden" name="account" value={this.props.account} />
				<div className="form-group forgetp-fill-block">
					<div className="col-xs-3">
						<div className="forgetp-fill-icon">
							<span className="icon-lock-o"></span>
						</div>
					</div>
					<div className="col-xs-9">
						<input type="password" className="form-control" placeholder={__('password')} name="password" required/>
					</div>
				</div>
				<div className="form-group forgetp-fill-block">
					<div className="col-xs-3">
						<div className="forgetp-fill-icon">
							<span className="icon-check-lock-o"></span>
						</div>
					</div>
					<div className="col-xs-9">
						<input type="password" className="form-control" placeholder={__('confirm password')} name="cpassword" required/>
					</div>
				</div>
				<ErrorMessage error={this.props.error}/>
				<div className="form-group forgetp-fill-btn">
					<button type="submit" className="btn btn-primary btn-block btn-rect">
						{__('next step')}
					</button>
				</div>
			</form>
			);
	}
});

var ForgetPasswordStep4 = React.createClass({
	render: function() {
		return (
			<div className="forgetp-info">
				<span className="forgetp-info-icon">
					<span className="icon-check-circle-o"></span>
				</span>
				<p>
					{__('congratulations, your password has been reset successfully')}
				</p>

				<Link to="/signin" className="btn btn-primary btn-rect btn-block forgetp-info-btn">
					{__('sign in now')}
				</Link>
			</div>
			);
	}
});

var ForgetPassword = React.createClass({

	mixins: [ History ],

	getInitialState: function() {
		return {
			step: 1,
			method: 'email',
			error: '',
			account: sessionStorage.getItem('fp_account') === null ? '' : sessionStorage.getItem('fp_account'),
			waiting: false,
			time: 60,
			send: false
		};
	},

	componentDidMount: function() {
		sessionStorage.removeItem('fp_account');
		var query = this.props.location.query;
		if (query.step) {
			this.setState({
				step: parseInt(query.step)
			});
		}
	},

	componentWillUnmount: function() {
		clearInterval(this.int);
	},

	componentWillReceiveProps: function(nextProps) {
		var step = nextProps.location.query.step;
		if (step) {
			this.setState({
				step: parseInt(step)
			});
		}
		else {
			this.setState({
				step: 1
			});
		}
	},

	render: function() {

		var steps = stepText.map(function(s, i) {
			return (
				<li className={'forgetp-step-item' + (i < this.state.step ? ' active' : '')} key={i + 1}>
					<span className="forgetp-step-num">{i + 1}</span>
					<span className="forgetp-step-text">{stepText[i]}</span>
				</li>
				);
		}, this);

		var stepComponent = null;

		if (this.state.step === 1) {
			if (this.state.method === 'email') {
				stepComponent = <EmailStep1 onSubmit={this._handleEmailStep1Submit} error={this.state.error}/>;
			}
			else {
				stepComponent = <MobileStep1 onSubmit={this._handleMobileStep1Submit} error={this.state.error}/>;
			}
		}
		else {
			if (this.state.step === 2) {
				stepComponent = <ForgetPasswordStep2
					method={this.state.method}
					account={this.state.account}
					error={this.state.error}
					waiting={this.state.waiting}
					time={this.state.time}
					send={this.state.send}
					onClick={this._handleResendRandomCode}
					onSubmit={this._handleStep2Submit}/>;
			}
			else if (this.state.step === 3) {
				stepComponent = <ForgetPasswordStep3 onSubmit={this._handleStep3Submit} error={this.state.error} account={this.state.account}/>;
			}
			else {
				stepComponent = <ForgetPasswordStep4 />;
			}
		}

		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('forget password')} />
				</div>

				<div className="col-xs-12">
					<div className="forgetp">
						<div className="forgetp-step">
							<ol className="forgetp-step-items">
								{steps}
							</ol>
						</div>

						{this.state.step === 1 ?
						<div className="forgetp-tabs trim-out">
							<a href="#" className={'forgetp-tab' + (this.state.method === 'email' ? ' active' : '')} onClick={this._clickTab.bind(this, 'email')}>
								{__('via email')}
							</a>
							<a href="#" className={'forgetp-tab' + (this.state.method === 'mobile' ? ' active' : '')} onClick={this._clickTab.bind(this, 'mobile')}>
								{__('via mobile')}
							</a>
						</div> : null
						}

						<div className="forgetp-fill">
							{stepComponent}
						</div>
					</div>
				</div>
			</div>
			);
	},

	_clickTab: function(method, e) {
		e.preventDefault();
		this.setState({
			method: method
		});
	},

	_handleEmailStep1Submit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.account || !data.captcha) {
			this.setState({
				error: 'wrongFormSubmit'
			});
			return false;
		}

		var emailReg = /^[a-z0-9][-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
		if (!emailReg.test(data.account)) {
			this.setState({
				error: 'invalidEmail'
			});
			return false;
		}

		if (!/^[\d]{4}$/.test(data.captcha)) {
			this.setState({
				error: 'wrongCaptcha'
			});
			return false;
		}

		// just for safari
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					error: 'wrongFormSubmit'
				});
				return false;
			}
		}

		ForgetPasswordUtil.forgetPassword(data, function(res) {
			sessionStorage.setItem('fp_account', data.account);

			if (res.result === 'sendEmailSuccess') {
				this.history.pushState(null, '/forgetpassword', {step:2});

				this.setState({
					method: 'email',
					step: 2,
					account: data.account,
					error: ''
				});

				return false;
			}

			this.setState({
				error: res.result
			});

		}.bind(this));

		return false;
	},

	_handleMobileStep1Submit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.account || !data.captcha) {
			this.setState({
				error: 'wrongFormSubmit'
			});
			return false;
		}

		var mobileReg = /^[\d-+]{6,15}$/;
		if (!mobileReg.test(data.account)) {
			this.setState({
				error: 'invalidMobileNumber'
			});
			return false;
		}

		if (!/^[\d]{4}$/.test(data.captcha)) {
			this.setState({
				error: 'wrongCaptcha'
			});
			return false;
		}

		// just for safari
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					error: 'wrongFormSubmit'
				});
				return false;
			}
		}

		ForgetPasswordUtil.forgetPassword(data, function(res) {
			sessionStorage.setItem('fp_account', data.account);
			
			if (res.result === 'sendPhoneCodeSuccess') {
				this.history.pushState(null, '/forgetpassword', {step:2});
				this.setState({
					method: 'mobile',
					step: 2,
					account: data.account,
					error: ''
				});
				return false;
			}

			this.setState({
				error: res.result
			});

		}.bind(this));

		return false;
	},

	_handleStep2Submit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.randomCode || !/^[\d]{6}$/.test(data.randomCode)) {
			this.setState({
				error: 'randomCodeWrong'
			});
			return false;
		}

		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					error: 'randomCodeWrong'
				});
				return false;
			}
		}

		ForgetPasswordUtil.verifyRandomCode(data, function(res) {
			this.history.pushState(null, '/forgetpassword', {step:3});
			if (res.result === 'allowDoReset') {
				this.setState({
					step: 3,
					error: ''
				});
				return false;
			}

			this.setState({
				error: 'randomCodeWrong'
			});
		}.bind(this));

		return false;
	},

	_handleResendRandomCode: function(e) {
		e.preventDefault();
		this.setState({
			waiting: true
		});
		ForgetPasswordUtil.sendRandomCodeAgain(function(res) {
			if (res.result === 'sendEmailSuccess' || res.result === 'sendPhoneCodeSuccess') {
				this.setState({
					waiting: true,
					send: true,
					error: ''
				});
				this.int = setInterval(this._tick, 1000);
				return;
			}

			this.setState({
				waiting: false,
				send: false,
				error: res.result
			});

		}.bind(this));
	},

	_handleStep3Submit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.password || !data.cpassword) {
			this.setState({
				error: 'emptyPassword'
			});
			return false;
		}

		if (data.password !== data.cpassword) {
			this.setState({
				error: 'passwordNotMatch'
			});
			return false;
		}

		if (data.password.length < 6 || data.password.length > 32 || !/^[^\s]*$/.test(data.password)) {
			this.setState({
				error: 'wrongPasswordPattern'
			});
			return false;
		}

		// just for safari
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				this.setState({
					error: 'emptyPassword'
				});
				return false;
			}
		}


		delete data['cpassword'];

		ForgetPasswordUtil.setNewPassword(data, function(res) {
			if (res.result === 'resetSuccess') {
				this.history.pushState(null, '/forgetpassword', {step:4});
				this.setState({
					step: 4,
					error: ''
				});
				return;
			}

			this.setState({
				error: res.result
			});
		}.bind(this));

		return false;
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

module.exports = ForgetPassword;