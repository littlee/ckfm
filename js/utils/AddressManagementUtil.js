var AddressManagementActionCreators = require('../actions/AddressManagementActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');
module.exports = {
	getData: function() {
		request.get('/cooka-order-web/m/addressManage')
		.use(CKFM.ajaxLoading())
		.use(CKFM.ajaxAuth())
		.end(function(err, res) {
			var data = JSON.parse(res.text);
			//session get
			var o = JSON.parse(sessionStorage.getItem('orderSettlementId'));
			var id = -1;
			if (o!==null) {
				id = o.selectedId;
			}			
			//initial state of id for session
			AddressManagementActionCreators.receiveData(data,id);
		});
	},
	sendEditId: function(data, cb) {
		sessionStorage.setItem('deliveraddrId', JSON.stringify({"deliveraddrId":data}));
		request
			.post('/cooka-order-web/m/editAddress')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(JSON.stringify({"deliveraddrId":data}))
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				sessionStorage.setItem('editAddressJson', JSON.stringify(data));

				if (cb && typeof cb === 'function') {
					cb();
				}
			});
	},
	deleteAddr: function(id) {
		request
			.post('/cooka-order-web/m/deleteAddressHandle')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(JSON.stringify({"deleteId":id}))
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				//session get
				var o = JSON.parse(sessionStorage.getItem('orderSettlementId'));
				var id = -1;
				if (o!==null) {
					id = o.selectedId;
				}	
				//initial state of id for session
				AddressManagementActionCreators.receiveData(data,id);
			});
	}
};


