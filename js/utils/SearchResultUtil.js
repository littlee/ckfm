var SearchResultActionCreators = require('../actions/SearchResultActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');
var assign = require('lodash/object/assign.js');

module.exports = {
	getSearchResult: function(query) {
		var queryData = assign({}, query, {pageNum:0});

		request
			.get('/cooka-search/searchMobileResult')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.query(queryData)
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				SearchResultActionCreators.receiveSearchResult(data);
			});
	},

	getNextPage: function (query, cb) {
		request
			.get('/cooka-search/searchMobileResult')
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
