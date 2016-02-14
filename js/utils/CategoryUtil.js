var CategoryActionCreators = require('../actions/CategoryActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/cooka-productDetail-web/getCategories')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				CategoryActionCreators.receiveData({
					category: data
				});
			});
	}
};