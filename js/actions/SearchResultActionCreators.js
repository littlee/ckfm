var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveSearchResult: function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes.SEARCH_RECEIVE_RESULT,
			searchResult: data.searchResult,
			searchCondition: data.searchCondition
		});
	},
	receiveNextPageResult: function(nextPageResult) {
		AppDispatcher.dispatch({
			type: ActionTypes.SEARCH_RECEIVE_NEXT_PAGE_RESULT,
			nextPageResult: nextPageResult
		});
	}
};
