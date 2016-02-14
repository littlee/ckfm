var HomeActionCreators = require('../actions/HomeActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/js/data/home.json')
			.use(CKFM.ajaxLoading())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				HomeActionCreators.receiveData(data);
			});
	}
};