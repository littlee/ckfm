var AccountSecurityActionCreators = require('../actions/AccountSecurityActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');
module.exports = {
	getStatus: function() {
		///cooka-user-web/center/m/security
		request
			.get('/cooka-user-web/center/m/security')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				AccountSecurityActionCreators.receiveStatus(data);
			});
	}
};
