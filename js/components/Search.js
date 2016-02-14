require('../../less/search.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var SearchStore = require('../stores/SearchStore.js');
var SearchActionCreators = require('../actions/SearchActionCreators.js');

var CKFM = require('../CKFM.js');

function getStateFromStores() {
	return SearchStore.getData();
}

var HeaderNav = require('../components/HeaderNav.js');

var SearchHeader = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return {
			navopen: false
		};
	},

	render: function() {
		var isSigned = CKFM.isSignedIn();
		return (
			<div className="search-header">
				<a href="#" className={'header-nav-opener' + (this.state.navopen ? ' active' : '')} onClick={this._toggleNav}>
					<span className={'icon-' + (this.state.navopen ? 'close' : 'nav-bar')}></span>
				</a>
				<a to="#" className="search-header-search" onClick={this._goBack}>
					<span className="icon-close"></span>
				</a>
				{
					isSigned ?
					<Link to="/usercenter" className="search-header-signin">
						<span className="icon-signed-in"></span>
					</Link>
					:
					<Link to="/usercenter" className="search-header-signin">
						<span className="icon-sign-in"></span>
					</Link>
				}


				<div className="search-header-logo">
					<img src="images/logo_dark.png" />
				</div>

				{this.state.navopen ? <HeaderNav /> : null}
			</div>
			);
	},

	_goBack: function(e) {
		e.preventDefault();
		this.history.goBack();
	},

	_toggleNav: function(e) {
		e.preventDefault();
		this.setState({
			navopen: !this.state.navopen
		});
	}
});

var SearchInput = React.createClass({

	mixins: [ History ],

	getInitialState: function() {
		return {
			type: 'query',
			text: ''
		};
	},

	componentDidMount: function() {
		this.refs.input.focus();
	},

	render: function() {
		return (
			<div className="search-input">
				<div className="row">
					<div className="col-xs-9">
						<div className="input-group">
							<span className="input-group-addon search-query-type">
								<span className="search-query-type-caret"></span>
								<select className="search-query-type-select" onChange={this._handleSearchType} defaultValue="query">
									<option value="query">{__('keyword')}</option>
									<option value="pn">{__('product code')}</option>
								</select>
							</span>
							<input 
								type="text" 
								className="form-control search-textfield" 
								placeholder={__('search') + '...'} 
								ref="input" 
								value={this.state.text} 
								onChange={this._typeText} />
						</div>
						<div className="search-clear" onClick={this._clearText}>
							<span className="icon-clear"></span>
						</div>
					</div>
					<div className="col-xs-3 trim-left">
						<button className="btn btn-primary btn-block btn-rect" type="buton" disabled={!this.state.text.trim().length > 0} onClick={this._handleSearch}>
							{__('search')}
						</button>
					</div>
				</div>
			</div>
			);
	},

	_typeText: function(e) {
		this.setState({
			text: e.target.value
		});
	},

	_clearText: function() {
		this.setState({
			text: ''
		});
	},

	_handleSearchType: function(e) {
		this.setState({
			type: e.target.value
		});
	},

	_handleSearch: function() {
		SearchActionCreators.pushHistory({
			type: this.state.type,
			text: this.state.text
		});

		var q = {};
		q[this.state.type] = this.state.text;

		this.history.pushState(null, '/searchresult', q);
	}
});

var SearchHistory = React.createClass({
	propTypes: {
		history: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			history: []
		};
	},

	render: function() {

		var items = this.props.history.map(function(h, i) {
			var q = {};
			q[h.type] = encodeURIComponent(h.text);
			return (
				<li key={i}>
					<Link to="/searchresult" query={q}>
						<span className="icon-timer"></span>
						<span className="search-history-text">{h.text}</span>
					</Link>
				</li>
			);
		});

		return (
			<div>
				<div className="search-history">
					{items.length > 0 ? <ul className="search-history-items">{items.reverse()}</ul> : <div>{__('no search history')}</div>}
				</div>
				<div className="search-history-btn text-center" onClick={this._handleClearHistory}>
					<button type="button" className="btn btn-default" disabled={items.length === 0}>{__('clear search history')}</button>
				</div>
			</div>
			);
	},

	_handleClearHistory: function() {
		SearchActionCreators.clearHistory();
	}
});

var SearchTrend = React.createClass({
	propTypes: {
		trend: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			trend: []
		};
	},

	render: function() {

		var items = this.props.trend.map(function(t, i) {
			return (
				<Link to="/searchresult" key={i} query={{query: encodeURIComponent(t)}}>
				{t}
				</Link>
				);
		});

		return (
			<div className="search-trend">
				<h4 className="search-trend-title">{__('search trending')}</h4>
				<div className="search-trend-items">
					{items}
				</div>
			</div>
			);
	}
});

var Search = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		SearchStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		SearchStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<SearchHeader/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="search">
						<SearchInput />
						<SearchHistory history={this.state.history}/>
						<SearchTrend trend={this.state.trend}/>
					</div>
				</div>
			</div>
			);
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Search;
