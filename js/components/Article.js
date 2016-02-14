require('../../less/article.less');
var React = require('react');
var ArticleStore = require('../stores/ArticleStore.js');
var ArticleUtil = require('../utils/ArticleUtil.js');
var marked = require('marked');

function getStateFromStores() {
	return ArticleStore.getData();
}

var Header = require('../components/Header.js');

var Article = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var file = this.props.params.file;
		ArticleUtil.getData(file);
		ArticleStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ArticleStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header />
				</div>
				<div className="col-xs-12">
					<div className="article">
						<div dangerouslySetInnerHTML={this._getMarkUp()} />
					</div>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	_getMarkUp: function() {
		return {
			__html: marked(this.state.article)
		};
	}
});

module.exports = Article;
