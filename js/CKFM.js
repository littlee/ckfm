var config = require('json!../__config__.json');
var configFunctions = require('../__configFunctions__.js');
var _random = require('lodash/number/random');

function toUnicode(str) {
	return str.split('').map(function(value) {
		var temp = value.charCodeAt(0).toString(16).toUpperCase();
		return temp;
	}).join('');
}

function getCookie(c) {
	// defautl set
	var DEFAULT = {
		'language': config.language
	};

	var cMatch = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(c).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;

	if (cMatch !== null) {
		return cMatch;
	}

	return DEFAULT[c];
}

function setCookie(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
		return false;
	}
	var sExpires = '';
	if (vEnd) {
		switch (vEnd.constructor) {
			case Number:
				sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
				break;
			case String:
				sExpires = '; expires=' + vEnd;
				break;
			case Date:
				sExpires = '; expires=' + vEnd.toUTCString();
				break;
		}
	}
	// sPath should always set to '/'
	sPath = '/';
	document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
	return true;
}

function getToken() {
	return sessionStorage.getItem('xtoken') || 'X_TOKEN';
}

function redirectToSignin(nextState, replaceState) {
	if (!isSignedIn()) {
		replaceState({
			nextPathname: nextState.location.pathname
		}, '/signin');
	}
}

// use username as id, not real user id.
function getUID() {
	return sessionStorage.getItem('uid');
}
function getAccount() {
	return sessionStorage.getItem('uaccount');
}
function setUID(u) {
	sessionStorage.setItem('uaccount', u);
	sessionStorage.setItem('uid', toUnicode(u) + _random(1000, 9999));
}
function removeUID() {
	sessionStorage.removeItem('uaccount');
	sessionStorage.removeItem('uid');
}
function isSignedIn() {
	var u = sessionStorage.getItem('uid');
	var ureg = /[\d]{4}$/;
	if (u !== null && ureg.test(u)) {
		return true;
	}
	return false;
}

function getCurrency() {
	return config.currency;
}

function getDisplayPrice(p) {
	return configFunctions.getDisplayPrice(p);
}

function ajaxAuth() {
	return function(req) {
		req.on('response', function(res) {
			if (res.status === 401) {
				removeUID();
				window.location = '/signin';
			}
		});
	};
}

function ajaxLoading() {
	return function(req) {
		req.once('request', function() {
			if (document.getElementById('ck-loading') !== null && document.getElementById('ck-container') !== null) {
				document.getElementById('ck-loading').style.display = 'block';
				document.getElementById('ck-container').style.webkitFilter = 'blur(5px)';
			}
		});

		req.once('end', function() {
			if (document.getElementById('ck-loading') !== null && document.getElementById('ck-container') !== null) {
				document.getElementById('ck-loading').style.display = 'none';
				document.getElementById('ck-container').style.webkitFilter = 'none';
			}
		});
	};
}

function getStoreAddress() {
	return config.store_address;
}

function getStoreHotline() {
	return config.store_hotline;
}

(function() {
	setCookie('language', config.language, Infinity);
})();

var CKFM = {
	getAccount: getAccount,
	getCookie: getCookie,
	setCookie: setCookie,
	getToken: getToken,
	redirectToSignin: redirectToSignin,
	isSignedIn: isSignedIn,
	getUID: getUID,
	setUID: setUID,
	removeUID: removeUID,
	getCurrency: getCurrency,
	getDisplayPrice: getDisplayPrice,
	getStoreAddress: getStoreAddress,
	getStoreHotline: getStoreHotline,
	ajaxAuth: ajaxAuth,
	ajaxLoading: ajaxLoading
};


module.exports = CKFM;
