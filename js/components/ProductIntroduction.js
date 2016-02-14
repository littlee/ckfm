var React = require('react');
var ProductDetailStore = require('../stores/ProductDetailStore.js');
var ProductDetailUtil = require('../utils/ProductDetailUtil.js');

function getIntroductionFromStores() {
	return {
		show: false,
		load:false
	};
}

var ProductIntroduction = React.createClass({
	getInitialState: function() {
		return getIntroductionFromStores(this);
	},

	componentDidMount: function() {
		var productId = this.props.params.productId;
		window.onload = function() {
			this.setState({
				load:true
			});
			ProductDetailUtil.getIntroduction(productId);
		}.bind(this);
		if(!this.state.load){
			ProductDetailUtil.getIntroduction(productId);
		}
		ProductDetailStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ProductDetailStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		if(nextProps.params.productId !== this.props.params.productId){
			var productId = nextProps.params.productId;
			ProductDetailUtil.getIntroduction(productId);
		}
	},

	getIntroduction: function() {
		return {
			__html: ProductDetailStore.getIntroduction()
		};
	},

	render: function() {
		return (
			<div className="product-introduction" dangerouslySetInnerHTML={this.getIntroduction()} onClick={this._onChange}/>
			);
	},

	_onChange: function() {
		this.setState(getIntroductionFromStores(this));
	}
});

module.exports = ProductIntroduction;