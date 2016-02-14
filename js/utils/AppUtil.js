var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	fetchToken: function() {
		request
			.get('/cooka-user-web/get')
			.use(CKFM.ajaxLoading())
			.end(function(err, res) {
				var token = res.text;
				// token = 'X_TOKEN';
				sessionStorage.setItem('xtoken', token);
			});
	}
};