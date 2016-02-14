var NotificationDetailActionCreators = require('../actions/NotificationDetailActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(query) {
		request
			.get('/cooka-user-web/center/m/announcement')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				NotificationDetailActionCreators.receiveData(data);
			});
	}
};