require('../../less/product-detail.less');
require('slick-carousel/slick/slick.less');

var React = require('react');
var Slick = require('react-slick');
var Link = require('react-router').Link;
var IndexLink = require('react-router').IndexLink;
var History = require('react-router').History;
var CKFM = require('../CKFM.js');

var ProductDetailStore = require('../stores/ProductDetailStore.js');
var StarScore = require('./StarScore.js');
var Header = require('./Header.js');
var Util = require('../utils/ProductDetailUtil.js');
var ActionCreators = require('../actions/ProductDetailActionCreators.js');

var ShareModal = require('../components/ShareModal.js');

function getStateFromStores() {
	return {
		data: ProductDetailStore.getData(),
		recommend: ProductDetailStore.getRecommend(),
		combAmount: ProductDetailStore.getCombAmount(),
		cart: ProductDetailStore.getCart(),
		collected: ProductDetailStore.getCollected()
	};
}

var ProductDetailCarousel = React.createClass({
	render: function() {
		var slickSettings = {
			className: 'pro-detail-slick-slider',
			arrows: false,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			dotsClass: 'dots',
			autoplay: true,
			autoplaySpeed: 3000
		};
		var carouselItems = this.props.carousel.map(function(item, index) {
			return (
				<div key={index}>
					<img src={item}/>
				</div>
				);
		});

		return (
			<Slick {...slickSettings}>
				{carouselItems}
			</Slick>
			);
	}
});

var Price = React.createClass({
	render: function() {
		var priceArr = [];
		priceArr = this.props.price;

		var L = priceArr.length;
		if (L > 0) {
			var priceFirst = priceArr[0];
			if (L === 1) {
				return ( <span className="pro-detail-price">{CKFM.getDisplayPrice(priceFirst) +' '+ CKFM.getCurrency()}</span>	);
			} else {
				var priceLast = priceArr[L - 1];
				return <span className="pro-detail-price">{CKFM.getDisplayPrice(priceFirst) +' '+ CKFM.getCurrency()} - {CKFM.getDisplayPrice(priceLast) +' '+ CKFM.getCurrency()} </span>;
			}
		}
		else
			return <div></div>;
	}
});

var Mark = React.createClass({
	mixins: [History],

	getInitialState: function() {
		return {
			collected: false,
			modalIsOpen: false
		};
	},

	handleFavorite: function() {
		if (!CKFM.isSignedIn()) {
			alert(__('you haven\'t signed in'));
			return false;
		}

		Util.handleFavorite(this.props.data.productId, function(res) {
			if (res === 'success') {
				this.setState({
					collected: true
				});
			}
		}.bind(this));
	},

	render: function() {
		var favorite = null;
		if (this.props.data.collected || this.state.collected) {
			favorite = <button className="btn btn-sm btn-rect btn-primary"><span className="icon-star-solid"></span></button>;
		} else {
			favorite = <button className="btn btn-sm btn-rect btn-default" onClick={this.handleFavorite}><span className="icon-star"></span></button>;
		}

		/* code contributed by Littlee start */
		return (
			<div className="pro-detail-link">
				{favorite}
				<button className="btn btn-sm btn-rect btn-default" type="button" onClick={this._openModal}>
					<span className="icon-share"/>
				</button>
				<ShareModal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this._closeModal}/>
			</div>
			);
	},

	_openModal: function() {
		this.setState({
			modalIsOpen: true
		});
	},

	_closeModal: function() {
		this.setState({
			modalIsOpen: false
		});
	}
	/* code contributed by Littlee end */
});




