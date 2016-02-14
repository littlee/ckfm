var CommentActionCreators = require('../actions/CommentActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {

	getData: function() {
		// get data from sessionStorage, should queue up
		// data will be provided from order detail or comment list
		setTimeout(function() {
			var data = sessionStorage.getItem('ck_comment_from');
			CommentActionCreators.receiveOrder(JSON.parse(data));
		}, 0);
	},

	sendData: function(data, cb) {
		request
			.post('/cooka-product-web/m/doAddComment')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json')
			.send(data)
			.end(function (err, res) {

				if (err) {
					return err;
				}

				if (cb && typeof cb === 'function') {
					cb(res.text);
				}
				
			});
	}

};