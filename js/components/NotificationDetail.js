require('../../less/notification.less');
var React = require('react');

var NotificationDetailStore = require('../stores/NotificationDetailStore.js');
var NotificationDetailUtil = require('../utils/NotificationDetailUtil.js');

function getStateFromStores() {
	return NotificationDetailStore.getData();
}

var Header = require('../components/Header.js');

var Notification = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		NotificationDetailUtil.getData({
			messageId: this.props.params.messageId
		});
		NotificationDetailStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		NotificationDetailStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('notifications')} />
				</div>
				<div className="col-xs-12">
					<div className="noti-detail">
						<h4>{this.state.title}</h4>
						<div className="noti-detail-content" dangerouslySetInnerHTML={this._getMarkUp()} />
					</div>
				</div>
			</div>
			);
	},

	_getMarkUp: function() {
		return {
			__html: this.state.messageUrl
		};
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Notification;
