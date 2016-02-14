var UserCenterActionCreators = require('../actions/UserCenterActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/cooka-user-web/center/m/mobileHome')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				UserCenterActionCreators.receiveData(data);
			});
	},

	signOut: function(cb) {
		request
			.get('/cooka-user-web/logout')
			.use(CKFM.ajaxLoading())
			.end(function(err) {
				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb();
				}
			});
	}
};