var PriceTable = React.createClass({
	render: function() {
		var rangArr = this.props.range;
		var L = rangArr.length;
		var point = [];

		var priceItems = this.props.price.map(function(item, index) {
			return (
				<td key={index} className="pro-detail-price">
					{CKFM.getDisplayPrice(item)}
				</td>
				);
		});

		var rangeItems = rangArr.map(function(item, index) {
			if (index !== L - 1) {
				return (
					<td key={index}>
						{item}~{rangArr[index + 1] - 1}
					</td>
					);
			} else {
				return (
					<td key={index}>
						≥{item}
					</td>
					);
			}
		});

		for (var i = 0; i < L; i++) {
			point.push(<td key={i} className="pro-detail-table-td"><div className="pro-detail-table-point"></div></td>);
		}

		return (
			<div>
				<div className="pro-detail-table-head">{__('price')}：</div>
				<table className="table table-bordered pro-detail-table">
					<tbody>
						<tr>
							<td className="pro-detail-table-title">{__('amount')}</td>
							{rangeItems}
						</tr>
						<tr>
							<td className="pro-detail-table-title">{__('price')}</td>
							{priceItems}
						</tr>
					</tbody>
				</table>
			</div>
			);
	}
});

var CombForm = React.createClass({
	getInitialState: function() {
		return {
			chooseIndex: 0,
			chooseChild: 0,
			iptVal: 0,
			total: 0
		};
	},

	componentWillReceiveProps: function(nextProps) {
		if(nextProps.valArr.length === 0){
			this.setState({
				iptVal: 0
			});			
		}
	},

	onChoose: function(i, checked) {
		if (!checked) {
			var hasVal = 0;
			this.props.valArr.map(function(elem) {
				if (elem.combId == this.props.data.combination[i].child[this.state.chooseChild].combinationId) {
					hasVal = elem.getamount;
					return;
				}
			}, this);
			this.setState({
				chooseIndex: i,
				iptVal: hasVal
			});
		}
	},

	onChooseChild: function(i, checked, e) {
		if (!checked) {
			var hasVal = 0;
			this.props.valArr.map(function(elem) {
				if (elem.combId == e.target.getAttribute('data-id')) {
					hasVal = elem.getamount;
					return;
				}
			});
			this.setState({
				chooseChild: i,
				iptVal: hasVal
			});
		}
	},

	handlePlus: function(e) {
		var newVal = this.state.iptVal * 1 + 1;
		this.setValArr(newVal, e);
	},

	handleMinus: function(e) {
		var newVal = this.state.iptVal * 1 - 1;
		this.setValArr(newVal, e);
	},

	handleChange: function(e) {
		var newVal = e.target.value;
		newVal.replace(/[^0-9]/g, '');
		newVal = newVal === '' ? 0 : newVal;
		this.setValArr(newVal, e);
	},

	setValArr: function(newVal) {
		if (newVal >= 0) {
			var combId = document.getElementById('comb-choose').getAttribute('data-id');
			this.setState(
				{
					iptVal: parseInt(newVal)
				}
			);
			ActionCreators.changeCombAmount(newVal, combId);
		}
	},

	preventSubmit: function(e) {
		e.preventDefault();
	},

	render: function() {
		var data = this.props.data;
		var combinationArr = data.combination;
		var iptVal = this.state.iptVal;
		var purchasedItem = this.props.valArr.map(function(elem, index) {
			if (elem.getamount > 0 && elem.getamount) {
				var imgElem = null;
				if (elem.image) {
					imgElem = <img src={elem.image}/>;
				} else {
					imgElem = elem.imageName;
				}
				return (
					<li key={index}>
						<div className="purchased-box">
							<div className="row">
								<div className="col-xs-4">
									<div className="purchased-img">{imgElem}</div>
								</div>
								<span className="col-xs-8 purchased-font">{elem.name}</span>
							</div>
						</div>
						<span className="purchased-val">{elem.getamount}</span>
					</li>
					);
			}
		});

		var combParent = combinationArr.map(function(item, index) {
			var imgElem = null;
			if (item.image) {
				imgElem = <div className={index === this.state.chooseIndex ? "comb-box comb-choose" : "comb-box"}><img className="comb-img" src={item.image}/></div>;
			} else {
				imgElem = <span className={index === this.state.chooseIndex ? "comb-img-font comb-choose" : "comb-img-font"}>{item.name}</span>;
			}
			if (index === this.state.chooseIndex) {
				return (
					<li className="comb-li" key={index} onClick={this.onChoose.bind(this, index, true)}>
						{imgElem}
					</li>
					);
			} else {
				return (
					<li className="comb-li" key={index} onClick={this.onChoose.bind(this, index, false)}>
						{imgElem}
					</li>
					);
			}
		}, this);

		var combChild = combinationArr[this.state.chooseIndex].child.map(function(item, index) {
			if (index === this.state.chooseChild) {
				return (
					<li key={index} onClick={this.onChooseChild.bind(this, index, true)}>
						<div className="comb-font comb-choose" id="comb-choose" data-id={item.combinationId}>{item.name}</div>
					</li>
					);
			} else {
				return (
					<li key={index} onClick={this.onChooseChild.bind(this, index, false)}>
						<div className="comb-font" data-id={item.combinationId}>{item.name}</div>
					</li>
					);
			}
		}, this);

		return (
			<form className="form-horizontal comb-form" onSubmit={this.preventSubmit}>
				<div className="form-group">
					<div className="col-xs-3 comb-title comb-title-color">{data.combinationString[0]}</div>
					<div className="col-xs-9">
						<ul className="list-inline">
							{combParent}
						</ul>
					</div>
				</div>

				<div className="form-group">
					<div className="col-xs-3 text-center">{data.combinationString[1]}</div>
					<div className="col-xs-9">
						<ul className="list-inline">
							{combChild}
						</ul>
					</div>
				</div>

				<div className="form-group">
					<div className="col-xs-3 comb-title">{__('amount')}</div>
					<div className="col-xs-6">
						<div className="input-group">
							<span className="input-group-btn" onClick={this.handleMinus}>
								<button className="btn btn-default btn-rect" type="button">
									<span className="icon-minus"></span>
								</button>
							</span>
							<input id="ipt-val" type="number" value={iptVal} className="form-control ipt-text" onChange={this.handleChange}/>
							<span className="input-group-btn" onClick={this.handlePlus}>
								<button className="btn btn-default btn-rect" type="button">
									<span className="icon-plus"></span>
								</button>
							</span>
						</div>
					</div>
				</div>

				<div className="purchased">
					<div className="form-group">
						<div className="col-xs-3 comb-title">{__('purchased')}</div>
						<div className="col-xs-9">
							<ul className="purchased-ul">{purchasedItem}</ul>
						</div>
					</div>
				</div>

				<div className="form-group">
					<div className="col-xs-3 comb-title">{__('total')}</div>
					<div className="col-xs-9 comb-total">
					{CKFM.getDisplayPrice(this.props.total.toString()) + ' ' + CKFM.getCurrency()}
					</div>
				</div>
			</form>
			);
	}
});

