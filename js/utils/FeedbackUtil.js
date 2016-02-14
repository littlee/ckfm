var request = require('superagent');

var FeedbackActionCreators = require('../actions/FeedbackActionCreators.js');
var CKFM = require('../CKFM.js');

module.exports = {
	submitFeedback: function(data) {				
		request
			.post('/cooka-user-web/mAddFeedback')
			.use(CKFM.ajaxLoading())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('dataType', 'html')
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(JSON.stringify(data))
			.end(function(err, res) {
				FeedbackActionCreators.submitFeedback(res.text,'submitResult');
			});
	}
};