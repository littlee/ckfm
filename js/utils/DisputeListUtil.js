var DisputeListActionCreators = require('../actions/DisputeListActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function(query) {
		request
			.get('/cooka-order-web/m/getDisputeList')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(query)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				DisputeListActionCreators.receiveData(data);
			});
	},

	getNextPage: function(query, cb) {
		request
			.get('/cooka-order-web/m/getDisputeList')
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
	}
};