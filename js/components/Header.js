require('../../less/header.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;

var HeaderNav = require('./HeaderNav.js');

var Header = React.createClass({
	mixins: [ History ],

	propTypes: {
		title: React.PropTypes.string,
		hasSearch: React.PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			title: 'Cookabuy',
			hasSearch: true
		};
	},

	getInitialState: function() {
		return {
			openMenu: false
		};
	},

	render: function() {
		var navClass = 'header-nav-opener header-nav-opener-right';
		if (this.state.openMenu) {
			navClass += ' active';
		}

		var hStyle = {
			'paddingRight': '40px'
		};

		if (this.props.hasSearch) {
			hStyle['paddingRight'] = '80px';
		}

		return (
			<div className="header">
				<a href="#" className="header-back" onClick={this._goBack}>
					<span className="icon-back-arrow"></span>
				</a>
				<h4 className="header-title" style={hStyle}>{this.props.title}</h4>
				
				{
					this.props.hasSearch ?
					<Link to="/search" className='header-search'>
						<span className="icon-search"></span>
					</Link> : null
				}

				<a href="#" className={navClass} onClick={this._toggleNav}>
					<span className={'icon-' + (this.state.openMenu ? 'close' : 'nav-bar')}></span>
				</a>
				{this.state.openMenu ? <HeaderNav/> : null}
			</div>
			);
	},

	_goBack: function(e) {
		e.preventDefault();
		this.history.goBack();
	},

	_toggleNav: function(e) {
		e.preventDefault();
		var newOpenMenu = null;
		if (this.state.openMenu) {
			newOpenMenu = false;
		}
		else {
			newOpenMenu = true;
		}
		this.setState({
			openMenu: newOpenMenu
		});
	} 
});

module.exports = Header;