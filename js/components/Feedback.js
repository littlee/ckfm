require('../../less/feedback.less');
var React = require('react');

var Header = require('./Header.js');
var FormUtil = require('../utils/FormUtil.js');
var FeedbackUtil = require('../utils/FeedbackUtil.js');
var Link = require('react-router').Link;

var FeedbackStore = require('../stores/FeedbackStore.js');
var FeedbackActionCreators = require('../actions/FeedbackActionCreators.js');

var CKFM = require('../CKFM.js');

function getStateFromStores() {
	return FeedbackStore.getData();
}

var ErrMsgMap = {
	'feebackTitleRequired': __('the feedback title is required and can not be empty'),
	'feedbackDescr': __('the feedback description is required and can not be empty'),
	'emailRequired': __('the email is required and can not be empty'),
	'emailPattern': __('email format is wrong')
};

var ErrMsg = React.createClass({
	render: function() {
		return (
			<div className="alert alert-danger feedback-form-danger">{this.props.msg}</div>
			);
	}
});
var SuccMsg = React.createClass({
	render: function() {
		return (
			<div className="alert alert-success feedback-tip" role="alert">
				<strong>{__('successfully')}!</strong> 
				{__('we will deal with the problem you put forward as soon as possible, thank you for your suggestion and criticism')}
			</div>
			);
	}
});

var NorMsg = React.createClass({
	render: function() {
		return (
			<div className="feedback-tip feedback-tip-normal">
				<strong>{__('attention')}!</strong>
				{__('for easy connection, please fill in your email')}
			</div>
			);
	}
});

var Feedback = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},
	componentDidMount: function() {
		FeedbackStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		FeedbackStore.removeChangeListener(this._onChange);
	},
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('feedback')}/>
				</div>
				<div className="col-xs-12">
					<div className="feedback">
						{this.state.submitResult ? <SuccMsg/> : <NorMsg/>}
						<form className="form-horizontal feedback-form" onSubmit={this._handleSubmit}>
							<div className="form-group">
								<div className="input-group">
									<div className="input-group-addon feedback-form-addon">{__('title')}:</div>
									<input type="text" className="form-control feedback-form-input" name="title" ref="feedbackTitle" required/>
								</div>
							</div>
							<div className="form-group feedback-form-textarea">
								<textarea className="form-control" rows="8" name="content" ref="feedbackDescr" placeholder={__('please put forward your valuable comments and suggestions')} maxLength="200" onChange={this._countDescr} required>
								</textarea>
								<div className="feedback-form-textarea-count">
									<span className="feedback-form-textarea-count-num">{this.state.textLength}</span>/<span className="feedback-form-textarea-count-total">200</span>
								</div>
							</div>
							<div className="form-group">
								<div className="input-group">
									<div className="input-group-addon feedback-form-addon">{__('email')}:</div>
									<input type="email" className="form-control feedback-form-input" name="email" ref="email" pattern="^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$" required/>
								</div>
							</div>
							{this.state.err.length > 0 ? <ErrMsg msg={this.state.err}/> : null}

							<div className="form-group feedback-form-btn">
								<button type="submit" className="btn btn-primary btn-block btn-rect">
								{__('submit feedback')}
								</button>
							</div>
						</form>

						<div className="feedback-link">
							<a href={'tel:' + CKFM.getStoreHotline()} className="feedback-link-item">
								{__('contact customer service')}
							</a>
						</div>
					</div>
				</div>
			</div>
			);
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				var pattern = this.refs.email.pattern;
				if (this.refs.feedbackTitle.value.trim() === "") {
					FeedbackActionCreators.submitFeedback(ErrMsgMap.feebackTitleRequired, 'err');
				} else if (this.refs.feedbackDescr.value.trim() === "") {
					FeedbackActionCreators.submitFeedback(ErrMsgMap.feedbackDescr, 'err');
				} else if (this.refs.email.value.trim() === "") {
					FeedbackActionCreators.submitFeedback(ErrMsgMap.emailRequired, "err");
				} else if (!(this.refs.email.value.trim()).match(pattern)) {
					FeedbackActionCreators.submitFeedback(ErrMsgMap.emailPattern, 'err');
				}
				return false;
			}
			else
				FeedbackActionCreators.submitFeedback('', 'err');
		}
		FeedbackUtil.submitFeedback(data);
		return false;
	},
	_countDescr: function(e) {
		FeedbackActionCreators.submitFeedback(e.target.value.length, 'textLength');
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Feedback;