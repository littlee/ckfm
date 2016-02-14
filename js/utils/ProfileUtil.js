var ProfileActionCreators = require('../actions/ProfileActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(query) {
		request
			.get('/js/data/profile.json')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				ProfileActionCreators.receiveData(data);
			});
	}
};