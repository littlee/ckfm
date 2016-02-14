require('../../less/refund-apply.less');
require('../../less/refund-status.less');
var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var Modal = require('react-modal');

var CKFM = require('../CKFM.js');
var CkCheckbox = require('./CkCheckbox.js');
var Header = require('../components/Header.js');
var RefundStatus = require('../components/RefundStatus.js');

var FormUtil = require('../utils/FormUtil.js');
var RefundStore = require('../stores/RefundStore.js');
var RefundUtil = require('../utils/RefundUtil.js');
var RefundActionCreators = require('../actions/RefundActionCreators.js');

var statusMap = {
	'refund': __('apply for refund'),
	'return': __('apply for return refund')
};

var errMsgMap = {
	'emptyMoney': __('the money is required and can not be empty'),
	'emptyReason': __('the reason is required and can not be empty'),
	'limit': __('the content must less than 200 characters'),
	'moneyFormat': __('money format is wrong'),
	'moneyLimit': __('money is wrong'),
	'errorPassword':__('wrong password'),
	'emptyPassword':__('password is required'),
	'you still has 1 chances to enter pay password':__('you still have 1 chances to enter pay password'),
	'you still has 2 chances to enter pay password':__('you still have 2 chances to enter pay password'),
	'your financial account has been lock and it will be actived automatically later(24 hours)':__('your financial account has been lock and it will be actived automatically later(24 hours)')
};

var refundReasonMap = {
	'':__("please select a reason"),
	'take_the_wrong_multi_take_do_not_want':__("take the wrong multi take do not want"),
	'return_shipping_price_differences':__("return shipping price differences"),
	'not_deliver_goods_in_the_agreed_time':__("not deliver goods in the agreed time"),
	'other':__("other")
};

var returnReasonMap = {
	'':__("please select a reason"),
	'return_shipping_price_differences':__("return shipping price differences"),
	'commodity_damage':__("commodity damage"),
	'commodity_information_description_does_not_match':__("commodity information description does not match"),
	'counterfeit_products':__("counterfeit products"),
	'quality_problem':__("quality problem"),
	'empty_package':__("empty package"),
	'other':__("other")
};

var customStyles = {
	overlay : {
	    position          : 'fixed',
	    top               : 0,
	    left              : 0,
	    right             : 0,
	    bottom            : 0,
	    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
	    zIndex			  : 1000
	},
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)',
		width 				  : '80%',
		borderRadius		  : '10px',
		textAlign			  : 'center',
		padding  			  : '15px'
	}
};

var ErrorMessage = React.createClass({

	propTypes: {
		error: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			error: ''
		};
	},

	render: function() {
		var show = false;
		show = this.props.error.length > 0;
		var regex = new RegExp("Password"); 
		return (
			<div>
			{show && !regex.test(this.props.error) ?
				<div className="alert alert-danger">
				{errMsgMap[this.props.error]}
			</div> : null
			}
			</div>
			);
	}
});

var ErrorPassword = React.createClass({

	propTypes: {
		error: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			error: ''
		};
	},

	render: function() {
		var show = false;
		show = this.props.error.length > 0; 
		return (
			<div>
			{show?
				<div className="alert alert-danger text-left">
					<span className="icon-clear"></span>
					<span className="refund-apply-error-password">{errMsgMap[this.props.error]}</span>
				</div> : null
			}
			</div>
			);
	}
});

var Reason = React.createClass({

	getInitialState: function() {
		return{reason:this.props.o.reason||''}
	},

	componentWillReceiveProps: function(nextProps) {
		if(nextProps.o.reason !== this.props.o.reason){
			this.setState({reason: nextProps.o.reason});
		}
	},

	_change:function(e){
		this.setState({reason: e.target.value});
	},

	render: function() {
		var item = []; 
		var r = refundReasonMap;
		var type = this.props.o.type;

		if(type === 'refund'){
			r = refundReasonMap;		  
		}else{
			r = returnReasonMap;
		}

		Object.keys(r).forEach(function(s, i) {
			item.push(
				<option value={s} key={i}>{r[s]}</option>
			)
		});

		return (
			<select className="form-control" name="reason" value={this.state.reason} onChange = {this._change}>
				{item}
			</select>
			);
	}
});

var Money = React.createClass({

	getInitialState: function() {
		return{money:this.props.money||''}
	},

	_change:function(e){
		this.setState({money: e.target.value});
	},

	render: function() {

		return (
			<div>
				<input name={"refund["+this.props.i+"].money"} value = {this.state.money} className="form-control refund-apply-money-ipt" placeholder={__("refund amount")} onChange={this._change}/>					
				<span>K</span>
			</div>
		);
	}
});

