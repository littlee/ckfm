require('../../less/cart.less');
var React = require('react');
var Link = require('react-router').Link;
var CartStore = require('../stores/CartStore.js');
var CartActionCreators = require('../actions/CartActionCreators.js');
var CartUtil = require('../utils/CartUtil.js');
var CkCheckbox = require('./CkCheckbox.js');
var History = require('react-router').History;
var Header = require('../components/Header.js');
var CKFM = require('../CKFM.js');

function getStateFromStores() {
	return {
		cart: CartStore.getData()
	};
}

var CartMain = React.createClass({

	propTypes: {
		product: React.PropTypes.array
	},

	getDefaultProps: function() {
		return {
			product: []
		};
	},

	render: function() {

		var ProductItems = this.props.product.map(function(productItem, productIndex) {
			return (
				<div className="col-xs-12" key={productIndex}>
					{productItem.active ? <Product productItem = {productItem} productIndex = {productIndex}/> : <DisabledProduct productItem = {productItem} productIndex = {productIndex}/>}	
				</div>
				);
		}, this);

		return (
			<form className="row cart-main">
				{ProductItems}
			</form>
			);
	}
});

var DisabledProduct = React.createClass({

	getInitialState: function() {
		return {
			handleIndex: -1,
			t: null
		};
	},

	componentWillUnmount: function() {
		clearTimeout(this.state.t);
	},

	propTypes: {
		productItem: React.PropTypes.object
	},

	getDefaultProps: function() {
		return {
			productItem: {}
		};
	},

	removeCombination: function(productIndex) {
		var conf = confirm(__('are you sure to delete?'));
		if (conf) {
			var itemId = [];
			for(var i=0;i<this.props.productItem.combination.length;i++){
				itemId.push(this.props.productItem.combination[i].itemId);
			}
			var removeData = {
				productIndex: productIndex,
				combinationIndex: -1,
				itemId:itemId
			};
			CartActionCreators.removeCombination(removeData);
			CartUtil.removeCombination();
		}
	},

	render: function() {
		var productItem = this.props.productItem;
		var combinationItem = productItem.combination[0];
		var productName = [];
		for (var key in combinationItem.specificationValue) {
			productName.push(
				<span className="cart-combinationname-item" key={key}>
					{key} : {combinationItem.specificationValue[key]}
				</span>
			);
		}

		return (
			<div className="cart-combination">
				<div className="cart-combination-item">	

					<div className="cart-checkbox">
						<CkCheckbox type="checkbox" disabled={true}/>
					</div>

					<div className="cart-imagebox">
						<img src={productItem.productImage}/>
					</div>

					<div className="cart-infobox">

						<div className="cart-info">
							<Link className="cart-productname" to={`/productdetail/${productItem.productId}`}>{productItem.productName}</Link>
							<div className="text-danger">{__("expired")}</div>
						</div>

						<div className="row cart-combinationcontrol">											
							<div className="col-xs-4 col-xs-offset-8">
								<div className="cart-combinationcontrol-icon">
									<span className="icon-delete-o" onClick = {this.removeCombination.bind(this, this.props.productIndex)}/>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
			);
	}
});

