var SearchActionCreators = require('../actions/SearchActionCreators.js');
var request = require('superagent');

module.exports = {
	getData: function() {
		var h = localStorage.getItem('ck_history');
		request.get('/js/data/search.json').end(function(err, res) {
			var data = JSON.parse(res.text);
			if (h !== null) {
				data.history = JSON.parse(h);
			}
			SearchActionCreators.receiveData(data);
		});
	}
};
