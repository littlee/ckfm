// require('../../less/comment.less');

var React = require('react');

var StarScore = require('./StarScore.js');
var ScrollLoad = require('./ScrollLoad.js');

var ListItem = React.createClass({

	render: function() {

		var append = this.props.list.comments.map(function(item, index) {
			if (index === 0) {
				return <p key={index}>{this.props.list.comments[0].comment}</p>;
			}
			if (item.commentBy === 'buyer') {
				return <div className="product-detail-comment-append" key={index}>{__('additional comment')} : {item.comment}</div>;
			} else {
				return <div className="product-detail-comment-append" key={index}>{__('seller reply')} : {item.comment}</div>;
			}
		}, this);

		return <div className="infinite-list-item" key={this.props.key}>
				<div className="product-detail-comment">
					<div className="product-detail-comment-head">
						<span className="product-detail-comment-buyer">{this.props.list.userName}</span>
						<span className="product-detail-comment-date">{this.props.list.comments[0].createTime}</span>
					</div>
					<div className="product-detail-comment-star">
						<StarScore score={this.props.list.scores}/>
					</div>
					{append}
				</div>
			</div>;
	}
});

var Loading = React.createClass({
	render: function() {
		return <div className="infinite-list-item">
				{__('loading...')}
				</div>;
	}
});

var Last = React.createClass({
	render: function() {
		return <div className="infinite-list-item">
				{__('all shown...')}
				</div>;
	}
});

var Comment = React.createClass({

	getInitialState: function() {
		return {
			elements: [],
			isInfiniteLoading: true,
			page: 1,
			hasNextPage: true,
			keyItem: 0
		};
	},

	componentDidMount: function() {
		require('../utils/ProductDetailUtil.js').getComment(1, this.props.params.productId, function(res) {
			this.buildElements(res);
		}.bind(this));
	},

	buildElements: function(res) {

		var comment = res;
		var elements = [];
		var keyItem = this.state.keyItem;
		for (var i = 0; i < comment.list.length; i++) {
			elements.push(<ListItem list={comment.list[i]} key={keyItem}/>);
			keyItem++;
		}
		var page = comment.nextPage;
		this.setState({
			isInfiniteLoading: false,
			elements: this.state.elements.concat(elements),
			page: page,
			hasNextPage: comment.hasNextPage,
			keyItem: keyItem
		});
	},

	handleInfiniteLoad: function() {

		this.setState({
			isInfiniteLoading: true
		});
		if (this.state.hasNextPage) {
			require('../utils/ProductDetailUtil.js').getComment(this.state.page, this.state.productId, function(res) {
				this.buildElements(res);
			}.bind(this));
		}
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<ScrollLoad
						containerHeight={400}
						loading={this.state.isInfiniteLoading}
						onReachBottom={this.handleInfiniteLoad}>
						
						{this.state.elements}
						
						{
							this.state.isInfiniteLoading ? (this.state.hasNextPage ? <Loading/> : <Last/>) : null
						}
					</ScrollLoad>
				</div>
			</div>
			);
	}
});

module.exports = Comment;