var Tab = React.createClass({
	render: function() {
		return (
			<div className="pro-detail-tab">
				<IndexLink  className="pro-detail-tab-item" activeClassName="active" to={`/productdetail/${this.props.data.productId}`}>
					{__('product introduction')}
				</IndexLink>
				<Link  className="pro-detail-tab-item" activeClassName="active" to={`/productdetail/${this.props.data.productId}/comment`}>
					{__('comment')}
				</Link>
			</div>
			);
	}
});

var Recommend = React.createClass({

	render: function() {
		var slickSettings = {
			className: "recommend-slick-slider",
			arrows: false,
			infinite: true,
			touchMove: true,
			speed: 500,
			slidesToShow: 3,
			swipe: true,
			slidesToScroll: 3,
			swipeToSlide: true,
			autoplay: true,
			autoplaySpeed: 8000
		};

		var carouselItems = this.props.recommend.map(function(item, index) {

			return (
				<div key={index} className="recommend-item">
					<Link to={`/productdetail/${item.productId}`} className="recommend-img-box">
						<img src={item.imageUrl}/>
					</Link>
					<div className="recommend-title">
						<span className="recommend-font">{item.title}</span>
					</div>
					<span className="recommend-price">
						{CKFM.getDisplayPrice(item.price) +' '+ CKFM.getCurrency()}
					</span>
				</div>
				);
		});

		return (
			<div className="recommend">
				<span className="pro-detail-recommend-icon"> &nbsp; </span>
				<span>{__('recommend')}</span>
				<Slick {...slickSettings}>
					{carouselItems}
				</Slick>
			</div>
			);
	}
});

