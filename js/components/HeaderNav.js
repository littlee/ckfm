require('../../less/header-nav.less');

var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require('react-router').IndexLink;

var HeaderNav = React.createClass({
	render: function() {
		return (
			<div className="header-nav">
				<IndexLink to="/" className="header-nav-item">
					<span className="header-nav-icon">
						<span className="icon-home"></span>
					</span>
					<span className="header-nav-text">
						{__('home')}
					</span>
				</IndexLink>
				<Link to="/categories" className="header-nav-item">
					<span className="header-nav-icon">
						<span className="icon-category"></span>
					</span>
					<span className="header-nav-text">
						{__('categories')}
					</span>
				</Link>
				<Link to="/cart" className="header-nav-item">
					<span className="header-nav-icon">
						<span className="icon-cart"></span>
					</span>
					<span className="header-nav-text">
						{__('cart')}
					</span>
				</Link>
				<Link to="/usercenter" className="header-nav-item">
					<span className="header-nav-icon">
						<span className="icon-user"></span>
					</span>
					<span className="header-nav-text">
						{__('user center')}
					</span>
				</Link>
			</div>
			);
	}
});

module.exports = HeaderNav;