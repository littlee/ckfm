var React = require('react');
var Header = require('./Header.js');
require('../../less/security-common.less');
var SecurityCommonStore = require('../stores/SecurityCommonStore.js');
var SecurityCommonUtil = require('../utils/SecurityCommonUtil.js');
var FormUtil = require('../utils/FormUtil.js');
var CKFM = require('../CKFM.js');
function getStateFromStores() {
	return {
		type: SecurityCommonStore.getType(),
		step: SecurityCommonStore.getStep(),
		typeOne: SecurityCommonStore.getTypeOne(),
		securityAns: SecurityCommonStore.getSecurityAns(),
		submitResult: SecurityCommonStore.getSubmitResult(),
		err:  SecurityCommonStore.getErr()
	};
}
var ErrMsgMap = {
	'passwordNotEmpty': __('the password is required and can not be empty'),
	'loginPasswordLength': __('the password length must ranges from 6 to 32'),
	'psdConfirm': __('the passwords entered are not consistent'),
	'captchaNotEmpty': __('the captcha is required and can not be empty'),
	'questionNotEmpty': __('questions are required and can not be empty'),
	'answerNotEmpty': __('answers are required and can not be empty'),
	'questionNotSame': __('do not choose the same question'),
	'phoneNotEmpty': __('phone number is required and can not be empty'),
	'phonePattern': __('phone format error'),
	'confirmCodeNotEmpty': __('confirm code is required and can not be empty'),
	'frequently': __('operation is too frequent'),
	'sendFailed': __('send failed'),
	'payPasswordLength': __('payment password length must range from 6 to 30'),
	'payPsdPattern': __('the password format is wrong'),
	'emailNotEmpty': __('the email address is required and can not be empty'),
	'emailLength': __('the email address length must range from 6 to 30'),
	'emailPattern': __('email address format is wrong'),
	'psdPattern': __('the password format is wrong')
};

var ErrMsg = React.createClass({
	render: function() {
		return (
			<div className="alert alert-danger security-common-form-alert">{this.props.msg}</div>
			);
	}
});

