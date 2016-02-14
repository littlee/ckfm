require('../../less/search-grid.less');

var Link = require('react-router').Link;
var CKFM = require('../CKFM.js');
var React = require('react');
var FuncUtil = require('../utils/FuncUtil.js');
var StarScore = require('./StarScore.js');

var GridAppearance = React.createClass({
	propTypes: {
		searchResult: React.PropTypes.array
	},

	render: function() {
		var products = this.props.searchResult.map(function(product, index) {
			var _priceRange = parseInt(product.priceRange);
			_priceRange = FuncUtil.disCountryPrice(_priceRange);
			return (
				<div className="col-xs-6 search-grid-product" key={index}>
					<div className="search-grid-product-img">
						<Link to={product.url} className="search-grid-product-link">
							<img src={product.image}/>
						</Link>
					</div>
					<div className="search-grid-product-info">
						<h5 className="search-grid-product-title">{product.title}</h5>
						<StarScore score={product.start}/>
						<h5 className="search-grid-product-priceRange">{_priceRange} {CKFM.getCurrency()}</h5>
					</div>
				</div>);
		});

		return (
			<div>
				{ products }
			</div>
			);
	}
});

module.exports = GridAppearance;
