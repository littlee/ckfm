var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	searchResult: {
		query: '',
		searchProducts: [],
		sequence: [],
		showType: '',
		pageNum: 0,
		hasNextPage: false
	},
	searchCondition: {
		activeItems: {},
		price: [],
		resultAmount: 0,
		score: [],
		screeningState: false
	}
};

function _setSearchResult(result) {
	_data.searchResult.hasNextPage = result.hasNextPage;
	_data.searchResult.pageNum = result.pageNum;
	_data.searchResult.query = result.query;
	_data.searchResult.searchProducts = result.searchProducts;
	_data.searchResult.sequence = result.sequence;
	_data.searchResult.showType = result.showType;
}

function _setSearchCondition(condition) {
	_data.searchCondition.activeItems = condition.activeItems
	_data.searchCondition.price = condition.price
	_data.searchCondition.resultAmount = condition.resultAmount
	_data.searchCondition.score = condition.score
	_data.searchCondition.screeningState = condition.screeningState
}

function _concatSearchResult(result) {
	var searchProducts = _data.searchResult.searchProducts;
	_data.searchResult.hasNextPage = result.hasNextPage;
	_data.searchResult.pageNum = result.pageNum;
	_data.searchResult.query = result.query;
	_data.searchResult.sequence = result.sequence;
	_data.searchResult.showType = result.showType;
	_data.searchResult.searchProducts = searchProducts.concat(result.searchProducts);
}

function _setQuery(query) {
	_data.query = query;
}

function _setSearchProducts(searchProducts) {
	_data.searchProducts = searchProducts;
}

function _setSequence(sequence) {
	_data.sequence = sequence;
}

function _setShowType(showType) {
	_data.showType = showType;
}

var SearchResultStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getSearchData: function() {
		return _data;
	},

	getSearchResult: function() {
		return _data.searchResult;
	},

	getSearchCondition: function() {
		return _data.searchCondition;
	},

	getQuery: function() {
		return _data.searchResult.query;
	},

	getSearchProducts: function(){
		return _data.searchResult.searchProducts;
	},

	getSequence: function(){
		return _data.searchResult.sequence;
	},

	getShowType: function() {
		return _data.searchResult.showType;
	}
});

SearchResultStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.SEARCH_RECEIVE_RESULT:
			_setSearchResult(action.searchResult);
			_setSearchCondition(action.searchCondition);
			SearchResultStore.emitChange();
			break;
		case ActionTypes.SEARCH_RECEIVE_NEXT_PAGE_RESULT:
			_concatSearchResult(action.nextPageResult);
			SearchResultStore.emitChange();
			break;
		default:
	}
});

module.exports = SearchResultStore;
