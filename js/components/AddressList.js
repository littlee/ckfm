var React = require('react');
var Header = require('./Header.js');
var History = require('react-router').History;
var Modal = require('react-modal');

require('../../less/address-management.less');
var AddressListStore = require('../stores/AddressListStore.js');
var AddressListUtil = require('../utils/AddressListUtil.js');

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
		right: '30%',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};

function getStateFromStores() {
	return {
		addressList: AddressListStore.getData(),
		modalIsOpen: false,
		modalId: null
	};
}

var IsDefault = React.createClass({
	render: function() {
		return (
			<span className="address-management-item-info-default">{__('default')}</span>
			);
	}
});
var AddressList = React.createClass({
	changeEditId: function(item) {
		this.props.onHandleSetEditId(item.deliveraddrId);
	},
	handleModal: function(id) {
		this.props.onDeleteModal(id);
	},
	render: function() {
		var addressItems = [];
		if (this.props.addressList != null) {
				addressItems = this.props.addressList.addressList.map(function(item, index) {
				return (
					<div className="address-management-item" key={index}>
						<div className="address-management-item-info">
							<div className="address-management-item-info-link">
								<div className="address-management-item-info-detail">
									{item.name} &nbsp; {item.phone} {item.isDefault ? <IsDefault/> : null}
									<br/>
									{item.country}{item.state}{item.city}{item.region}{item.addrDetail}
								</div>
							</div>
						</div>
						<div className="address-management-item-operation">
							<span className="address-management-item-operation-icon address-management-item-operation-link" onClick={this.changeEditId.bind(this, item, index)}>
								<span className="icon-edit-o address-management-item-operation-icon-size">
								</span>
								{__('edit')}
							</span>
							<span className="address-management-item-operation-icon" onClick={this.handleModal.bind(this, item.deliveraddrId)}>
								<span className="icon-delete-o address-management-item-operation-icon-size">
								</span>
								{__('delete')}
							</span> 
						</div>
					</div>
					);
			}, this);
		}

		return (
			<div className="address-management-list">
				{addressItems}				
			</div>
			);
	}

});
var AddressManagement = React.createClass({
	mixins: [History],
	getInitialState: function() {
		return getStateFromStores();
	},

	openModal: function(id) {
		this.setState({
			modalIsOpen: true,
			modalId: id
		});
	},

	closeModal: function() {
		this.setState({
			modalIsOpen: false
		});
	},
	componentDidMount: function() {
		AddressListStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		AddressListStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header title={__('receipt address management')}/>
				</div>
				<div className="col-xs-12 trim-col">
					<div className="address-management">
						<AddressList addressList={this.state.addressList} selectedId={this.state.selectedId} onHandleSetEditId={this.handleSetEditId} onDeleteModal={this.openModal}/>
						<div className="address-management-add">
							<button type="button" className="btn btn-primary btn-block" onClick={this.changeEditId}>
								<span className="address-management-add-icon">
									<span className="icon-add-o"></span>
								</span>
								{__('add new address')}
							</button>
						</div>
					</div>
				</div>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles} >
					<div className="address-management-modal">
						<span className="address-management-modal-content">{__('are you sure to delete this address?')}</span>
						<div className="address-management-modal-btn">
							<button type="button" className="btn btn-default" onClick={this.closeModal}>{__('cancel')}</button>
							<button type="button" className="btn btn-primary address-management-modal-btn-right" onClick={this.handleDelete}>{__('confirm')}</button>
						</div>
					</div>
				</Modal>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},
	changeEditId: function() {
		this.handleSetEditId(-1);
	},
	handleSetEditId: function(editId) {
		var id = editId;
		AddressListUtil.sendEditId(id, function() {
			this.history.pushState(null, "/editaddresslist");
		}.bind(this));
	},
	handleDelete: function() {
		var id = this.state.modalId;
		//delete it
		AddressListUtil.deleteAddr(id);
		this.closeModal();
	}

});

module.exports = AddressManagement;