var Product = React.createClass({

	getInitialState: function() {
		return {
			handleIndex: -1,
			t: null
		};
	},

	componentWillUnmount: function() {
		clearTimeout(this.state.t);
	},

	propTypes: {
		productItem: React.PropTypes.object
	},

	getDefaultProps: function() {
		return {
			productItem: {}
		};
	},

	handleMinus: function(combinationIndex, amount, productIndex, e) {
		var newVal = amount * 1 - 1;
		var handleData = {
			combinationIndex: combinationIndex,
			newVal: newVal,
			productIndex: productIndex
		};
		this.handleState(handleData);
	},

	handlePlus: function(combinationIndex, amount, productIndex, e) {
		var newVal = amount * 1 + 1;
		var handleData = {
			combinationIndex: combinationIndex,
			newVal: newVal,
			productIndex: productIndex
		};
		this.handleState(handleData);
	},

	handleChange: function(combinationIndex, amount, productIndex, e) {
		var newVal = e.target.value;
		newVal.replace(/[^0-9]/g, '');
		newVal = newVal === '' ? 1 : parseInt(newVal);
		var handleData = {
			combinationIndex: combinationIndex,
			newVal: newVal,
			productIndex: productIndex
		};
		this.handleState(handleData);
	},

	removeCombination: function(combinationIndex, productIndex) {
		var conf = confirm(__('are you sure to delete?'));
		if (conf) {
			var itemId = [];
			itemId.push(this.props.productItem.combination[combinationIndex].itemId);
			var removeData = {
				combinationIndex: combinationIndex,
				productIndex: productIndex,
				itemId : itemId
			};
			CartUtil.removeCombination(removeData);
		}
	},

	handleFavorite: function(productIndex,bo) {
		if(!bo){
			CartUtil.handleFavorite(productIndex);
		}
	},

	handleState: function(handleData) {
		var that = this;
		var MAX = this.props.productItem.combination[handleData.combinationIndex].getamount;
		handleData.newVal = handleData.newVal <= MAX ? handleData.newVal : MAX;
		if (handleData.newVal) {
			this.setState({
				handleIndex: handleData.combinationIndex
			});
			CartActionCreators.changeCombAmount(handleData);

			if (this.state.t) {
				clearTimeout(this.state.t);
			}
			that.setState({
				t: setTimeout(function() {
					that.setState({
						handleIndex: -1,
						t: null
					});
				}, 2500)
			});
		}
	},

	hidePrice: function(combinationIndex, amount, productIndex) {
		this.setState({
			handleIndex: -1
		});
	},

	showPrice: function(combinationIndex, amount, productIndex) {
		this.setState({
			handleIndex: combinationIndex
		});
	},

	handleChecked: function(combinationIndex, productIndex) {

		var handleData = {
			combinationIndex: combinationIndex,
			productIndex: productIndex
		};
		CartActionCreators.handleChecked(handleData);
	},

	render: function() {
		var productItem = this.props.productItem;

		var CombinationItems = productItem.combination.map(function(combinationItem, combinationIndex) {

			var productName = [];
			for (var key in combinationItem.specificationValue) {
				productName.push(
					<span className="cart-combinationname-item" key={key}>
						{key} : {combinationItem.specificationValue[key]}
					</span>
				);
			}

			var combHandle = <div className="row cart-combinationcontrol">
					<div className="col-xs-8">
						<div className="input-group">
							<span className="input-group-btn">
								<button
			className="btn btn-sm btn-default btn-rect"
			type="button"
			onClick={this
				.handleMinus
				.bind(this, combinationIndex, combinationItem.amount, this.props.productIndex)}>
									<span className="icon-minus"></span>
								</button>
							</span>
							<input
			type="number"
			value={combinationItem.amount}
			className="form-control input-sm ipt-text"
			onChange={this
				.handleChange
				.bind(this, combinationIndex, combinationItem.amount, this.props.productIndex)}/>
							<span className="input-group-btn">
								<button className="btn btn-sm btn-default btn-rect" type="button"
			onClick={this
				.handlePlus
				.bind(this, combinationIndex, combinationItem.amount, this.props.productIndex)}>
									<span className="icon-plus"></span>
								</button>
							</span>
						</div>
					</div>								
					<div className="col-xs-4">
						<div className="pull-right cart-combinationcontrol-icon">

							<span className="icon-delete-o"
			onClick = {this
				.removeCombination
				.bind(this, combinationIndex, this.props.productIndex)}/>

									<span className = { productItem.collected ? "icon-favorite-o cart-combinationcontrol-icon-active" : "icon-star" }
			onClick = { this.handleFavorite.bind(this, this.props.productIndex, productItem.collected)} />
						</div>
					</div>
				</div>;
			var Info = null;
			if (this.state.handleIndex === combinationIndex) {
				Info = <PriceTable range={productItem.range} price={productItem.price}  className="cart-info"/>;

			} else {
				Info = <div className="cart-info">
						<Link className="cart-productname" to={`/productdetail/${productItem.productId}`}>{productItem.productName}</Link>
						<div className="cart-combinationname">{productName}</div>
						<div className="cart-nowprice">{__('price')}：{CKFM.getDisplayPrice(productItem.nowPrice.toString())} / {productItem.unit}</div>
					</div>;
			}

			return (
				<div className="col-xs-12" key={combinationIndex}>
					<div className="cart-combination-item">	
							<div className="cart-checkbox">
								<CkCheckbox type="checkbox"
				checked={combinationItem.checked}
				name = {combinationItem.combinationId + ''}
				onChange = {this.handleChecked.bind(this, combinationIndex, this.props.productIndex)}/>
							</div>
							<div className="cart-imagebox">
								<img src={productItem.productImage}/>
							</div>

						<div className="cart-infobox">
							{Info}
							{combHandle}
						</div>
					</div>
				</div>
				);
		}, this);

		return (
			<div className="row cart-combination">
				{CombinationItems}
			</div>
			);
	}
});

