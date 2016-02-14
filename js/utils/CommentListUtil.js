var CommentListActionCreators = require('../actions/CommentListActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/cooka-product-web/m/myCommentList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				CommentListActionCreators.receiveData(data);
			});
	},

	getNextPage: function(page, cb) {
		request
			.get('/cooka-product-web/m/myCommentList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query({
				page: page
			})
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