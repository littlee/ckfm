var fs = require('fs');
var xlsx = require('node-xlsx');
var lodash = require('lodash');

var zhData = require('./zh_CN.json');
var viData = require('./vi_VN.json');

function sortJSON(input) {
	var output = {};
	Object.keys(input).sort().forEach(function(key) {
		output[key] = input[key];
	});
	return output;
}

var trData = xlsx.parse('./translate_20160126.xlsx')[0].data;

var trZH = {};
trData.forEach(function(item) {
	trZH[item[0]] = item[1];
});

var trVI = {};
trData.forEach(function(item) {
	trVI[item[0]] = item[2];
});

var comZH = lodash.assign({}, zhData, trZH);
var comVI = lodash.assign({}, viData, trVI);

comZH = sortJSON(comZH);
comVI = sortJSON(comVI);

var bufferArr = [];
Object.keys(comZH).forEach(function(key) {
	bufferArr.push([key, comZH[key], (comVI[key] ? comVI[key] : '')]);
});
var buffer = xlsx.build([{name: '翻译', data: bufferArr}]);

fs.writeFile('./translate_' + new Date().getTime() + '.xlsx', buffer, function(err) {
	if (err) {
		throw err;
	}
	console.log('translate file generated');
});