var Step = React.createClass({
	render: function() {
		var step = this.props.step;
		return (
			<ol className="list-inline security-common-ol">
				<li className={step==="1"?"security-common-ol-li active":"security-common-ol-li"}>
					<div className="security-common-ol-li-line">
					</div>
					<div className="security-common-ol-li-step">
						1
					</div>
					<span className="security-common-ol-li-text">{__('verify')}</span>
				</li>
				<li className={step==="2"?"security-common-ol-li active":"security-common-ol-li"}>
					<div className="security-common-ol-li-line">
					</div>
					<div className="security-common-ol-li-step">
						2
					</div>
					<span className="security-common-ol-li-text">{__('set up')}</span>
				</li>
				<li className={step==="3"?"security-common-ol-li active":"security-common-ol-li"}>
					<div className="security-common-ol-li-step">
						3
					</div>
					<span className="security-common-ol-li-text">{__('success')}</span>
				</li>
			</ol>
		);
	}
});
var VerifyCode = React.createClass({
	propTypes: {
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			t: this.props.t || 0
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			t: nextProps.t
		});
	},

	render: function() {
		var vStyle = {
			'WebkitAppearance': 'none',
			'MozAppearance': 'none'
		};

		return (
			<div className="form-group security-common-form-group">
				<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-vertify-code-o"></span></label>
				<div className="col-xs-5">
					<input type="number" className="form-control security-common-form-group-input" ref="captcha" name="captcha" placeholder={__('enter the verification code')} required style={vStyle} onChange={this._handleChange}/>
				</div>
				<div className="col-xs-5">
					<img src={'/cooka-user-web/captchaImage.do?' + this.state.t} onClick={this._refreshCaptcha} height="30" width="100" alt="vcode" className="v-code-img"/>
				</div>
			</div>
			);
	},

	_refreshCaptcha: function() {
		this.setState({
			t: new Date().getTime()
		});
	},

	_handleChange: function(e) {
		if (this.props.onChange){
			this.props.onChange(e);
		}
	}
});
var Child = React.createClass({
	render: function() {
		var step = this.props.step;
		var type = this.props.type;
		var typeOne = this.props.typeOne;
		var securityAns = this.props.securityAns;
		var Child=null;
		if (step==="1") {
			switch(typeOne) {
				case "stepOneEmail": 
					Child = <StepOneEmailPhone err={this.props.err} onErr={this.handleErr} typeOne={typeOne}/>;
				break;
				case "stepOnePhone": 
					Child = <StepOneEmailPhone err={this.props.err} onErr={this.handleErr} typeOne={typeOne}/>;
				break;
				case "stepOnePsd": 
					Child = <StepOnePsd err={this.props.err} onErr={this.handleErr}/>;
				break;
				case "stepOneSecurityAns": 
					Child = <StepOneSecurityAns err={this.props.err} onErr={this.handleErr} securityAnsList={this.props.securityAnsList}/>;
				break;
				default:
			}
		}
		else if (step==="2") {
			switch(type) {
				case "isSetSecurityAns": 
					if(!securityAns)
						Child = <StepTwoSecurityAnsText err={this.props.err} onErr={this.handleErr}/>;
					else 
						Child = <StepTwoSecurityAns err={this.props.err} onErr={this.handleErr}/>;
				break;
				case "isFinancialActive": 
					Child = <StepTwoFinancialPsd err={this.props.err} onErr={this.handleErr}/>;
				break;
				case "isSetEmail": 
					Child = <StepTwoEmail err={this.props.err} onErr={this.handleErr}/>;
				break;
				case "isSetPhone": 
					Child = <StepTwoPhone err={this.props.err} onErr={this.handleErr}/>;
				break;
				case "isSetPassword": 
					Child = <StepTwoPsd err={this.props.err} onErr={this.handleErr}/>;
				break;
				default:
			}
		}
		else if (step==="3") {
			var submitResult = this.props.submitResult;
			if (submitResult)
				Child = <StepThreeSuccess/>;
		}
		return (
			<div>
				{Child}
			</div>
		);
	},
	handleErr: function(err) {
		SecurityCommonUtil.changeErr(err);
	}
});
var RandomCode = React.createClass({
	render: function() {
		return (
			<div className="form-group security-common-form-group">
			 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-vertify-code-o"></span></label>
			 	<div className="col-xs-5">
			 		{this.props.send?<input type="text" className="form-control security-common-form-group-input" name="randomCode" ref="randomCode" placeholder={__('enter the verification code')} required/>:<input type="text" className="form-control security-common-form-group-input" name="randomCode" ref="randomCode" placeholder={__('enter the verification code')} disabled required/>}
			    </div>
			    <div className="col-xs-5">
			    	<button type="button" className="btn btn-primary security-common-form-group-btn-submit" onClick={this.props.onClick}>
			    		{this.props.waiting?this.props.time:__('get verify code')}
			    	</button>
			    </div>
			    <div className="col-xs-10 col-xs-offset-2">
			    	{this.props.send&&this.props.waiting ? <div className="text-success security-common-form-success">{__('confirm code has been sent, please enter the received confirm code')}</div> : null}
			    </div>
			  </div>
			);
	}
});
var StepOnePsd = React.createClass({
	render: function() {
		var err = this.props.err;
		var account = CKFM.getAccount();
		return (
			<form className="security-common-form form-horizontal" onSubmit={this._handleSubmit} noValidate>
				<div className="form-group security-common-form-group">
					<label className="security-common-form-group-label col-xs-2 control-label">
						<span className="icon-lock-o"></span>
					</label>
					<div className="col-xs-10">
						<input type="password" className="form-control security-common-form-group-input" ref="password" name="password" placeholder={__('password')} minLength="6" maxLength="32" pattern="^[^\s]*$" required/>
					</div>
				</div>
				<input type="hidden" name="account" value={account}/>
				<VerifyCode t="-1"/>
				{err.length > 0 ?
				<ErrMsg msg={err}/>
				: null}
				<div className="form-group">
					<div className="col-xs-12 security-common-form-group-btn">
						<button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
					</div>
				</div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				var psdPattern = this.refs.password.pattern;
				if(!data.passoneseword){
					this._onChange(ErrMsgMap.passwordNotEmpty);
				}
				else if(data.password.length<this.refs.password.minLength||data.password.length>this.refs.password.maxLength){
					this._onChange(ErrMsgMap.loginPasswordLength);
				}
				else if (!(data.password).match(psdPattern)) {
					this._onChange(ErrMsgMap.psdConfirm);
				}
				else if(!data.captcha){
					this._onChange(ErrMsgMap.captchaNotEmpty);
				}
				return false;
			}
			else
				this._onChange("");
		}
		SecurityCommonUtil.submitOneLoginPsd(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	}
});
var StepOneEmail = React.createClass({
	render: function() {
		var account = this.props.account;
		return (
			<span>
				{__('email address')}
				&nbsp;{account}
				<input type="hidden" value={account} name="account"/>
			</span>
			);
	}
});
var StepOnePhone = React.createClass({
	render: function() {
		var account = this.props.account;
		return (
			<span>
				{__('phone number')}
				&nbsp;{account}
				<input type="hidden" value={account} name="account"/>
			</span>
			);
	}
});
var StepOneEmailPhone = React.createClass({
	getInitialState: function() {
		return {
			valid: '',
			waiting: false,
			time: 60,
			send: false,
			account: null
		};
	},

	componentDidMount: function() {
		 SecurityCommonUtil.getEmailPhoneAccount(function(res){
		 	if (this.isMounted()){
				this.setState({
					account: res
				});
		 	}
		 }.bind(this));
	},

	componentWillUnmount: function() {
		clearInterval(this.int);
	},

	render: function() {
		var err = this.props.err;
		var typeOne = this.props.typeOne;
		var account = this.state.account;
		return (
			<form className="saccountty-common-form form-horizontal" ref="form" onSubmit={this._handleSubmit} noValidate>
				 <div className="form-group security-common-form-group">
				 	<div className="security-common-form-group-text col-xs-12">
				 		{account===null?null:(typeOne==="stepOneEmail"?<StepOneEmail account={account.email}/>:<StepOnePhone account={account.phone}/>)}
				 	</div>
				 </div>
				  <RandomCode ref="randomcode" onClick={this._sendRandomCode}
					waiting={this.state.waiting}
					time={this.state.time}
					send={this.state.send}/>
				{err.length > 0 ?
				<ErrMsg msg={err}/>
				: null}
				<div className="form-group">
					<div className="col-xs-12 security-common-form-group-btn">
						<button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
					</div>
				</div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				if(!data.randomCode){
					this._onChange(ErrMsgMap.confirmCodeNotEmpty);
				}
				return false;
			}
			else
				this._onChange("");
		}
		SecurityCommonUtil.submitOneEmailPhone(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	},
	_sendRandomCode: function() {
		var data = FormUtil.formToObject(this.refs.form);
		SecurityCommonUtil.sendRandomCode(data, function(res) {
			if (res.result === 'sendPhoneCodeSuccess'||res.result==="sendEmailSuccess") {
				this.setState({
					waiting: true,
					send: true
				});
				this.int = setInterval(this._tick, 1000);
				return;
			}
			else if(res.result === "frequently") {
				this._onChange(ErrMsgMap.frequently);
			}
			else if (res.result === "sendPhoneCodeFail") {
				this._onChange(ErrMsgMap.sendFailed);
			}
			this.setState({
				waiting: false,
				send: false,
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
var StepOneSecurityAns = React.createClass({
	getInitialState: function() {
		return {
			preQuestions: null
		}
	},
	componentDidMount: function() {
		SecurityCommonUtil.getPreQuestions(function(res){
			if (this.isMounted()){
				this.setState({
					preQuestions: res
				});
			}
		}.bind(this));
	},
	render: function() {
		var err = this.props.err;
		var preQuestions = this.state.preQuestions;
		var combinations = [];
		if (preQuestions!==null) {
			combinations = preQuestions.map(function(item,index){
				return (
					<div key={index}>
						<div className="form-group security-common-form-group">
						 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-lock-o"></span></label>
						 	<div className="col-xs-10">
						    	<input type="text" className="form-control security-common-form-group-input" value={item.problem} disabled/>
						    	<input type="hidden" name={"answers["+index+"][problemId]"} value={item.problemId}/>
						    </div>
					  	</div>
						  <div className="form-group security-common-form-group">
						 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
						 	<div className="col-xs-10">
						    	<input type="text" className="form-control security-common-form-group-input" name={"answers["+index+"][answer]"} placeholder={__('your answer')} required/>
						    </div>
						 </div>
					 </div>
					);
			});
		}
		
		return (
			<form className="security-common-form form-horizontal" onSubmit={this._handleSubmit} noValidate>
				  {combinations}
				  {err.length > 0 ? <ErrMsg msg={err}/> : null}
				  <div className="form-group">
				    <div className="col-xs-12 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
				    </div>
				  </div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				if(!data.answers[0].answer||!data.answers[1].answer||!data.answers[2].answer){
					this._onChange(ErrMsgMap.answerNotEmpty);
				}
				return false;
			}
			else
				this._onChange("");
		}
		var formDatas = [];
		Object.keys(data.answers).map(function(key,index){
			formDatas.push(data.answers[key]);
		});
		var dataSubmit = {
			"answers": formDatas
		}
		SecurityCommonUtil.submitOneSecurityAns(dataSubmit);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	}
});
var StepTwoPsd = React.createClass({
	render: function() {
		var err = this.props.err;
		var account = CKFM.getAccount();
		return (
			<form className="security-common-form form-horizontal" onSubmit={this._handleSubmit} noValidate>
				 <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="password" className="form-control security-common-form-group-input" ref="password" name="password" pattern="^[^\s]*$" minLength="6" maxLength="32" placeholder={__('password')} required/>
				    </div>
				  </div>
				  <input type="hidden" name="account" value={account}/>
				  <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="password" className="form-control security-common-form-group-input" ref="confirmPassword" placeholder={__('confirm password')} required/>
				    </div>
				  </div>
				  {err.length > 0 ? <ErrMsg msg={err}/> : null}
				  <div className="form-group">
				    <div className="col-xs-12 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
				    </div>
				  </div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		var confirmPassword=this.refs.confirmPassword;
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()||confirmPassword.value!==data.password) {
				var psdPattern = this.refs.password.pattern;
				if(!data.password){
					this._onChange(ErrMsgMap.passwordNotEmpty);
				}
				else if(data.password.length<this.refs.password.minLength||data.password.length>this.refs.password.maxLength){
					this._onChange(ErrMsgMap.loginPasswordLength);
				}
				else if (!(data.password).match(psdPattern)) {
					this._onChange(ErrMsgMap.psdPattern);
				}
				else if(!confirmPassword.value){
					this._onChange(ErrMsgMap.passwordNotEmpty);
				}
				else if(confirmPassword.value!==data.password){
					this._onChange(ErrMsgMap.psdConfirm);
				}
				return false;
			}
			else
				this._onChange("");
		}
		SecurityCommonUtil.submitTwoPsd(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	}
});
var StepTwoPhone = React.createClass({
	getInitialState: function() {
		return {
			valid: '',
			waiting: false,
			time: 60,
			send: false
		};
	},

	componentWillUnmount: function() {
		clearInterval(this.int);
	},
	render: function() {
		var err = this.props.err;
		return (
			<form className="security-common-form form-horizontal" ref="form" onSubmit={this._handleSubmit} noValidate>
				 <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label security-common-form-group-label-select control-label">
					 	<select className="c-code security-common-form-group-label-select-s" ref="cCode">
							<option value="+84">(+84){__('vietnam')}</option>
							<option value="+86">(+86){__('china')}</option>
						</select>
					</label>
				 	<div className="col-xs-8">
				 		<input type="tel" className="form-control security-common-form-group-input" placeholder={__('phone number')} name="account" required ref="mobile"/>
				    </div>
				  </div>
				   <RandomCode ref="randomcode" onClick={this._sendRandomCode}
					waiting={this.state.waiting}
					time={this.state.time}
					send={this.state.send}/>
					{err.length > 0 ? <ErrMsg msg={err}/> : null}
				  <div className="form-group">
				    <div className="col-xs-12 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
				    </div>
				  </div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		var mobileReg = /^[\d-+]{6,15}$/;
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
			 if(!data.account){
					this._onChange(ErrMsgMap.phoneNotEmpty);
				}
				else if(!mobileReg.test(data.account)){
					this._onChange(ErrMsgMap.phonePattern);
				}
				else if(!data.randomCode){
					this._onChange(ErrMsgMap.confirmCodeNotEmpty);
				}
				return false;
			}
			else
				this._onChange("");
		}
		var cCode = this.refs.cCode.value;
		data.account = cCode+data.account;
		SecurityCommonUtil.submitTwoPhone(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	},
	_sendRandomCode: function() {
		var data = FormUtil.formToObject(this.refs.form);
		var mobileReg = /^[\d-+]{6,15}$/;
		if(!data.account){
			this._onChange(ErrMsgMap.phoneNotEmpty);
			return;
		}
		else if(!mobileReg.test(data.account)){
			this._onChange(ErrMsgMap.phonePattern);
			return;
		}
		var cCode = this.refs.cCode.value;
		data.account = cCode+data.account;

		SecurityCommonUtil.sendRandomCode(data, function(res) {
			if (res.result === 'sendPhoneCodeSuccess') {
				this.setState({
					waiting: true,
					send: true
				});
				this.int = setInterval(this._tick, 1000);
				return;
			}
			else if(res.result === "frequently") {
				this._onChange(ErrMsgMap.frequently);
			}
			else if (res.result === "sendPhoneCodeFail") {
				this._onChange(ErrMsgMap.sendFailed);
			}
			this.setState({
				waiting: false,
				send: false,
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
var StepTwoFinancialPsd = React.createClass({
	getInitialState: function() {
		return {
			strength: null
		};
	},
	showStrength: function(e) {
		var value = e.target.value;
		var score = 0;
        if (value.length===0){
        	score = null;
        }
		// Check the password strength
		if(value) {
			score += ((value.length >= 8) ? 1 : -1);
		}
        
        // The password contains uppercase character
        if (/[A-Z]/.test(value)) {
            score += 1;
        }

        // The password contains downpercase character
        if (/[a-z]/.test(value)) {
            score += 1;
        }

        // The password contains number
        if (/[0-9]/.test(value)) {
            score += 1;
        }

        // The password contains special characters
        if (/[!#$%&^~*_]/.test(value)) {
            score += 1;
        }
		this.setState({
			strength: score
		});
	},
	calculateScore: function(strength) {
		switch(true) {
			case (strength === null):
				return (<div className="progress-bar" style={{width: "0%"}}>
					  </div>);
                break;

            case (strength <= 0):
            	return (<div className="progress-bar progress-bar-danger" style={{width: "25%"}}>
					   {__('weak')}
					  </div>);
                break;

            case (strength > 0 && strength <= 2):
            	return (<div className="progress-bar progress-bar-warning" style={{width: "50%"}}>
					    {__('medium')}	
					  </div>);
                break;

            case (strength > 2 && strength <= 4):
            	return (<div className="progress-bar progress-bar-info" style={{width: "75%"}}>
					    {__('strong')}	
					  </div>);
                break;

            case (strength > 4):
            	return (<div className="progress-bar progress-bar-success" style={{width: "100%"}}>
            			{__('very strong')}
					  </div>);
                break;

            default:
                break;
		}
	},
	render: function() {
		var err = this.props.err;
		var strength = this.state.strength;
		var progress = this.calculateScore(strength);
		var account = CKFM.getAccount();
		return (
			<form className="security-common-form form-horizontal"  onSubmit={this._handleSubmit} noValidate>
				 <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="password" className="form-control security-common-form-group-input" ref="password" name="password" pattern="^[^\s]*$" minLength="6" maxLength="30"  placeholder={__('password')} onChange={this.showStrength} required/>
				    </div>
				    <div className="col-xs-10 col-xs-offset-2">
				    	<div className="progress">
						  {progress}
						</div>
				    </div>
				  </div>
				  <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="password" className="form-control security-common-form-group-input" ref="confirmPassword" placeholder={__('confirm password')} minLength="6" maxLength="30" required/>
				    </div>
				  </div>
				  <input type="hidden" name="account" value={account}/>
				   {err.length > 0 ? <ErrMsg msg={err}/> : null}
				  <div className="form-group">
				    <div className="col-xs-12 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next step')}</button>
				    </div>
				  </div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		var confirmPassword=this.refs.confirmPassword;
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()||confirmPassword.value!==data.password) {
				var psdPattern = this.refs.password.pattern;
				if(!data.password){
					this._onChange(ErrMsgMap.passwordNotEmpty);
				}
				else if(data.password.length<this.refs.password.minLength||data.password.length>this.refs.password.maxLength){
					this._onChange(ErrMsgMap.payPasswordLength);
				}
				else if (!(data.password).match(psdPattern)) {
					this._onChange(ErrMsgMap.payPsdPattern);
				}
				else if(!confirmPassword.value){
					this._onChange(ErrMsgMap.passwordNotEmpty);
				}
				else if(confirmPassword.value!==data.password){
					this._onChange(ErrMsgMap.psdConfirm);
				}
				return false;
			}
			else
				this._onChange("");
		}
		SecurityCommonUtil.submitTwoFinancialPsd(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	}
});
var StepTwoEmail = React.createClass({
	getInitialState: function() {
		return {
			valid: '',
			waiting: false,
			time: 60,
			send: false
		};
	},

	componentWillUnmount: function() {
		clearInterval(this.int);
	},
	render: function() {
		var err = this.props.err;
		return (
			<form className="security-common-form form-horizontal" ref="form" onSubmit={this._handleSubmit} noValidate>
				 <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="email" className="form-control security-common-form-group-input" name="email" ref="email" placeholder={__('email address')} 
				    	pattern="/^[a-z0-9][-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i" minLength="6" maxLength="30" required/>
				    </div>
				  </div>
				  <RandomCode ref="randomcode" onClick={this._sendRandomCode}
					waiting={this.state.waiting}
					time={this.state.time}
					send={this.state.send}/>
					 {err.length > 0 ? <ErrMsg msg={err}/> : null}
				  <div className="form-group">
				    <div className="col-xs-12 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
				    </div>
				  </div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				var emailPattern = this.refs.email.pattern;
				if(!data.email){
					this._onChange(ErrMsgMap.emailNotEmpty);
				}
				else if(data.email.length<this.refs.email.minLength||data.email.length>this.refs.email.maxLength){
					this._onChange(ErrMsgMap.emailLength);
				}
				else if (!(data.email).match(emailPattern)) {
					this._onChange(ErrMsgMap.emailPattern);
				}
				else if(!data.randomCode){
					this._onChange(ErrMsgMap.confirmCodeNotEmpty);
				}
				return false;
			}
			else
				this._onChange("");
		}
		SecurityCommonUtil.submitTwoEmail(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	},
	_sendRandomCode: function() {
		var data = FormUtil.formToObject(this.refs.form);
		var emailPattern = this.refs.email.pattern;
		if(!data.email){
			this._onChange(ErrMsgMap.emailNotEmpty);
			return;
		}
		else if(data.email.length<this.refs.email.minLength||data.email.length>this.refs.email.maxLength){
			this._onChange(ErrMsgMap.emailLength);
			return;
		}
		else if (!(data.email).match(emailPattern)) {
			this._onChange(ErrMsgMap.emailPattern);
			return;
		}
		SecurityCommonUtil.sendRandomCode(data, function(res) {
			if (res.result === 'sendEmailCodeSuccess') {
				this.setState({
					waiting: true,
					send: true
				});
				this.int = setInterval(this._tick, 1000);
				return;
			}
			else if(res.result === "frequently") {
				this._onChange(ErrMsgMap.frequently);
			}
			else if (res.result === "sendEmailCodeFail") {
				this._onChange(ErrMsgMap.sendFailed);
			}
			this.setState({
				waiting: false,
				send: false,
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
var StepTwoSecurityAns = React.createClass({
	getInitialState: function() {
		return {
			questionList: [],
			problem1: "",
			problem2: "",
			problem3: "",
			answer1: "",
			answer2: "",
			answer3: "",
			problemText1: "",
			problemText2: "",
			problemText3: ""
		}
	},
	componentDidMount: function() {
		 SecurityCommonUtil.getSecurityAns(function(res){
			this.setState({
				questionList: res
			});
		 }.bind(this));

		 SecurityCommonUtil.getSecurityAnsSession(function(res){
		 	if(res!==null){
		 		this.setState({
					problem1: res.securityAnsText.answers[0].problemId,
					problem2: res.securityAnsText.answers[1].problemId,
					problem3: res.securityAnsText.answers[2].problemId,
					answer1: res.securityAnsText.answers[0].answer,
					answer2: res.securityAnsText.answers[1].answer,
					answer3: res.securityAnsText.answers[2].answer,
					problemText1: res.securityAnsText.problem1,
					problemText2: res.securityAnsText.problem2,
					problemText3: res.securityAnsText.problem3
				});
		 	}
		 }.bind(this));
	},
	render: function() {
		var err = this.props.err;
		var list = [];
		var problem1 = this.state.problem1;
		var	problem2 = this.state.problem2;
		var	problem3 = this.state.problem3;
		var	answer1 =this.state.answer1;
		var	answer2 = this.state.answer2;
		var	answer3 =this.state.answer3;
		var	problemText1 = this.state.problemText1;
		var	problemText2 = this.state.problemText2;
		var	problemText3 = this.state.problemText3;
		list = this.state.questionList.map(function(item,index) {
			return (
				<option data-problem={item.problem} value={item.problemId} key={index}>{item.problem}</option>
				);
		});
		return (
			<form className="security-common-form form-horizontal" onSubmit={this._handleSubmitText} noValidate>
				 <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-lock-o"></span></label>
				 	<div className="col-xs-10">
				 		<input type="hidden" name="problem1" ref="problem1" value={problemText1}/>
				    	<select className="form-control" value={problem1}  ref="select1" data-index="1" onChange={this.changeProblem} name="answers[0][problemId]" required>
				    		<option data-problem="" value="">--{__('select security issues')}--</option>
				    		{list}
				    	</select>
				    </div>
				  </div>
				  <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="text" className="form-control security-common-form-group-input" ref="input1" value={answer1} name="answers[0][answer]" onChange={this.changeAnswer} placeholder={__('your answer')} required/>
				    </div>
				  </div>
				   <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-lock-o"></span></label>
				 	<div className="col-xs-10">
				 		<input type="hidden" name="problem2" ref="problem2" value={problemText2}/>
				    	<select className="form-control" value={problem2} ref="select2" data-index="2" onChange={this.changeProblem}  name="answers[1][problemId]" required>
				    		<option data-problem="" value="">--{__('select security issues')}--</option>
				    		{list}
				    	</select>
				    </div>
				  </div>
				  <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="text" className="form-control security-common-form-group-input" ref="input2" value={answer2} name="answers[1][answer]" onChange={this.changeAnswer} placeholder={__('your answer')} required/>
				    </div>
				  </div>
				   <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-lock-o"></span></label>
				 	<div className="col-xs-10">
				 		<input type="hidden" name="problem3" ref="problem3" value={problemText3}/>
				    	<select className="form-control" value={problem3} ref="select3" data-index="3" onChange={this.changeProblem} name="answers[2][problemId]" required>
				    		<option data-problem="" value="">--{__('select security issues')}--</option>
				    		{list}
				    	</select>
				    </div>
				  </div>
				  <div className="form-group security-common-form-group">
				 	<label className="security-common-form-group-label col-xs-2 control-label"><span className="icon-check-lock-o"></span></label>
				 	<div className="col-xs-10">
				    	<input type="text" className="form-control security-common-form-group-input" ref="input3" value={answer3} name="answers[2][answer]" onChange={this.changeAnswer} placeholder={__('your answer')} required/>
				    </div>
				  </div>
				  {err.length > 0 ? <ErrMsg msg={err}/> : null}
				  <div className="form-group">
				    <div className="col-xs-12 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
				    </div>
				  </div>
			</form>
		);
	},
	_handleSubmitText: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				if(!this.refs.select1.value||!this.refs.select2.value||!this.refs.select3.value) {
					this._onChange(ErrMsgMap.questionNotEmpty);
				}
				else if(this.refs.select1.value===this.refs.select2.value||this.refs.select1.value===this.refs.select3.value
						||this.refs.select2.value===this.refs.select3.value
					) {
					this._onChange(ErrMsgMap.questionNotSame);
				}
				else if(!this.refs.input1.value||!this.refs.input2.value||!this.refs.input3.value){
					this._onChange(ErrMsgMap.answerNotEmpty);
				}
				return false;
			}
			else
				this._onChange("");
		}
		SecurityCommonUtil.setTwoSecurityAnsText(data);
		return false;
	},
	_onChange: function(err) {
		this.props.onErr(err);
	},
	changeProblem: function(e) {
		var problem = "";
		var index = e.target.getAttribute("data-index");
		[].every.call(e.target.querySelectorAll('option'), function(oo, i) {
				if(oo.selected) {
					problem=oo.getAttribute("data-problem");
					return false;
				}
				return true;
			});
		switch(index) {
			case "1":
				this.setState({
					problemText1: problem,
					problem1: e.target.value
				});
				break;
			case "2":
				this.setState({
					problemText2: problem,
					problem2: e.target.value
				});
				break;
			case "3":
				this.setState({
					problemText3: problem,
					problem3: e.target.value
				});
				break;
		}
	},
	changeAnswer: function(e) {
		var ref=e.target.name;
		switch(ref) {
			case "answers[0][answer]":
				this.setState({answer1:e.target.value});
				break;
			case "answers[1][answer]":
				this.setState({answer2:e.target.value});
				break;
			case "answers[2][answer]":
				this.setState({answer3:e.target.value});
				break;
		}
		
	}
});
var StepTwoSecurityAnsText = React.createClass({
	getInitialState: function() {
		return {
			questionDetail: []
		}
	},
	componentDidMount: function() {
		 SecurityCommonUtil.getSecurityAnsSession(function(res){
			this.setState({
				questionDetail: res.securityAnsText
			});
		 }.bind(this));
	},
	render: function() {
		var err = this.props.err;
		var questionList = [];
		var questionDetail=this.state.questionDetail;
		var answers = [];
		if(questionDetail.length!==0) {
			questionList = Object.keys(questionDetail.answers).map(function(key,index) {
				var answer = questionDetail.answers[key];
					answers.push(answer);
				return (
					<tr key={index}>
						<td>{index===0?questionDetail.problem1:(index===1?questionDetail.problem2:questionDetail.problem3)}</td>
						<td>
							{questionDetail.answers[key]['answer']}
						</td>
					</tr>
					);
			});
		}
		
		return (
			<form className="security-common-form form-horizontal"  onSubmit={this._handleSubmit} data-form={JSON.stringify({
				answers: answers
			})} noValidate>
				 <div className="security-common-security">
				 	<table className="security-common-security-table table">
				 		<thead>
				 			<tr>
				 				<th>{__('question')}</th>
				 				<th>{__('answer')}</th>
				 			</tr>
				 		</thead>
				 		<tbody>
				 			{questionList}
				 		</tbody>
				 	</table>
				 </div>
				 <div className="form-group">
				    <div className="col-xs-6 security-common-form-group-btn">
				      <button type="submit" className="btn btn-primary security-common-form-group-btn-submit">{__('next')}</button>
				    </div>
				    <div className="col-xs-6 security-common-form-group-btn">
				      <button type="button" className="btn btn-primary security-common-form-group-btn-submit" onClick={this.backAction}>{__('back')}</button>
				    </div>
				 </div>
			</form>
		);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
		var formValue = JSON.parse(e.target.getAttribute("data-form"));
		SecurityCommonUtil.submitTwoSecurityAns(formValue);
	},
	backAction: function() {
		SecurityCommonUtil.backToSecurityAns();
	}
});
var StepThreeSuccess = React.createClass({
	render: function() {
		return (
			<div className="security-common-success">
				<span className="icon-check-circle-o security-common-success-icon"></span>
				<br/>
				 {__('success')}
			</div>
		);
	}
});

var SecurityCommon = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		SecurityCommonUtil.changeErr("");
		SecurityCommonUtil.initialStepAndSecurityans();
		SecurityCommonStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		SecurityCommonStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('account security')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="security-common">
						<Step step={this.state.step}/>
						{this.state.type!==null?<Child step={this.state.step} type={this.state.type} typeOne={this.state.typeOne} securityAns={this.state.securityAns} submitResult={this.state.submitResult} err={this.state.err}/>:null}
					</div>
				</div>
			</div>
		);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = SecurityCommon;