var PriceTable = React.createClass({
	render: function() {
		var rangArr = this.props.range;
		var L = rangArr.length;

		var rangeItems = rangArr.map(function(item, index) {
			if (index !== L - 1) {
				return (
					<tr key={index}>
						<td>
							{item}~{rangArr[index + 1] - 1}
						</td>
						<td className="cart-pricetable-price">
							{CKFM.getDisplayPrice(this.props.price[index])}
						</td>
					</tr>
					);
			} else {
				return (
					<tr key={index}>
						<td>
							≥{item}
						</td>
						<td className="cart-pricetable-price">
							{CKFM.getDisplayPrice(this.props.price[index])}
						</td>
					</tr>
					);
			}
		}, this);

		return (
			<div className="cart-pricetable">
				<table className="table">
					<thead>
						<tr>
							<td>{__('amount')}</td>
							<td>{__('price')}</td>
						</tr>
					</thead>
					<tbody>
						{rangeItems}
					</tbody>
				</table>
			</div>
			);
	}
});

var CartFooter = React.createClass({

	mixins: [History],

	handleCheckedAll: function() {
		CartActionCreators.handleCheckedAll();
	},

	buyNow: function(e) {
		var cart = this.props.cart;
		var less = false;
		var proName = '';
		if (cart.total > 0) {
			var buyNowData = {};
			buyNowData.cartItemIds = [];
			for (var i = 0; i < cart.product.length; i++) {
				if (cart.product[i].productPieces > 0) {
					if (cart.product[i].productPieces >= cart.product[i].range[0]) {
						for (var j = 0; j < cart.product[i].combination.length; j++) {
							if (cart.product[i].combination[j].checked) {
								buyNowData.cartItemIds.push(cart.product[i].combination[j].itemId);
							}
						}
					} else {
						less = true;
						proName = cart.product[i].productName;
						i = cart.product.length;
						break;
					}
				}
			}
			if (less) {
				alert(proName + __('less than minimum order quantity'));
			} else {
				sessionStorage.setItem('buyNowData', JSON.stringify(buyNowData));
				this.history.pushState(null, '/ordersettlement');
			}
		} else {
			alert(__('the amount should be larger than 0'));
		}
	},

	render: function() {
		var total = null;
		if (this.props.cart.total)
			total = CKFM.getDisplayPrice(this.props.cart.total.toString());
		else
			total = 0;
		return (
			<div className="cart-footer">
				<label className="cart-footer-selectall">
					<CkCheckbox type="checkbox" checked={this.props.cart.checkedAll} onChange = {this.handleCheckedAll}/>
					<span className="cart-footer-selectall-font">{__('select all')}</span>
				</label>
				<span className="cart-footer-totalpieces">{this.props.cart.totalPieces}{__('items')}</span>
				<span>{__('total')} : </span>
				<span className="cart-footer-total">{total +' '+ CKFM.getCurrency()}</span>				
				<button type="button" className="btn btn-primary btn-rect pull-right cart-footer-submit" onClick={this.buyNow}>
					{__('settlement')}
				</button>

			</div>
			);
	}
});

var Cart = React.createClass({
	getInitialState: function() {
		if (sessionStorage.getItem('amountData')) {
			CartUtil.getAmount();
			CartUtil.getData();
		}
		return getStateFromStores();
	},

	componentDidMount: function() {
		CartStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		CartStore.removeChangeListener(this._onChange);
		CartUtil.getAmount();
	},

	render: function() {
		return (
			<div className="row cart">
				<div className="col-xs-12">
					<Header title={__('cart')}/>
				</div>
				{
					this.state.cart.product?
					<div className="col-xs-12">
						<CartMain product = {this.state.cart.product}/>
					</div>
					:<div className="cart-main"><h2 className="text-center">{__("the cart is empty")}</h2></div>
				}
				{
					this.state.cart.product?
					<div className="col-xs-12">
						<CartFooter cart = {this.state.cart}/>
					</div>
					:null
				}
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Cart;


