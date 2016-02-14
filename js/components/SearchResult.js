require('../../less/search-result.less');

var React = require('react');
var assign = require('lodash/object/assign.js');
var Header = require('./Header.js');
var History = require('react-router').History;
var ScrollLoad = require('../components/ScrollLoad.js');
var SequenceBtn = require('./SequenceBtn.js');
var GridAppearance = require('./GridAppearance.js');
var LineAppearance = require('./LineAppearance.js');
var SearchScreening = require('./SearchScreening.js');
var searchResultUtil = require('../utils/SearchResultUtil.js');
var SearchResultStore = require('../stores/SearchResultStore.js');
var SearchResultActionCreators = require('../actions/SearchResultActionCreators.js');

function getStateFromStores() {
	return SearchResultStore.getSearchData();
}

var ShowResult = React.createClass({
	propTypes: {
		showType: React.PropTypes.string,
		query: React.PropTypes.object,
		searchResult: React.PropTypes.array,
		pageNum: React.PropTypes.number,
		hasNextPage: React.PropTypes.bool
	},

	getInitialState: function() {
		return {
			resultHeight: 500,
			loading: false
		};
	},

	componentDidMount: function() {
		this._handleWindowScroll();
		window.addEventListener('scroll', this._handleWindowScroll, false);
	},

	componentWillUnmount: function() {
		window.removeEventListener('scroll', this._handleWindowScroll, false);
	},

	_getNextPageTransaction: function() {
		if (this.props.hasNextPage) {
			this.setState({
				loading: true
			});

			var query = {
				pageSize: 10,
				page: this.props.pageNum + 1
			};

			var queryData = assign({}, this.props.query, query);

			searchResultUtil.getNextPage(queryData, function(data) {
				this.setState({
					loading: false
				});

				SearchResultActionCreators.receiveNextPageResult(data.searchResult);

			}.bind(this));
		}
	},

	_handleWindowScroll: function() {
		this.setState({
			resultHeight: (window.innerHeight - this.refs.scrollResult.offsetTop)
		});
	},

	render: function() {
		return (
			<ScrollLoad
				ref="scrollLoad"
				containerHeight={this.state.resultHeight}
				loading={this.state.loading}
				onReachBottom={this._getNextPageTransaction}>

				<SearchScreening searchCondition={this.props.searchCondition} location={this.props.location}/>
				<div className="col-xs-12 trim-col">
					<SequenceBtn activeBtn={this.props.activeBtn} showType={this.props.showType} showTypeBtnClick={this.props.showTypeBtnClick} location={this.props.location}/>
				</div>

				<div className="scroll-result" ref="scrollResult">
					{ this.props.showType === 'line' ?
						<LineAppearance
							query={this.props.query}
							searchResult={this.props.searchProducts}
							pageNum={this.props.pageNum}
							hasNextPage={this.props.hasNextPage}/>
						:
						<GridAppearance
							query={this.props.query}
							searchResult={this.props.searchProducts}
							pageNum={this.props.pageNum}
							hasNextPage={this.props.hasNextPage}/>
					}
				</div>
			</ScrollLoad>
		);
	}
});

var SearchResult = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		SearchResultStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		SearchResultStore.removeChangeListener(this._onChange);
	},

	HandleShowTypeBtnClick: function() {

		var newType;
		if (this.state.searchResult.showType === 'grid') {
			newType = 'line';
		} else {
			newType = 'grid';
		}

		var queryItem = {
			showType : newType
		};

		var tempQuery = assign({}, this.props.location.query, queryItem);

		this.history.pushState(null, '/searchresult', tempQuery);
	},


	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header />
				</div>
				<div className="search-module">

					<div className="col-xs-12 trim-col search-product-result">
						<ShowResult
							searchCondition={this.state.searchCondition}
							location={this.props.location}
							activeBtn={this.state.searchResult.sequence}
							showTypeBtnClick={this.HandleShowTypeBtnClick}

							searchProducts={this.state.searchResult.searchProducts}
							showType={this.state.searchResult.showType}
							query={this.props.location.query}
							pageNum={this.state.searchResult.pageNum}
							hasNextPage={this.state.searchResult.hasNextPage}/>
					</div>
				</div>
			</div>
		);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = SearchResult;
