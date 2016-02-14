require('../../less/comment-list.less');
var React = require('react');
var History = require('react-router').History;

var CommentListActionCreators = require('../actions/CommentListActionCreators.js');
var CommentListStore = require('../stores/CommentListStore.js');
var CommentListUtil = require('../utils/CommentListUtil.js');

function getStateFromStores() {
	return CommentListStore.getData();
}

var Header = require('../components/Header.js');
var StarScore = require('../components/StarScore.js');
var ScrollLoad = require('../components/ScrollLoad.js');

var CommentListWrap = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return {
			wrapHeight: 300,
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

	render: function() {
		var items = null;
		if (!this.props.list.length) {
			items = <h3 className="text-center">{__('no comments')}</h3>;
		} else {
			items = this.props.list.map(function(order) {
				return order.orderProducts.map(function(product, i) {

					if (product.comments === null) {
						return null;
					}

					var cItems = product.comments.filter(function(com) {
						if (com.commentBy !== 'seller') {
							return true;
						}
						return false;
					}).map(function(com, j) {
						return (
							<div className="comment-list-item" key={j}>
								<div className="comment-list-item-text">
									{com.comment}
								</div>
								<div className="comment-list-item-time">
									{com.createTime}
								</div>
							</div>
							);
					});

					return (
						<div className="comment-list-product" key={i}>
							<div className="comment-list-product-inner">
								<div className="comment-list-product-thumb">
									<img src={product.imageUrl} />
								</div>
								<div className="comment-list-product-info">
									<div className="comment-list-product-title">
										{product.title}
									</div>
									<div className="comment-list-product-score">
										<StarScore score={product.score} />
									</div>
								</div>
							</div>

							{cItems}

							<div className="comment-list-btn">
								<button type="button" className="btn btn-rect btn-default" onClick={this._comment} data-comment={JSON.stringify({
									title: product.title,
									imageUrl: product.imageUrl,
									productId: product.productId,
									isCommented: product.isCommented,
									orderSerialNum: order.orderSerialnum
								})}>
									{__('additional comment')}
								</button>
							</div>
						</div>
						);
				}, this);
			}, this);
		}

		return (
			<div className="comment-list" ref="wrap">
				<ScrollLoad
					containerHeight={this.state.wrapHeight}
					loading={this.state.loading}
					onReachBottom={this._getNextPageCommentList}>
					{items}
				</ScrollLoad>
			</div>
			);
	},

	_handleWindowScroll: function() {
		this.setState({
			wrapHeight: (window.innerHeight - this.refs.wrap.offsetTop)
		});
	},

	_comment: function(e) {
		var commentData = e.target.getAttribute('data-comment');
		sessionStorage.setItem('ck_comment_from', commentData);
		this.history.pushState(null, '/comment');
	},

	_getNextPageCommentList: function() {
		if (this.props.hasNextPage) {
			this.setState({
				loading: true
			});
			var np = this.props.pageNum + 1;
			CommentListUtil.getNextPage(np, function(res) {
				this.setState({
					loading: false
				});
				CommentListActionCreators.receiveNextPageData(res);
			}.bind(this));
		}
	}
});

var CommentList = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		CommentListStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		CommentListStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('my comments')} />
				</div>
				<div className="col-xs-12">
					<CommentListWrap list={this.state.list} pageNum={this.state.pageNum} hasNextPage={this.state.hasNextPage}/>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = CommentList;