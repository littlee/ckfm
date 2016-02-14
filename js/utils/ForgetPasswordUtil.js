var CKFM = require('../CKFM.js');
var request = require('superagent');

module.exports = {
	forgetPassword: function(data, cb) {
		
		if (data['c-code']) {
			data.account = data['c-code'] + data.account;
			delete data['c-code'];
		}

		request
			.post('/cooka-user-web/mResetPaswd')
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

	verifyRandomCode: function(data, cb) {
		request
			.post('/cooka-user-web/mVerifyRandomCode')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
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

	sendRandomCodeAgain: function(cb) {
		request
			.post('/cooka-user-web/mSendAgain')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.end(function (err, res) {
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
			});
	},

	setNewPassword: function(data, cb) {
		request
			.post('/cooka-user-web/mDoReset')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(data)
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