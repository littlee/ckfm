var React = require('react');
var Header = require('./Header.js');
var History = require('react-router').History;

require('../../less/edit-address.less');
var FormUtil = require('../utils/FormUtil.js');
var EditAddressStore = require('../stores/EditAddressStore.js');
var EditAddressUtil = require('../utils/EditAddressUtil.js');
var EditAddressActionCreators = require('../actions/EditAddressActionCreators.js');
function getStateFromStores() {
	return {
		editAddress: EditAddressStore.getData(),
		err: EditAddressStore.getErr()
	};
}

var ErrMsgMap = {
	'receiverRequired': __('the receiver is required and can not be empty'),
	'phoneRequired': __('the phone is required and can not be empty'),
	'phonePattern': __('phone format is wrong'),
	'areaRequired': __('the address is required and can not be empty'),
	'zipCodeRequired': __('the zip code is required and can not be empty'),
	'detailRequired': __('the address detail is required and can not be empty')
};

var ErrMsg = React.createClass({
	render: function() {
		return (
			<div className="alert alert-danger edit-address-form-alert">{this.props.msg}</div>
			);
	}
});

var DefaultBlock = React.createClass({
	render: function() {
		var isDefault = this.props.isDefault;
		if (!isDefault) {
			return (
				<div className="form-group edit-address-form-radio">
					<div className="col-xs-12">
						<div className="checkbox">
							<label>
								<input type="checkbox" name="isDefault" value="true"/> {__('set to default address')}
							</label>
						</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<input type="hidden" name="isDefault" value="true"/>
				);
		}
	}
});
var SelectAddress = React.createClass({
	getInitialState: function() {
		return {
			levelValue: this.props.levelValue
		};
	},
	componentWillReceiveProps: function(nextProps) {
		var ff = nextProps.levelValue;
		if (ff === null) {
			ff = '';
		}
		this.setState({
			levelValue: ff
		});
	},
	changeAddress: function(dataOptions, e) {
		this._onChange(e);
		var id = "";
		[].every.call(e.target.querySelectorAll('option'), function(oo, i) {
			if (oo.selected) {
				id = oo.getAttribute("data-id");
				return false;
			}
			return true;
		});
		switch (e.target.name) {
			case "country":
				EditAddressUtil.getAddress(dataOptions.child, id, e.target.name, e.target.value);
				break;
			case "state":
				EditAddressUtil.getAddress(dataOptions.child, id, e.target.name, e.target.value);
				break;
			case "city":
				EditAddressUtil.getAddress(dataOptions.child, id, e.target.name, e.target.value);
				break;
			case "region":
				EditAddressUtil.getAddress(null, null, e.target.name, e.target.value);
				break;
		}
	},
	render: function() {

		var dataOptions = this.props.dataOptions;
		var ref = this.props.subRef;
		var levelValue = this.state.levelValue;
		var options = [];
		var empty = null;
		if (!levelValue) {
			empty = <option data-id="">{__('select')}</option>;
		}
		if (dataOptions.items) {
			options = Object.keys(dataOptions.items).map(function(key, index) {
				return (
					<option value={dataOptions.items[key]} data-id={key} key={index}>{dataOptions.items[key]}</option>
					);
			});
		}

		return (
			<select  className="form-control" value={levelValue} name={ref} onChange={this.changeAddress.bind(this, dataOptions)}>	
				{empty}
				{options}
			</select>
			);
	},
	_onChange: function(e) {
		var levelValue = e.target.value;
		this.setState({
			levelValue: levelValue
		});
	}
});


