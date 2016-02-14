var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

var PORT = 3333;

new WebpackDevServer(webpack(config), {
	// change server root?
	// contentBase: '/CKFM',
	publicPath: '/build/',
	hot: true,
	historyApiFallback: true,
	stats: {
		colors: true
	}
	// host: '192.168.0.114'
}).listen(PORT, 'localhost', function(err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(':::Server Running::: ==> localhost:' + PORT);
});