var CKFM = require('../CKFM.js');
var request = require('superagent');

module.exports = {
	signIn: function(data, cb) {

		cb = arguments[arguments.length - 1];

		if (data['c-code']) {
			data.account = data['c-code'] + data.account;
			delete data['c-code'];
		}

		request
			.post('/cooka-user-web/mAjaxLogin')
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
	}
};