var Form = React.createClass({
	getInitialState: function() {
		return {
			formData: this.props.formData
		};
	},
	componentWillReceiveProps: function(nextProps) {
		var f = nextProps.formData;
		if (f.addrDetail === null) {
			f.addrDetail = '';
		}
		this.setState({
			formData: f
		});
	},
	_handleSubmit: function(e) {
		this.props.onHandleSubmit(e);
	},
	render: function() {
		var formData = this.state.formData;
		var lenAddress = formData.address.length;
		return (
			<form className="form-horizontal edit-address-form" onSubmit={this._handleSubmit}>
				<div className="form-group edit-address-form-group">
					<label className="control-label col-xs-3 edit-address-form-label">{__('recipient')}</label>
					<div className="col-xs-9">
						<input type="text" className="form-control" name="name" value={formData.name} onChange={this._onChange.bind(this, formData)} required/>
					</div>
				</div>
				<div className="form-group edit-address-form-group">
					<label className="control-label col-xs-3 edit-address-form-label">{__('phone number')}</label>
					<div className="col-xs-9">
						<input type="text" className="form-control" name="phone" ref="phone" value={formData.phone} onChange={this._onChange.bind(this, formData)} pattern="^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$" required/>
					</div>
				</div>
				<div className="form-group edit-address-form-group">
						<label className="control-label col-xs-3 edit-address-form-label">{__('address')}</label>
						<div className="col-xs-9">
							<div className="row">
								<div className="col-xs-6 edit-address-form-select">
									<SelectAddress dataOptions={formData.address[0]} subRef="country" levelValue={formData.country} addressLen={lenAddress}/>
								</div>
								<div className="col-xs-6 edit-address-form-select">
									{lenAddress > 1 ? <SelectAddress dataOptions={formData.address[1]} subRef="state" levelValue={formData.state} addressLen={lenAddress}/> :
									<SelectAddress dataOptions="" subRef="state" levelValue={formData.state} addressLen={lenAddress}/>}
								</div>
								<div className="col-xs-6">
									{lenAddress > 2 ? <SelectAddress dataOptions={formData.address[2]} subRef="city" name="city" levelValue={formData.city} addressLen={lenAddress}/> :
									<SelectAddress dataOptions="" subRef="city" levelValue={formData.city} addressLen={lenAddress}/>}
								</div>
								<div className="col-xs-6">
									{lenAddress > 3 ? <SelectAddress dataOptions={formData.address[3]} subRef="region" levelValue={formData.region} addressLen={lenAddress}/> :
									<SelectAddress dataOptions="" subRef="region" levelValue={formData.region} addressLen={lenAddress}/>}
								</div>
							</div>
						</div>
				</div>
				<div className="form-group edit-address-form-group">
					<label className="control-label col-xs-3 edit-address-form-label">{__('zip code')}</label>
					<div className="col-xs-9">
						<input type="text" className="form-control" name="zipcode" onChange={this._onChange.bind(this, formData)} value={formData.zipcode} required/>
					</div>
				</div>
				<div className="form-group edit-address-form-group">
					<label className="control-label col-xs-3 edit-address-form-label">{__('address detail')}</label>
					<div className="col-xs-9">
						<textarea className="form-control" rows="4" name="addrDetail" onChange={this._onChange.bind(this, formData)}  value={formData.addrDetail} required>
						</textarea>
					</div>
				</div>
				<DefaultBlock isDefault={formData.isDefault}/>
				{this.props.err.length > 0 ? <ErrMsg msg={this.props.err}/> : null}
				<div className="form-group">
					<div className="col-xs-12">
						<div className="edit-address-form-btn">
							<button type="submit" className="btn btn-primary btn-block">{__('submit')}</button>
						</div>
					</div>
				</div>
			</form>
			);
	},
	_onChange: function(formData, e) {
		var ref = e.target.name;
		formData[ref] = e.target.value;
		this.setState({
			formData: formData
		});
	}
});
var EditAddress = React.createClass({
	mixins: [History],
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		EditAddressUtil.getData();
		EditAddressStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		EditAddressStore.removeChangeListener(this._onChange);
	},
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('edit recipient address')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="edit-address">
						{this.state.editAddress !== null ? <Form formData={this.state.editAddress} ref="form" onHandleSubmit={this._handleSubmit} err={this.state.err}/> : null}
					</div>
				</div>
			</div>
			);
	},
	_handleSubmit: function(e) {
		e.preventDefault();
			var data = FormUtil.formToObject(e.target);
			if (data.isDefault) {
				if (data.isDefault[0] === 'true') {
					data.isDefault = true;
				}
			} else{
				data.isDefault = false;
		}
		if (FormUtil.isSafari()) {
			if (!e.target.checkValidity()) {
				var phonePattern = this.refs.form.refs.phone.pattern;
				if (!data.name) {
					EditAddressActionCreators.submitEditAddress(ErrMsgMap.receiverRequired);
				} else if (!data.phone) {
					EditAddressActionCreators.submitEditAddress(ErrMsgMap.phoneRequired);
				} else if (!(data.phone).match(phonePattern)) {
					EditAddressActionCreators.submitEditAddress(ErrMsgMap.phonePattern);
				} else if (!data.country) {
					EditAddressActionCreators.submitEditAddress(ErrMsgMap.areaRequired);
				} else if (!data.zipcode) {
					EditAddressActionCreators.submitEditAddress(ErrMsgMap.zipCodeRequired);
				} else if (!data.addrDetail) {
					EditAddressActionCreators.submitEditAddress(ErrMsgMap.detailRequired);
				}

				return false;
			}
			else
				EditAddressActionCreators.submitEditAddress('');
		}
		data.deliveraddrId = JSON.parse(sessionStorage.getItem('deliveraddrId')).deliveraddrId;
		EditAddressUtil.submitAddress(data);
		this.history.pushState(null, "/addressmanagement");
		return false;
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});
module.exports = EditAddress;