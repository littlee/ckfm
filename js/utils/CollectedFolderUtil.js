var CollectedFolderActionCreators = require('../actions/CollectedFolderActionCreators.js');
var request = require('superagent');
var CKFM = require('../CKFM.js');

module.exports = {
	getData: function() {
		request
			.get('/cooka-user-web/center/m/viewFavourite')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.end(function(err, res) {
				var data = JSON.parse(res.text);
				CollectedFolderActionCreators.receiveData(data);
			});
	},
	deleteProInCollection: function(productId) {
		var sendData = {
			productId: productId
		};
		request
			.post('/cooka-user-web/center/m/deletefavouriteProduct')
			.use(CKFM.ajaxLoading())
			.use(CKFM.ajaxAuth())
			.set('Content-Type', 'application/json')
			.set('__RequestVerificationToken', CKFM.getToken())
			.send(sendData)
			.end(function(err) {
				if (err) {
					alert(__('unknown error'));
				} else {
					request
						.get('/cooka-user-web/center/m/viewFavourite')
						.end(function(err, res) {
							var data = JSON.parse(res.text);
							CollectedFolderActionCreators.receiveData(data);
						});
				}
			});
	}
};