var Description = React.createClass({

	getInitialState: function() {
		return{description:this.props.description||''}
	},

	_change:function(e){
		this.setState({description: e.target.value});
	},

	componentWillReceiveProps: function(nextProps) {
		if(nextProps.description !== this.props.description){
			this.setState({description: nextProps.description});
		}
	},

	render: function() {
		return (
			<textarea
				value={this.state.description}
				onChange={this._change}
				name="description"
				className="form-control"
				rows="5"
				placeholder = {__('write down your comments on this product')+__('the content must less than 200 characters')}>
				</textarea>
		);
	}
});

var Evidence = React.createClass({

	getInitialState: function() {
		return{
			url:'',//this.props.evidence||
			file:null
		}
	},

	_upLoad:function(e){
		var file = e.target.files[0];

		if(file){

			var type = file.type;

			if(type === "image/jpeg"||type === "image/jpg"||type === "image/x-icon"||type === "image/png"){
			
				var reader = new FileReader();

				reader.onload = function(e) {
					this.setState({url: e.target.result})					
				}.bind(this);

				reader.readAsDataURL(file);
			}

			var data={
				file:file,
				i:this.props.i,
				refundKey:this.props.refundKey
			}

			RefundActionCreators.upLoad(data);
		}else{

			this.setState({url: this.state.url})

		}
	},

	_close:function(e){

		this.setState({
			url: ''
		})

		var data={
			file:null,
			i:this.props.i
		}

		RefundActionCreators.upLoad(data);
	},

	render: function() {
		return (
			<div className="refund-apply-evidence">
				<span className="icon-plus"></span>
				
				<input ref="file" type="file" className="refund-apply-evidence-ipt" onChange={this._upLoad}/>
				
				{
					this.state.url === ''
					?
					null
					:
					<div className="refund-apply-evidence-box">
						<img src={this.state.url}/>
						<span className="icon-minus" onClick={this._close}></span>
					</div>
				}

			</div>
			);
	}
});

var ApplyItem = React.createClass({

	getInitialState: function() {
		return{
			error:''
		}
	},	

	render: function() {

		var spec = [];
		if(this.props.o.specificationValues){				
			Object.keys(this.props.o.specificationValues).forEach(function(sk, i) {
				spec.push(<span key={i} className="refund-apply-info-span">{sk} : {this.props.o.specificationValues[sk]}</span>);
			}.bind(this));
		}

		return (
			<div>
				<div className="refund-apply-info">
					<div className="refund-apply-info-title">{this.props.o.title}</div>
					<div>
						{spec}
						<span className="refund-apply-info-span">× {this.props.o.amount}</span>
					</div>
				</div>

				<div className="form-group">
					<Money money = {parseInt(this.props.o.money/1000)} i={this.props.i}/>
					<span className="text-danger">{__("at most")}{this.props.o.realPrice?CKFM.getDisplayPrice(this.props.o.realPrice) +' '+ CKFM.getCurrency():null}</span>
				</div>			
				
			</div>
			)
	}

});

/*<dl className="dl-horizontal refund-apply-modal-dl">
	<dt>退货数量：</dt>
	<dd>{this.props.o.pieces}</dd>
</dl>

<dl className="dl-horizontal refund-apply-modal-dl">
	<dt>{__("refund amount")}：</dt>
	<dd>{this.state.money}VND</dd>
</dl>*/