var Btn = React.createClass({
	mixins: [History],

	addToCart: function() {

		if (!CKFM.isSignedIn()) {
			alert(__('you haven\'t signed in'));
			return false;
		}

		if (this.props.total <= 0) {
			alert(__('the amount should be larger than 0'));
			return false;
		}

		var data = {
			valArr: this.props.combAmount.valArr,
			total: this.props.combAmount.total
		};
		Util.addToCart(data);
	},

	buyNow: function() {

		if (this.props.combAmount.total <= 0) {
			alert(__('the amount should be larger than 0'));
			return false;	
		}

		if(this.props.combAmount.totalPieces < this.props.data.range[0]){
			alert(__('less than minimum order quantity'));			
			return false;
		}

		var buyNowData = {};
		buyNowData.fromProductDetail = {};
		buyNowData.fromProductDetail.combination = [];
		buyNowData.fromProductDetail.productId = this.props.data.productId;
		this.props.combAmount.valArr.map(function(item, index) {
			if (item.getamount > 0) {
				var buyNowArr = {};
				buyNowArr['combinationId'] = item.combId;
				buyNowArr['getamount'] = item.getamount;
				buyNowData.fromProductDetail.combination.push(buyNowArr);
			}
		});

		sessionStorage.setItem('buyNowData', JSON.stringify(buyNowData));
		this.history.pushState(null, '/ordersettlement');
	},

	render: function() {
		return (
			<div className="pro-detail-btn">
				<button className="btn pro-detail-btn-item btn-primary" onClick={this.addToCart}>
					{__('add to cart')}
				</button>
				<div className="btn pro-detail-btn-item btn-secondary" onClick={this.buyNow}>
					{__('buynow')}
				</div>
				<Link className="btn btn-sm btn-rect pro-detail-btn-cart" to={`/cart`}>
					<span className="icon-cart"></span>
					<span className="pro-detail-btn-num">{this.props.cart.cartItemsAmount}</span>
				</Link>

			</div>
			);
	}
});

var ProductDetail = React.createClass({

	getInitialState: function() {

		var productId = this.props.params.productId;
		Util.getData(productId);
		Util.getRecommend(productId);
		Util.getCart();
		return getStateFromStores();
	},

	componentDidMount: function() {
		ProductDetailStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ProductDetailStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		// should have used nextProps
		if(nextProps.params.productId !== this.props.params.productId){
			var productId = nextProps.params.productId;
			Util.getData(productId);
			Util.getRecommend(productId);
			Util.getCart();
		}
	},

	render: function() {
		return (
			<div className="row pro-detail">

				<div className="col-xs-12">
					<Header title={__('product detail')}/>
				</div>

				<div className="col-xs-12 pro-detail-carousel">
					<ProductDetailCarousel carousel= {this.state.data.carousel}/>
				</div>

				<div className="col-xs-12">
					<Price price={this.state.data.price}/>
					<Mark data={this.state.data}/>
				</div>

				<div className="col-xs-12">
					<h1 className="pro-detail-title">{this.state.data.tit}</h1>
				</div>

				<div className="col-xs-12">
					<StarScore score={this.state.data.star}/>
					<span className="pro-detail-tolcomment">({this.state.data.comment})</span>
				</div>

				<div className="col-xs-12 pro-detail-table-box">
					<PriceTable price={this.state.data.price} range={this.state.data.range}/>
				</div>

				<div className="col-xs-12">
					<CombForm data={this.state.data} valArr = {this.state.combAmount.valArr} total = {this.state.combAmount.total}/>
				</div>

				<div className="col-xs-12">
					<Tab children={this.props.children} data={this.state.data}/>
				</div>

				<div className="col-xs-12">
					<div className="pro-detail-child">
						{this.props.children}
					</div>
				</div>

				<div className="col-xs-12">
					<Recommend recommend={this.state.recommend}/>
				</div>

				<div className="col-xs-12">
					<Btn combAmount = {this.state.combAmount} cart={this.state.cart} data={this.state.data}/>
				</div>

			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}

});

module.exports = ProductDetail;
