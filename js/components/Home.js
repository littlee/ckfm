require('../../less/home.less');
require('slick-carousel/slick/slick.less');

var CKFM = require('../CKFM.js');

var React = require('react');
var Slick = require('react-slick');
var Link = require('react-router').Link;

var HomeStore = require('../stores/HomeStore.js');

function getStateFromStores() {
	return HomeStore.getData();
}

var HeaderNav = require('./HeaderNav.js');

var HomeTopBar = React.createClass({
	getInitialState: function() {
		return {
			navopen: false
		};
	},

	render: function() {

		var s = CKFM.isSignedIn();

		return (
			<div className="home-top-bar">
				<a href="#" className={'header-nav-opener' + (this.state.navopen ? ' active' : '')} onClick={this._toggleNav}>
					<span className={'icon-' + (this.state.navopen ? 'close' : 'nav-bar')}></span>
				</a>
				<Link to="/search" className="home-top-bar-search">
					<span className="icon-search"></span>
				</Link>

				<Link to={s ? '/usercenter' : '/signin'} className="home-top-bar-signin">
					<span className={'icon-' + (s ? 'signed-in' : 'sign-in')}></span>
				</Link>

				<div className="home-top-bar-logo">
					<img src="images/logo_dark.png" />
				</div>

				{this.state.navopen ? <HeaderNav /> : null}
			</div>
			);
	},

	_toggleNav: function(e) {
		e.preventDefault();
		this.setState({
			navopen: !this.state.navopen
		});
	}
});

var HomeCarousel = React.createClass({
	render: function() {
		var slickSettings = {
			arrows: false,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		};

		var carouselItems = [];
		if (this.props.carousel !== null) {
			carouselItems = this.props.carousel.map(function(item, index) {
				return (
					<div key={index}>
						<a href={item.url}>
							<img src={item.image} className="home-carousel-img"/>
						</a>
					</div>
					);
			});
		}

		return (
			<div className="home-carousel">
				<Slick {...slickSettings}>
					{carouselItems}
				</Slick>
			</div>
			);
	}
});

var HomeLinks = React.createClass({
	render: function() {
		return (
			<div className="home-links">
				<Link to="/categories" className="home-links-item">
					<span className="home-links-icon">
						<span className="icon-category"></span>
					</span>
					<span className="home-links-text">{__('goods categories')}</span>
				</Link>
				<Link to="/activities" className="home-links-item">
					<span className="home-links-icon">
						<span className="icon-activity"></span>
					</span>
					<span className="home-links-text">{__('activities area')}</span>
				</Link>
				<Link to="/topsales" className="home-links-item">
					<span className="home-links-icon">
						<span className="icon-top-sales"></span>
					</span>
					<span className="home-links-text">{__('top sales')}</span>
				</Link>
				<Link to="/usercenter" className="home-links-item">
					<span className="home-links-icon">
						<span className="icon-user"></span>
					</span>
					<span className="home-links-text">{__('user center')}</span>
				</Link>
			</div>
			);
	}
});

var HomeChannel = React.createClass({
	render: function() {
		return (
			<div clsasName="home-channel">
				<div className="home-channel-title">
					<h4>{__('activities area')}</h4>
				</div>
				<div className="home-channel-figures">
					<Link to="/channel/1" className="home-channel-figure">
						<img src="http://placehold.it/300x200"/>
					</Link>
					<Link to="/channel/2" className="home-channel-figure">
						<img src="http://placehold.it/300x200"/>
					</Link>
					<Link to="/channel/3" className="home-channel-figure">
						<img src="http://placehold.it/300x200"/>
					</Link>
					<Link to="/channel/4" className="home-channel-figure">
						<img src="http://placehold.it/300x200"/>
					</Link>
				</div>
			</div>
			);
	}
});

