var request = require('superagent');

var EditAddressListActionCreators = require('../actions/EditAddressListActionCreators.js');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		setTimeout(function() {
			var data = JSON.parse(sessionStorage.getItem('editAddressJson'));
			if (data !== null) {
				EditAddressListActionCreators.getData(data);
			}
		}, 0);
	},
	getAddress: function(child, id, type, levelValue) {
		if (child !== null) {
			var data = {
				"child": child,
				"parentId": id
			};
			request
				.post('/cooka-order-web/m/selectChildAddr')
				.use(CKFM.ajaxLoading())
				.use(CKFM.ajaxAuth())
				.set('__RequestVerificationToken', CKFM.getToken())
				.set('Content-Type', 'application/json; charset=UTF-8')
				.send(JSON.stringify(data))
				.end(function(err, res) {
					var data = JSON.parse(res.text);
					EditAddressListActionCreators.changeData(data, type, levelValue);
				});
		}
		else
			EditAddressListActionCreators.changeData(null, type, levelValue);
	},
	submitAddress: function(data) {
		request
			.post('/cooka-order-web/m/editAddressHandle')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('__RequestVerificationToken', CKFM.getToken())
			.set('Content-Type', 'application/json; charset=UTF-8')
			.send(JSON.stringify(data))
			.end(function(err, res) {});
	}
};