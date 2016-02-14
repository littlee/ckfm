var ArticleActionCreators = require('../actions/ArticleActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(file) {
		request
			.get('/articles/' + file)
			.use(CKFM.ajaxLoading())
			.end(function(err, res) {
				ArticleActionCreators.receiveData({
					article: res.text
				});
			});
	}
};