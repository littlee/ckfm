var CKFM = require('../CKFM.js');
var request = require('superagent');

module.exports = {
	signUp: function(data, cb) {
		if (data['c-code']) {
			data.account = data['c-code'] + data.account;
			delete data['c-code'];
		}

		delete data['cpassword'];

		request
			.post('/cooka-user-web/mAjaxRegister')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(JSON.stringify(data))
			.end(function (err, res) {
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
				
			});
	},

	checkAccountExist: function(acc, cb) {
		request
			.post('/cooka-user-web/mIsExistAccount')
			.set('__RequestVerificationToken', CKFM.getToken())
			.send({
				account: acc
			})
			.end(function (err, res) {

				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
				
			});
	},

	sendRandomCode: function(data, cb) {
		var d = {
			account: data.account,
			captcha: data.captcha
		};

		if (data['c-code']) {
			d.account = data['c-code'] + data.account;
		}

		request
			.post('/cooka-user-web/mSendCodeForRegister')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(d)
			.end(function (err, res) {

				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
				
			});
	}
};