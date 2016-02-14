require('../../less/payment-success.less');

var Link = require('react-router').Link;
var CKFM = require('../CKFM.js');
var React = require('react');

var ShopSelect = React.createClass({
	render: function() {
		var shops = [{
			shopName: 'COOKA 实体店01',
			telphone: '01685968988',
			address: 'Ki ốt số 6- dãy B- Ba da-phường  Đình Bảng- Tp Bắc Ninh'
		},{
			shopName: 'COOKA 实体店02',
			telphone: '01685968988',
			address: 'Ki ốt số 6- dãy B- Ba da-phường  Đình Bảng- Tp Bắc Ninh'
		}];

		var shopComp = shops.map(function(shop, index){
			return (
				<div className="shop-select-item" key={index}>
					<p className="shop-select-item-name">{shop.shopName}</p>
					<dl className="dl-cooka-horizontal">
						<dt>{__('contact phone')}</dt>
						<dd className="phone-num">&nbsp;:&nbsp;{shop.telphone}</dd>
						<dt>{__('address')}</dt>
						<dd>&nbsp;:&nbsp;{shop.address}</dd>
					</dl>
				</div>
			);
		});
		return (
			<div className="shop-select-module">
				<p className="shop-select-title">{__('select one of following shops to trade')}</p>
				{shopComp}
			</div>
		);
	}
});

var PaymentSuccess = React.createClass({
	getDefaultProps: function() {
		return {
			paymentId: 3,
			paymentAmount: 0
		};
	},

	render: function() {
		return (
			<div className="payment-success-module trim-col">
				<div className="payment-success-content">
					<h2 className="payment-success-logo"><span className="icon-check-circle-o"></span></h2>
					<p className="payment-success-text">{__('payment success')}</p>
					<dl className="payment-success-dl">
						<dt>{__('order number')} :</dt>
						<dd>{this.props.orderSerialnum}</dd>
						<dt>{__('order amount')} :</dt>
						<dd>{this.props.paymentAmount} {CKFM.getCurrency()}</dd>
					</dl>
					<Link to={`orderDetail/`+this.props.orderSerialnum} className="payment-success-detail">{__('order detail')} &gt;&gt;</Link>
				</div>

				{ this.props.paymentId === 3 ? <ShopSelect /> : null }

				<div className="payment-success-opt">
					<div className="col-xs-5 col-xs-offset-1">
						<Link to={'/'} className="btn btn-block btn-primary">{__('continue to shop')}</Link>
					</div>
					<div className="col-xs-5">
						<Link to={'orderlist'} className="btn btn-block btn-default">{__('my order')}</Link>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = PaymentSuccess;
