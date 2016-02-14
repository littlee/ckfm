require('../../less/collected-folder.less');

var React = require('react');
var Link = require('react-router').Link;
var CKFM = require('../CKFM.js');

var Header = require('./Header.js');
var StarScore = require('./StarScore.js');
var CollectedFolderStore = require('../stores/CollectedFolderStore.js');
var CollectedFolderUtil = require('../utils/CollectedFolderUtil.js');
var FuncUtil = require('../utils/FuncUtil.js');

function getCollectedFolderFromStore() {
	return CollectedFolderStore.getCollectedFolder();
}

var CollectedFolder = React.createClass({
	getInitialState: function() {
		return getCollectedFolderFromStore();
	},
	componentDidMount: function() {
		CollectedFolderStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		CollectedFolderStore.removeChangeListener(this._onChange);
	},

	handleDeleteClick: function(e) {
		var productId = e.target.getAttribute('data-productid');
		productId = parseInt(productId);
		CollectedFolderUtil.deleteProInCollection(productId);
	},

	render: function() {
		var collectedFolder = this.state.collectedFolder;
		var title = __('collected folder');
		var handleDeleteClick = this.handleDeleteClick;
		var products = collectedFolder.map(function(product, index) {
			var proD = '/productdetail/' + product.productId;
			var price = FuncUtil.disCountryPrice(product.price);
			return (
				<div className="col-xs-12 trim-col collected-folder-product" key={index} data-productid={product.productId}>
					<div className="col-xs-5">
						<div className="collected-folder-product-img">
							<Link to={proD} className="collected-folder-product-link">
								<img src={product.imageUrl}/>
							</Link>
						</div>
					</div>
					<div className="col-xs-7">
						<div className="collected-folder-product-info">
							<Link to={proD} className="collected-folder-product-title">{product.title}</Link>
							<div className="collected-folder-product-star">
								<StarScore />
							</div>
							<h5 className="collected-folder-product-price">
								{__('price')} : <strong>{CKFM.getCurrency()} {price}</strong> / {__('piece')}
							</h5>
						</div>
						<div className="collected-folder-product-opt">
							<span className="icon-delete-o collected-folder-product-delete" data-productid={product.productId} onClick={handleDeleteClick}></span>
						</div>
					</div>
				</div>
				);
		});
		return (
			<div className="row">
				<Header title={title}/>
				<div className="collected-folder-module">
					{products}
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getCollectedFolderFromStore());
	}
});

module.exports = CollectedFolder;
