var CKFM = require('../CKFM.js');
var request = require('superagent');
var SecurityCommonActionCreators = require('../actions/SecurityCommonActionCreators.js');
module.exports = {
	getTypeSession: function(){
		var o = JSON.parse(sessionStorage.getItem('securityType'));
		var oo = JSON.parse(sessionStorage.getItem('securityTypeOne'));
		if(o!==null) {
			setTimeout(function(){
				SecurityCommonActionCreators.receiveType(o.type,oo.typeOne);
			},0);
		}
	},
	submitOneLoginPsd: function(data) {
		request
				.post('/cooka-user-web/center/m/verifyIdentity')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data=JSON.parse(res.text);
					if (data.result==="wrongCaptcha") {
						SecurityCommonActionCreators.receiveErr(__('the captcha is not correct'));
						return err;
					}
					else if (data.result==="invalidatePassword") {
						SecurityCommonActionCreators.receiveErr(__('password error'));
						return err;
					}
					else if (data.result==="wrongFormSubmit") {
						alert("failed");
						return err;
					}
					else{
						SecurityCommonActionCreators.receiveStep("2");
						SecurityCommonActionCreators.receiveErr("");	
					}
				});
	},
	submitOneEmailPhone: function(data) {
		request
				.post('/cooka-user-web/center/m/verifyCode')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data = JSON.parse(res.text);
					if (data.result === "wrongCaptcha") {
						SecurityCommonActionCreators.receiveErr(__('confirm code is error'));
					}
					else if (data.result === "allowDoReset"){
						SecurityCommonActionCreators.receiveStep("2");
						SecurityCommonActionCreators.receiveErr("");
					}
					else if (data.result==="wrongFormSubmit") {
						SecurityCommonActionCreators.receiveErr(__('submit failed'));
					}
		});
	},
	submitOneSecurityAns: function(data) {
		request
				.post('/cooka-user-web/center/m/verifyAnswer')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data = JSON.parse(res.text);
					if (data.result==="fail") {
						SecurityCommonActionCreators.receiveErr(__('security answer is not right'));
					}
					else if(data.result==="success"){
						SecurityCommonActionCreators.receiveStep("2");
						SecurityCommonActionCreators.receiveErr("");
					}
		});
	},
	submitTwoPsd: function(data) {
		request
				.post('/cooka-user-web/center/m/resetPaswd')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data = JSON.parse(res.text);
					if(data.result==="success"){
						SecurityCommonActionCreators.receiveStep("3");
						SecurityCommonActionCreators.receiveErr("");
					}
		});
	},
	submitTwoEmail: function(data) {
		request
				.post('/cooka-user-web/center/m/doAddAccount')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data = JSON.parse(res.text);
					if (data.result === "wrongCaptcha") {
						SecurityCommonActionCreators.receiveErr(__('confirm code is error'));
					}
					else if (data.result === "success"){
						SecurityCommonActionCreators.receiveStep("3");
						SecurityCommonActionCreators.receiveErr("");
					}
		});
	},
	submitTwoFinancialPsd: function(data) {
		request
				.post('/cooka-user-web/center/m/resetPayPaswd')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data = JSON.parse(res.text);
					if (data.result==="success") {
						SecurityCommonActionCreators.receiveStep("3");
						SecurityCommonActionCreators.receiveErr("");
					}
					else if(data.result==="prohibitOperation") {
						SecurityCommonActionCreators.receiveErr(__('forbidden operation'));
					}
		});
	},
	setTwoSecurityAnsText: function(data) {
		sessionStorage.setItem('securityAnsText', JSON.stringify({"securityAnsText":data}));
		SecurityCommonActionCreators.receiveStep("2");
		SecurityCommonActionCreators.receiveSecurityAns(false);
		SecurityCommonActionCreators.receiveErr("");
		//set session
	},
	submitTwoSecurityAns: function (data){
		request
		.post('/cooka-user-web/center/m/doAddSecurityAns')
		.use(CKFM.ajaxAuth())
		.set('Content-Type', 'application/json')
		.set('__RequestVerificationToken', CKFM.getToken())
		.send(data)
		.end(function (err, res) {
			var data = JSON.parse(res.text);
			if (data.result==="success") {
				sessionStorage.removeItem('securityAnsText');
				SecurityCommonActionCreators.receiveStep("3");
				SecurityCommonActionCreators.receiveErr("");
				return;
			}
		});
	},
	changeErr: function(err) {
		SecurityCommonActionCreators.receiveErr(err);
	},
	sendRandomCode: function(data, cb) {
		request
			.post('/cooka-user-web/center/m/sendRandNum')
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(data)
			.end(function (err, res) {
				if (err) {
					return err;
				}
				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	},
	submitTwoPhone: function(data) {
		request
				.post('/cooka-user-web/center/m/doAddAccount')
				.use(CKFM.ajaxAuth())
				.set('Content-Type', 'application/json')
				.set('__RequestVerificationToken', CKFM.getToken())
				.send(data)
				.end(function (err, res) {
					var data = JSON.parse(res.text);
					if (data.result === "wrongCaptcha") {
						SecurityCommonActionCreators.receiveErr(__('confirm code is error'));
					}
					else if (data.result === "success"){
						SecurityCommonActionCreators.receiveStep("3");
						SecurityCommonActionCreators.receiveErr("");
					}
		});
	},
	getSecurityAns: function(cb) {
		request
			.get('/cooka-user-web/center/m/getAllProblem')
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	},
	getSecurityAnsSession: function(cb) {
		setTimeout(function() {
			var data = JSON.parse(sessionStorage.getItem('securityAnsText'));
			if (cb && typeof cb === 'function') {
				cb(data);
			}
		}, 0);
	},
	backToSecurityAns: function() {
		SecurityCommonActionCreators.receiveSecurityAns(true);
	},
	getPreQuestions: function(cb) {
		request
			.get('/cooka-user-web/center/m/getSafetyProblem')
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	},
	getEmailPhoneAccount: function(cb) {
		request
			.get('/cooka-user-web/center/m/getAccountInfo')
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	},
	initialStepAndSecurityans: function() {
		SecurityCommonActionCreators.receiveStep("1");
		SecurityCommonActionCreators.receiveSecurityAns(true);
	}
};