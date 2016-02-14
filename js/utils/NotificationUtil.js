var NotificationActionCreators = require('../actions/NotificationActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(query) {
		request
			.get('/cooka-user-web/center/m/announcementList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				NotificationActionCreators.receiveData(data);
			});
	},

	getNextPage: function(query, cb) {
		request
			.get('/cooka-user-web/center/m/announcementList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				if (err) {
					return err;
				}				

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
				
			});
	},

	changeStatus: function(data, cb) {
		request
			.post('/cooka-user-web/center/m/msgChangeStatus')
			.set('__RequestVerificationToken', CKFM.getToken())
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.send(data)
			.end(function(err, res) {
				if (err) {
					return err;
				}				

				if (cb && typeof cb === 'function') {
					cb(JSON.parse(res.text));
				}
				
			});
	}
};