var HomeFloor1 = React.createClass({
	render: function() {
		var items = [];
		if (this.props.products !== null) {
			items = this.props.products.map(function(p, i) {
				return (
					<div className="home-floor-col" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('lowest price today')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					{items}
				</div>
			</div>
			);
	}
});

var HomeFloor2 = React.createClass({
	render: function() {
		var items = [];
		if (this.props.products !== null) {
			items = this.props.products.map(function(p, i) {
				return (
					<div className="home-floor-col-middle" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('top sales')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					{items}
				</div>
			</div>
			);
	}
});

var HomeFloor3 = React.createClass({
	render: function() {
		var hero = '';
		if (this.props.data !== null && this.props.data.hero) {
			hero = <img src={this.props.data.hero} />;
		}
		var items = [];
		if (this.props.data !== null && this.props.data.products) {
			items = this.props.data.products.map(function(p, i) {
				return (
					<div className="home-floor-col" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('women\'s clothes')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					<div className="home-floor-col-large">
						{hero}
					</div>
					{items}
				</div>
			</div>
			);
	}
});

var HomeFloor4 = React.createClass({
	render: function() {
		var hero = '';
		if (this.props.data !== null && this.props.data.hero) {
			hero = <img src={this.props.data.hero} />;
		}
		var items = [];
		if (this.props.data !== null && this.props.data.products) {
			items = this.props.data.products.map(function(p, i) {
				return (
					<div className="home-floor-col" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('men\'s clothes')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					{items}
					<div className="home-floor-col-large">
						{hero}
					</div>
				</div>
			</div>
			);
	}
});

var HomeFloor5 = React.createClass({
	render: function() {
		var hero = '';
		if (this.props.data !== null && this.props.data.hero) {
			hero = <img src={this.props.data.hero} />;
		}
		var items = [];
		if (this.props.data !== null && this.props.data.products) {
			items = this.props.data.products.map(function(p, i) {
				return (
					<div className="home-floor-col" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('underwear')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					<div className="home-floor-col-large">
						{hero}
					</div>
					{items}
				</div>
			</div>
			);
	}
});

var HomeFloor6 = React.createClass({
	render: function() {
		var hero = '';
		if (this.props.data !== null && this.props.data.hero) {
			hero = <img src={this.props.data.hero} />;
		}
		var items = [];
		if (this.props.data !== null && this.props.data.products) {
			items = this.props.data.products.map(function(p, i) {
				return (
					<div className="home-floor-col" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('shoes & hats')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					{items}
					<div className="home-floor-col-large">
						{hero}
					</div>
				</div>
			</div>
			);
	}
});
var HomeFloor7 = React.createClass({
	render: function() {
		var items = [];
		if (this.props.products !== null) {
			items = this.props.products.map(function(p, i) {
				return (
					<div className="home-floor-col" key={i}>
						<Link to={'/productdetail/' + p.id}>
							<img src={p.src} />
						</Link>
					</div>
					);
			});
		}

		return (
			<div className="home-floor">
				<div className="home-floor-header">
					<h4 className="home-floor-title">
						{__('leftover area')}
					</h4>

					<Link to="#" className="home-floor-more">
						{__('more')}
					</Link>
				</div>
				<div className="home-floor-body">
					{items}
				</div>
			</div>
			);
	}
});

var Home = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		HomeStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		HomeStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<HomeTopBar/>
				</div>
				<div className="col-xs-12 trim-col">
					<HomeCarousel carousel={this.state.carousel}/>
					<HomeLinks/>
				</div>
				<div className="col-xs-12">
					<HomeChannel/>
					<HomeFloor1 products={this.state.f1}/>
					<HomeFloor2 products={this.state.f2}/>
					<HomeFloor3 data={this.state.f3}/> 
					<HomeFloor4 data={this.state.f4}/> 
					<HomeFloor5 data={this.state.f5}/> 
					<HomeFloor6 data={this.state.f6}/> 
					<HomeFloor7 products={this.state.f7}/> 
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});
module.exports = Home;