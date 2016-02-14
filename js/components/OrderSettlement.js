var React = require('react');
var Header = require('./Header.js');
var Link = require('react-router').Link;
require('../../less/order-settlement.less');
var OrderSettlementStore = require('../stores/OrderSettlementStore.js');
var OrderSettlementUtil = require('../utils/OrderSettlementUtil.js');
var FormUtil = require('../utils/FormUtil.js');
var OrderSettlementActionCreator = require('../actions/OrderSettlementActionCreators.js');
var Modal = require('react-modal');
var CkRadio = require('./CkRadio.js');
var History = require('react-router').History;
var Big = require('big.js');
var CKFM = require('../CKFM.js');
const customStyles = {
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
	content: {
		top: '50%',
		left: '50%',
		right: '20%',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};

function getStateFromStores() {
	return {
		selectedIdC: OrderSettlementStore.getSelectedId(),
		orderAddressJsonC: OrderSettlementStore.getOrderAddressJson(),
		orderProductsJsonC: OrderSettlementStore.getOrderProductsJson(),
		orderCouponsJsonC: OrderSettlementStore.getCouponsJson(),
		orderEndPriceC: OrderSettlementStore.getEndPrice(),
		orderCouponsNumC: OrderSettlementStore.getCouponsNum(),
		modalIsOpen: false,
		modalSelect: false,
		err: ''
	};
}
var ErrMsgMap = {
	'addrRequired': __('the address is required and can not be empty')
};

var ErrMsg = React.createClass({
	render: function() {
		return (
			<div className="alert alert-danger order-settlement-form-alert">{this.props.msg}</div>
			);
	}
});

var EmptyAddress = React.createClass({
	render: function() {
		return (
			<div className="order-settlement-address-desc">
				<div className="order-settlement-address-info">
					{__('no address,go to add a new address')}
				</div>
			</div>
			);
	}
});

var AddressSelected = React.createClass({
	render: function() {
		var addressDetail = null;
		addressDetail = this.props.addressList.map(function(item, index) {
			return (
				<div key={index}>
						<input type="hidden" name="addr" value={item.deliveraddrId}/>
						<div className="order-settlement-address-info">
							<span className="order-settlement-address-info-title">
								{__('recipient')}
							</span>
							<span className="order-settlement-address-info-detail">
								{item.name}
							</span>
						</div>
						<div className="order-settlement-address-info">
							<span className="order-settlement-address-info-title">
								{__('address')}
							</span>
							<span className="order-settlement-address-info-detail">
								{/*make some white-space for address*/}
								{item.country} {item.state} {item.city} {item.region} {item.addrDetail}
							</span>
						</div>
					</div>
				);
		});
		return (
			<div className="order-settlement-address-desc">
					{addressDetail}
				</div>
			);
	}
});
var OrderSettlementAddress = React.createClass({
	setSessionSelectedId: function() {
		this.props.onSessionId();
	},
	render: function() {
		var addressListLength = 0;
		if (this.props.address !== null) {
			addressListLength = this.props.address.length;
		}
		return (
			<div className="order-settlement-address">
				<Link to="addressmanagement" query={{checkbox:true}} className="order-settlement-address-link" onClick={this.setSessionSelectedId}>
					{addressListLength === 0 ? <EmptyAddress/> : <AddressSelected addressList={this.props.address}/>}
					<div className="order-settlement-address-icon">
						<span className="icon-forward-arrow">
						</span>
					</div>
				</Link>
			</div>
			);
	}
});

var OrderSettlementProducts = React.createClass({
	render: function() {
		var storeItems = [];
		var ordersForm = [];
		if (this.props.products !== null) {
			var proIndex = -1;
			storeItems = this.props.products.map(function(storeItem, index) {
				var ordersFormObject = {
					"orderItem": []
				};
				var productItems = [];
				productItems = storeItem.selectProduct.map(function(productItem, index) {
					proIndex++;
					var comIndex = -1;
					var combinationItems = [];
					var orderitemsObject = {
						"combination":[],
						"productId":productItem.productId
					};
					combinationItems = productItem.combination.map(function(combination, index) {
						comIndex++;
						var specificationHtml = '';
						var specification = combination.specificationValue;
						for (var key in specification) {
							if (specification.hasOwnProperty(key)) {
								specificationHtml += '<span class="order-settlement-products-item-space">' + key + ': ' + specification[key] + '</span>';
							}
						}
						specificationHtml += '<span class="order-settlement-products-item-space">X' + combination.getamount + '</span>';
						var a = {
							__html: specificationHtml
						};
						var comObject = {
							"cartItemId": combination.cartItemId,
							"combinationId": combination.combinationId,
							"getamount": combination.getamount
						};
						orderitemsObject.combination.push(comObject);
						return (
							<span className="order-settlement-products-item-csm" key={index}>
								{/*<input type="hidden" name={'ordersForm[orderItem][' + proIndex + '][combination][' + comIndex + '][cartItemId]'} value={combination.cartItemId}/>
								<input type="hidden" name={'ordersForm[orderItem][' + proIndex + '][combination][' + comIndex + '][combinationId]'} value={combination.combinationId}/>
								<input type="hidden" name={'ordersForm[orderItem][' + proIndex + '][combination][' + comIndex + '][getamount]'} value={combination.getamount}/>*/}
								<span dangerouslySetInnerHTML={a}>
								</span>
							</span>
						);
					});
					ordersFormObject.orderItem.push(orderitemsObject);

					return (
						<div className="order-settlement-products-item" key={index}>
								{/*<input type="hidden" name={'ordersForm[orderItem][' + proIndex + '][productId]'} value={productItem.productId}/>*/}
								<div className="order-settlement-products-item-left">
									<Link to={`/productdetail/${productItem.productId}`}><img src={productItem.productImage} width="100" height="150"/></Link>
								</div>
								<div className="order-settlement-products-item-right">
									<Link to={`/productdetail/${productItem.productId}`}>{productItem.title}</Link>
								</div>
								<div className="order-settlement-products-item-line"></div> 
								<div className="order-settlement-products-item-para">
									{combinationItems}
								</div>
							</div>
						);
				});
				ordersForm.push(ordersFormObject);
				return (
					<div key={index} className="order-settlement-products-sub">
						<div className="order-settlement-products-head">
							<img src="./images/cookabuy_store.jpg" className="order-settlement-products-head-img" width="100" height="25"/>
						</div>
						<div className="order-settlement-products-body">
							{productItems}
						</div>
					</div>
					);
			});
		}
		//ordersForm = JSON.stringify(ordersForm);
		return (
			<div className="order-settlement-products">
				<input type="hidden" name="ordersForm" value={JSON.stringify(ordersForm)}/>
				{storeItems}
			</div>
			);
	}
});

var OrderSettlementCoupons = React.createClass({
	render: function() {
		var self = this;
		if (this.props.couponsNum === null) {
			return (
				<div className="order-settlement-coupons">
				<input type="hidden" name="couponSerialNum" value=''/>
				<Link to="ordercoupons" className="order-settlement-coupons-link">
					{__('use coupons')}
					<span className="order-settlement-coupons-link-use">
						{__('choose a coupons')}
					</span>
					<span className="order-settlement-coupons-icon">
						<span className="icon-forward-arrow">
						</span>
					</span>
				</Link>
			</div>
				);
		} else {
			return (
				<div className="order-settlement-coupons">
				<input type="hidden" name="couponSerialNum" value={self.props.couponsNum.couponSerialNum}/>
				<Link to="ordercoupons" className="order-settlement-coupons-link">
					{__('use coupons')}
					<span className="order-settlement-coupons-link-use">
						{__("discount")}{self.props.couponsNum.subPrice}
					</span>
					<span className="order-settlement-coupons-icon">
						<span className="icon-forward-arrow">
						</span>
					</span>
				</Link>
			</div>
				);
		}
	}
});

var Fa = React.createClass({
	render: function() {
		return (
			<span>&nbsp;&nbsp;{__('ship goods out of stock in order')}</span>
			);
	}
});

var Bufa = React.createClass({
	render: function() {
		return (
			<span>&nbsp;&nbsp;{__('do not ship goods out of stock in order')}</span>
			);
	}
});

var OrderSettlementReminder = React.createClass({
	render: function() {
		var modalSelect = this.props.modalSelect;
		return (
			<div className="order-settlement-reminder">
				<h4 className="order-settlement-reminder-title">
					{__('single need to know')}
				</h4>
				<div className="order-settlement-line"></div>
				<div className="order-settlement-reminder-content">
					<div className="order-settlement-reminder-link" onClick={this.props.onDeliverModal}>
						&nbsp;
						<span className="order-settlement-checked">
							<span className="icon-checked-o">
							</span>
						</span>
						<input type="hidden" name="allowSegmentalDelivery" value={modalSelect}/>
						{modalSelect ? <Fa/> : <Bufa/>}
						<span className="order-settlement-coupons-icon">
							<span className="icon-forward-arrow">
							</span>
						</span>
					</div>
				</div>
			</div>
			);
	}
});

var OrderSettlementPrice = React.createClass({
	render: function() {
		var totalPrice = this.props.totalPrice;
		var coupons = this.props.coupons;

		return (
			<div className="order-settlement-price">
				<div className="order-settlement-price-item">
					<span className="order-settlement-price-item-name">
						{__('commodity price')}
					</span>
					&nbsp;
					<span className="order-settlement-price-item-num">
						{totalPrice}
					</span>
				</div>
				<div className="order-settlement-price-item">
					<span className="order-settlement-price-item-name">
						{__('coupons')}
					</span>
					&nbsp;
					<span className="order-settlement-price-item-num">
						-{coupons}
					</span>
				</div>
			</div>
			);
	}
});

var OrderSettlementTotal = React.createClass({
	render: function() {
		return (
			<div className="order-settlement-total">
				<div className="order-settlement-total-price">
					<span className="order-settlement-total-price-num">
						{this.props.endPrice}
					</span>
					<br/>
					<span className="order-settlement-total-price-tip">
						{__('total price')}
					</span>
				</div>
				<div className="order-settlement-total-btn">
					<div className="form-group">
						<button type="submit" className="btn btn-primary btn-block">
						{__('settlement')}
						</button>
					</div>
				</div>
			</div>
			);
	}
});

var OrderSettlement = React.createClass({
	mixins: [History],
	getInitialState: function() {
		return getStateFromStores();
	},

	openModal: function() {
		this.setState({
			modalIsOpen: true
		});
	},

	closeModal: function() {
		this.setState({
			modalIsOpen: false
		});
	},

	componentDidMount: function() {
		var o = JSON.parse(sessionStorage.getItem('addressManagementSelectId'));
		setTimeout(function(){
			if (o !== null) {
				OrderSettlementUtil.getOrderSession(o.selectedId);
			}
			else{
				OrderSettlementUtil.getOrderSession(-1);
			}
		},0);
		OrderSettlementStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		OrderSettlementStore.removeChangeListener(this._onChange);
	},

	render: function() {
		var totalPrice = new Big(0);
		if (this.state.orderProductsJsonC !== null) {
			this.state.orderProductsJsonC.map(function(storeItem, index) {
				var productPrice = new Big(0);
				storeItem.selectProduct.map(function(productItem, index) {
					var combinationPrice = new Big(0);
					productItem.combination.map(function(combination, index) {
						var getcomprice = new Big(combination.getcomprice);
						combinationPrice = combinationPrice.add(Big(combination.getamount).times(getcomprice));
					});
					productPrice = productPrice.add(combinationPrice);
				});
				totalPrice = totalPrice.add(productPrice);
			});
		}
		totalPrice = totalPrice.toString();
		var endPrice = this.state.orderEndPriceC;
		var couponsPrice = new Big(0);

		if (endPrice && totalPrice) {
			couponsPrice = Big(totalPrice).minus(Big(endPrice));
			endPrice = Big(endPrice).toString();
			endPrice = CKFM.getDisplayPrice(endPrice) + CKFM.getCurrency();
		}
		couponsPrice = couponsPrice.toString();
		couponsPrice = CKFM.getDisplayPrice(couponsPrice) + CKFM.getCurrency();
		totalPrice = CKFM.getDisplayPrice(totalPrice) + CKFM.getCurrency();
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('order settlement')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="order-settlement">
						<form className="form-horizontal" onSubmit={this._handleSubmit}>
							<input type="hidden" name="payMethod" value="all"/>

							<OrderSettlementAddress address={this.state.orderAddressJsonC} onSessionId={this.handleSessionId}/>
							<OrderSettlementProducts products={this.state.orderProductsJsonC}/>
							{
								this.state.orderCouponsJsonC.length === 0 ? 
								null
								:
								<OrderSettlementCoupons couponsNum={this.state.orderCouponsNumC}/>
							}
							<OrderSettlementReminder onDeliverModal={this.openModal} modalSelect={this.state.modalSelect}/>
							<div className="order-settlement-wrapper">
								<OrderSettlementPrice totalPrice={totalPrice} endPrice={endPrice} coupons={couponsPrice}/>
								{
									this.state.err.length > 0 ?
									<ErrMsg msg={this.state.err}/>:null
								}
							</div>
							<OrderSettlementTotal endPrice={endPrice}/>
							<Modal
								isOpen={this.state.modalIsOpen}
								onRequestClose={this.closeModal}
								style={customStyles} >
								<div className="order-settlement-modal" ref="fabufa">
									<div className="order-settlement-modal-item">
										<span className="order-settlement-modal-item-icon">
											<CkRadio name="myradiodeliver" defaultChecked={this.state.modalSelect} value="true" onChange={this._handleChangeModal}/>
										</span>
										<span className="order-settlement-modal-item-text">
											{__('ship goods out of stock in order')}
											<span className="order-settlement-modal-item-text-tip">
												{__('after the order is submitted, if some of the goods are out of stock, I agree with cooka to distribution of the remaining goods to me')}
											</span>
										</span>
									</div>
									<div className="order-settlement-modal-item">
										<span className="order-settlement-modal-item-icon">
											<CkRadio name="myradiodeliver" defaultChecked={!this.state.modalSelect} value="false" onChange={this._handleChangeModal}/>
										</span>
										<span className="order-settlement-modal-item-text">
											{__('do not ship goods out of stock in order')}
											<span className="order-settlement-modal-item-text-tip">
												{__("after the order is submitted, if some of the goods are out of stock, I agree that cooka does not ship the goods")}
											</span>
										</span>
									</div>
								</div>
							</Modal>
						</form>
					</div>
				</div>
			</div>
			);
	},
	handleSessionId: function() {
		sessionStorage.setItem('orderSettlementId', JSON.stringify({
			'selectedId': this.state.selectedIdC
		}));
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);
		data.ordersForm = JSON.parse(data.ordersForm);
		if (FormUtil.isSafari()) {
			var addressListLength = 0;
			if (this.state.orderAddressJsonC !== null) {
				addressListLength = this.state.orderAddressJsonC.length;
			}
			if (addressListLength === 0) {
				this.setState({
					err: ErrMsgMap.addrRequired
				});
				return false;
			}
			else if (addressListLength) {
				this.setState({
					err: ''
				});
			}
			
		}
		//handle the data 
		OrderSettlementUtil.sendData(data,function(data){
			if (data.result==="createSuccess") {
					this.history.pushState(null, "/orderpayment/"+data.orderSerialnum);
				}
		}.bind(this));
		
		return false;
	},
	_handleChangeModal: function() {
		var data = FormUtil.formToObject(this.refs.fabufa);
		if (data.myradiodeliver === "true") {
			this.setState({
				modalSelect: true
			});
		} else {
			this.setState({
				modalSelect: false
			});
		}
		this.closeModal();
	}
});

module.exports = OrderSettlement;