var ApplyForm = React.createClass({

	mixins: [ History ],

	getInitialState: function() {
		return{
			error:'',
			errorPassword:'',
			modalIsOpen: false,
			money:this.props.o.money||0,			
			description:this.props.o.description||''
		}
	},	

	openModal: function() {
		this.setState({
			error: '',
			modalIsOpen: true
		});
	},

	closeModal: function() {
		this.setState({
			errorPassword:'',
			modalIsOpen: false
		});
	},

	render: function() {
		if(this.props.o.list){	
			var items = this.props.o.list.map(function(item,i){
				return <ApplyItem o={item} key={i} i = {i}/>
			})

			var evidence = [];
			for(var i=0;i<3;i++){
				evidence.push(<Evidence refundKey = {this.props.i} i={i} key={i} evidence ={this.props.o.list[0].evidence&&this.props.o.list[0].evidence[i]? this.props.o.list[0].evidence[i].evidenceUrl:''}/>)
			}
		}

		return (
			<div>
				<form onSubmit={this._handleSubmit} name="applyForm" ref="myForm">

					{items}

					<div className="form-group">
						<Reason o={this.props.o.list?this.props.o.list[0]:this.props.o} i='0'/>
						<span className="text-danger">{__("meaning of the reason to return")}</span>
					</div>

					<div className="form-group">
						<Description description = {this.props.o.list?this.props.o.list[0].description:''} i='0'/>					
					</div>

					<div className="form-group">
						<div>{__("upload 3 photos at most")}</div>	
						{evidence}
					</div>

					<ErrorMessage error={this.state.error}/>
					<div className="form-group text-center">
						<button type="submit" className="btn btn-primary btn-rect">{__("submit")}</button>	
						<button type="button" className="btn refund-apply-return btn-rect" onClick={this._cancel}>取消并返回</button>	
					</div>
					
				</form>

				<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
					<form onSubmit={this._sure}>
						<input name="password" type="password" className="refund-apply-modal-ipt" placeholder = {__('please input your payment password')}/>
						<ErrorPassword error={this.state.errorPassword}/>
						<button type="button" className="btn btn-default btn-rect refund-apply-modal-btn" onClick={this.closeModal}>{__('cancel')}</button>	
						<button type="submit" className="btn btn-primary btn-rect refund-apply-modal-btn">{__('submit')}</button>	
					</form>
				</Modal>
				
			</div>
			)
	},

	_handleSubmit: function(e) {
		e.preventDefault();
		var data = FormUtil.formToObject(e.target);

		if(!data || !data.reason || data.reason === '') {
			this.setState({error: 'emptyReason'});
			return false;
		}
		if (data.description && data.description.length>200) {
			this.setState({error: 'limit'});
			return false;
		}

		for (var i=0;i<this.props.o.list.length;i++) {
			var d = data.refund[i];			

			if (!d['.money']) {
				this.setState({error: 'emptyMoney'});
				return false;
			}

			// var pat=/^(\d+(?:\.0{3})?)$/;
			var pat=/^(\d+)$/;
			var money = d['.money'];		
			if (!pat.test(money.toString())) {
				this.setState({error: 'moneyLimit'});
				return false;
			}		

			if (d['.money']>this.props.o.list[i].realPrice/1000) {
				this.setState({error: 'moneyLimit'});
				return false;
			}		
		};
		this.openModal();		
	},

	_sure:function(e){
		e.preventDefault();

		var oData = new FormData(this.refs.myForm);		
		var data = FormUtil.formToObject(this.refs.myForm);
		var password = FormUtil.formToObject(e.target).password;
		var itemSerialNum = [];
		var money=[];

		if ((!password)||password==='') {
			this.setState({
				errorPassword: 'emptyPassword'
			});
			return false;
		}

		for(var refundKey = 0;refundKey<this.props.o.list.length;refundKey++){			
			oData.append("refund[" + refundKey + "].itemSerialNum", this.props.o.list[refundKey].itemSerialNum);
		}

		for (var i=0;i<this.props.o.list.length;i++) {
			var d = data.refund[i];			
			money.push(d['.money']);	
		};

		for(var i=0;i<3;i++){						
			if(RefundStore.getFile()[i]){
				oData.append("evidence"+(i+1), RefundStore.getFile()[i]);				
			}
			/*else if(this.props.o.evidence&&this.props.o.evidence[i] !== ""){
				oData.append("evidence"+(i+1), null);
			}else{
				oData.append("evidence"+(i+1), null);	
			}*/
		}

		oData.append("type", this.props.o.list[0].type);		
		oData.append("orderSerialnum", this.props.o.list[0].orderSerialnum);
		oData.append("money", money);
		oData.append("password", password);		
		oData.append("xToken", CKFM.getToken());

		RefundUtil.getPassword(oData,function(res){
			if(res.result==='success'){	
				sessionStorage.removeItem('refundOrder');
				sessionStorage.removeItem('refundChooseItems');
				this.history.pushState(null, '/orderdetail/' + this.props.o.list[0].orderSerialnum);
				return;
			}else{
				this.setState({
					errorPassword: res.result
				});
			}
		}.bind(this));

	},

	_cancel:function(){		
		sessionStorage.removeItem('refundOrder');
		sessionStorage.removeItem('refundChooseItems');		
		this.history.pushState(null, '/orderlist');
	}

});

function getStateFromStores() {
	return {
		order:RefundStore.getData()
	}
}

var RefundApply = React.createClass({	

	getInitialState: function() {
		var query = this.props.params.itemSerialNum;
		RefundUtil.fromRefundOrder(query);
		return getStateFromStores();
	},

	componentDidMount: function() {
		RefundStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		RefundStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					{this.state.order ? <Header title={this.state.order.list&&this.state.order.list[0]?statusMap[this.state.order.list[0].type]:null} />:null}
				</div>
				<div className="col-xs-12">
					{this.state.order ?
						<div className="refund-apply">
							<RefundStatus type={this.state.order.list&&this.state.order.list[0]?this.state.order.list[0].type:null} status = "begin"/>
							<ApplyForm o={this.state.order}/>
						</div>
						:null}
				</div>
			</div>
			);
	},	

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = RefundApply;