require('../../less/comment.less');
require('../../less/star-score.less');
var React = require('react');
var Link = require('react-router').Link;
var CommentStore = require('../stores/CommentStore.js');
var CommentUtil = require('../utils/CommentUtil.js');
var History = require('react-router').History;
var Header = require('../components/Header.js');
var FormUtil = require('../utils/FormUtil.js');

var errMsgMap = {
	'emptyComment': __('the reply is required'),
	'limit': __('the content must less than 200 characters')
};

var ErrorMessage = React.createClass({

	propTypes: {
		error: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			error: ''
		};
	},

	render: function() {
		var show = false;
		show = this.props.error.length > 0;
		return (
			<div>
			{show ?
				<div className="alert alert-danger comment-error">
				{errMsgMap[this.props.error]}
			</div> : null
			}
			</div>
			);
	}
});


var StarScore = React.createClass({

	getInitialState: function() {

		return {
			score:5
		};

	},

	render: function() {

		var s = {
			width: this._getLightWidth()
		};

		return (
			<div className="star-score">
				<div className="star-score-dark">
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,1)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,2)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,3)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,4)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,5)}></span>
				</div>
				<div className="star-score-light" style={s}>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,1)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,2)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,3)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,4)}></span>
					<span className="icon-star-solid" onClick = {this._handleScore.bind(this,5)}></span>
				</div> 
				<input name="score" value={this.state.score} type="number" className="sr-only" onChange={this._handleScore.bind(this,this.state.score)}/>
			</div>
			);
	},

	_getLightWidth: function() {
		return this.state.score / 5 * 100 + '%';
	},

	_handleScore:function(score){
		this.setState({
			score: score
		});
	}
});


var Comment = React.createClass({

	mixins: [ History ],

	getInitialState: function() {

		return {
			order: CommentStore.getOrder(),
			error: ''
		};

	},

	componentDidMount: function() {

		CommentStore.addChangeListener(this._onChange);	

	},

	componentWillUnmount: function() {

		CommentStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (

			<div className="row">

				<div className="col-xs-12">
					<Header title={__('comment')}/>
				</div>

				<div className="col-xs-12">
					<form className="comment" onSubmit={this._handleSubmit}>

						<div className="comment-product">

							<div className="comment-imagebox">
								<img src={this.state.order.imageUrl}/>
							</div>

							<div className="comment-infobox">
								<Link className="comment-productname" to={`/productdetail/${this.state.order.productId}`}>{this.state.order.title}</Link>	
							</div>

						</div>


						{this.state.order.isCommented ? null : <div className = "comment-score">
							{__('score for goods')} : <StarScore />
						</div>}
						

						<div className = "comment-text">
							<textarea name = "comment"  className = "form-control comment-textarea" rows="5" placeholder = {__('write down your comments on this product')+__('the content must less than 200 characters')}></textarea>
						</div>

						
						<ErrorMessage error={this.state.error}/>

						
						<button type="submit" className={this.state.order.isCommented ? 'btn btn-default comment-btn comment-additional-btn':'btn btn-primary comment-btn'}>{__('additional comment')}</button>
					
					</form>	
				</div>	

			</div>

		);
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if (!data.comment) {
			this.setState({
				error: 'emptyComment'
			});
			return false;
		}

		if (data.comment.length>200) {
			this.setState({
				error: 'limit'
			});
			return false;
		}

		data.productId = this.state.order.productId ; 
		data.orderSerialNum = this.state.order.orderSerialNum ; 
		data.isAnonymous = true ; 
		data.commentBy = 'buyer'; 
		CommentUtil.sendData(data,function(res){
			if(res==='Success'){
				this.setState({
					error: ''
				});

				this.history.goBack();
				return;
			}

			this.setState({
				error: res
			});

		}.bind(this));

		return false;
	},

	_onChange: function() {

		this.setState({
			order: CommentStore.getOrder()
		});

	}
});

module.exports = Comment;