require('../../less/notification.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var NotificationActionCreators = require('../actions/NotificationActionCreators.js');
var NotificationStore = require('../stores/NotificationStore.js');
var NotificationUtil = require('../utils/NotificationUtil.js');

function getStateFromStores() {
	return NotificationStore.getData();
}

var Header = require('../components/Header.js');
var ScrollLoad = require('../components/ScrollLoad.js');

var NotificationFilter = React.createClass({
	mixins: [ History ],

	getInitialState: function() {
		return {
			announcementType: this.props.announcementType || ''
		};
	},

	render: function() {

		return (
			<div className="noti-filter">
				<div className={'noti-filter-nav' + (this.state.announcementType === '' ? ' active' : '')} onClick={this._changeFilter.bind(this, '')}>
					{__('all notifications')}
				</div>
				<div className={'noti-filter-nav' + (this.state.announcementType === 'mark' ? ' active' : '')} onClick={this._changeFilter.bind(this, 'mark')}>
					{__('stared notifications')}
				</div>
				<div className={'noti-filter-nav' + (this.state.announcementType === 'dustbin' ? ' active' : '')} onClick={this._changeFilter.bind(this, 'dustbin')}>
					{__('recycle bin')}
				</div>
			</div>
			);
	},

	_changeFilter: function(type, e) {
		e.preventDefault();
		this.setState({
			announcementType: type
		});

		this.history.pushState(null, '/notification', {
			announcementType: type
		});
	}
});

var NotificationItems = React.createClass({

	render: function() {
		var items = [];
		if (!this.props.list.length) {
			items = <h3 className="text-center">{__('no notifications')}</h3>;
		}
		else {
			items = this.props.list.map(function(noti, i) {

				var btns = null;

				switch(this.props.announcementType) {

				case 'mark':
					btns = 
						<div className="noti-btns">
							<a href="#" className={'noti-btn'} onClick={this._changeStatus.bind(this, {
								handleType: 4,
								messageIds: [noti.messageId]
							})}>
								<span className="icon-unstar"></span>
							</a>
							<a href="#" className={'noti-btn'} onClick={this._changeStatus.bind(this, {
								handleType: 1,
								messageIds: [noti.messageId]
							})}>
								<span className="icon-delete-o"></span>
							</a>
						</div>;
					break;

				case 'dustbin':
					btns = 
						<div className="noti-btns">
							<a href="#" className={'noti-btn'} onClick={this._changeStatus.bind(this, {
								handleType: 2,
								messageIds: [noti.messageId]
							})}>
								<span className="icon-recover"></span>
							</a>
							<a href="#" className={'noti-btn'} onClick={this._changeStatus.bind(this, {
								handleType: 5,
								messageIds: [noti.messageId]
							})}>
								<span className="icon-failed-circle-o"></span>
							</a>
						</div>;
					break;

				default:
					btns = 
						<div className="noti-btns">
							<a href="#" className={'noti-btn'} onClick={this._changeStatus.bind(this, {
								handleType: (noti.isMarked ? 4 : 3),
								messageIds: [noti.messageId]
							})}>
								<span className={'icon-' + (noti.isMarked ? 'unstar' : 'star')}></span>
							</a>
							<a href="#" className={'noti-btn'} onClick={this._changeStatus.bind(this, {
								handleType: 1,
								messageIds: [noti.messageId]
							})}>
								<span className="icon-delete-o"></span>
							</a>
						</div>;
				}

				return (
					<div className="noti-list-item" key={i}>
						<div className="noti-title">
							<Link to={'/notificationdetail/' + noti.messageId}>
								{noti.title}
							</Link>
						</div>
						<div className="noti-options">
							<div className="noti-time">
								{noti.timeStart}
							</div>
							{btns}
						</div>
					</div>
					);
			}, this);
		}

		return (
			<div className="noti-list-items">
				{items}
			</div>
			);
	},

	_changeStatus: function(data, e) {
		e.preventDefault();
		NotificationUtil.changeStatus(data, function(res) {
			if (!res) {
				alert(__('operation failed'));
				return;
			}
			NotificationUtil.getData({announcementType: this.props.announcementType});
		}.bind(this));
	}
});


var NotificationWrap = React.createClass({
	mixins: [History],

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
		return (
			<div className="noti" ref="wrap">
					<NotificationFilter announcementType={this.props.announcementType}/>
					<ScrollLoad
						ref="scrollLoad"
						containerHeight={this.state.wrapHeight}
						loading={this.state.loading}
						onReachBottom={this._getNextPageOrderList}>

						<NotificationItems list={this.props.list} announcementType={this.props.announcementType} />

					</ScrollLoad>
				</div>
			);
	},

	_handleWindowScroll: function() {
		this.setState({
			wrapHeight: (window.innerHeight - this.refs.wrap.offsetTop)
		});
	},

	_getNextPageOrderList: function() {
		if (this.props.hasNextPage) {
			this.setState({
				loading: true
			});

			var q = {
				announcementType: this.props.announcementType || '',
				page: this.props.pageNum + 1
			};

			NotificationUtil.getNextPage(q, function(res) {
				this.setState({
					loading: false
				});
				NotificationActionCreators.receiveNextPageData(res);

			}.bind(this));
		}
	}
});

var Notification = React.createClass({
	mixins: [History],

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		var query = this.props.location.query;
		NotificationUtil.getData(query);
		NotificationStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		NotificationStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		var query = nextProps.location.query;
		NotificationUtil.getData(query);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('notifications')} />
				</div>
				<div className="col-xs-12">
					<NotificationWrap
						announcementType={this.props.location.query.announcementType}
						list={this.state.list}
						pageNum={this.state.pageNum}
						hasNextPage={this.state.hasNextPage}/>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Notification;
