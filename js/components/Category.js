require('../../less/category.less');
var React = require('react');
var Link = require('react-router').Link;
var CategoryActionCreators = require('../actions/CategoryActionCreators.js');
var CategoryStore = require('../stores/CategoryStore.js');

var icons = ['women', 'men', 'underwear', 'shoes', 'maternal'];

function getStateFromStores() {
	return {
		category: CategoryStore.getData().category,
		activeIndex: CategoryStore.getActiveIndex()
	};
}

var Header = require('../components/Header.js');

var CategoryX = React.createClass({
	propTypes: {
		activeIndex: React.PropTypes.number,
		x: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			activeIndex: 0,
			x: []
		};
	},

	_changeActive: function(i, e) {
		e.preventDefault();
		CategoryActionCreators.changeActive(i);
	},

	render: function() {

		var items = this.props.x.map(function(c, i) {
			return (
				<a href="#" 
					className={'category-x-item' + (i === this.props.activeIndex ? ' active' : '')}
					key={i} 
					onClick={this._changeActive.bind(this, i)}>
					<span className="category-x-icon">
						<span className={'icon-' + icons[i]}></span>
					</span>
					<span className="category-x-text">
						{c.name}
					</span>
				</a>
				);
		}, this);

		return (
			<div className="category-x">
				{items}
			</div>
			);
	}
});

var CategoryXX = React.createClass({
	propTypes: {
		xx: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			xx: []
		};
	},

	render: function() {

		var items = this.props.xx.map(function(c, i) {
			return (
				<div className="category-xx-item" key={i}>
					<Link to={'/searchgrid/' + encodeURIComponent(c.name)} className="category-xx-name">
						{c.name}
						<span className="category-xx-icon">
							<span className="icon-arrow-down"></span>
						</span>
					</Link>
					{
						this.props.xx[i].sub === undefined ? 
						null : <CategoryXXX xxx={this.props.xx[i].sub}/>
					}
				</div>
				);
		}, this);

		return (
			<div className="category-xx" ref="xx">
				{items}
			</div>
			);
	}
});

var CategoryXXX = React.createClass({
	propTypes: {
		xxx: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			xxx: []
		};
	},

	render: function() {

		var items = this.props.xxx.map(function(c, i) {
			return (
				<Link to={'/searchresult?category=' + c.categoryId} className="category-xxx-item" key={i}>
					{c.name}
				</Link>
				);
		});

		return (
			<div className="category-xxx">
				{items}
			</div>
			);
	}
});

var Category = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		// for footer's sake
		document.getElementById('footer').style.display = 'none';

		CategoryStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		// for footer's sake
		document.getElementById('footer').style.display = 'block';
		
		CategoryStore.removeChangeListener(this._onChange);
	},

	render: function() {

		// xx could be empty in initial time
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('goods categories')} />
				</div>
				<div className="col-xs-12">
					<div className="category">
						<div className="row">
							<div className="col-xs-4 trim-col">
								<CategoryX x={this.state.category} activeIndex={this.state.activeIndex}/>
							</div>
							<div className="col-xs-8 trim-col">
								{
									this.state.category[this.state.activeIndex] === undefined ?
									null : <CategoryXX xx={this.state.category[this.state.activeIndex].sub} />
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			);
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Category;