require('../../less/search-line.less');

var Link = require('react-router').Link;
var CKFM = require('../CKFM.js');
var React = require('react');
var StarScore = require('./StarScore.js');
var FuncUtil = require('../utils/FuncUtil.js');

var LineAppearance = React.createClass({
	propTypes: {
		searchResult: React.PropTypes.array
	},

	render: function() {
		var products = this.props.searchResult.map(function(product, index) {
			var _priceRange = parseInt(product.priceRange);
      _priceRange = FuncUtil.disCountryPrice(_priceRange);
			return (
				<div className="row search-line-product" key={index}>
					<div className="col-xs-4">
						<div className="search-line-product-img">
							<Link to={product.url} className="search-line-product-link">
								<img src={product.image}/>
							</Link>
						</div>
					</div>
					<div className="col-xs-8">
						<div className="search-line-product-info">
							<Link to={product.url} className="search-line-product-title">{product.title}</Link>
							<StarScore score={product.start}/>
							<h5 className="search-line-product-priceRange">{_priceRange} {CKFM.getCurrency()}</h5>
						</div>
					</div>
				</div>
				);
		});

		return (
			<div>
				{ products }
			</div>
			);
	}
});

module.exports = LineAppearance;
