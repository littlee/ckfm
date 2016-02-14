var path = require('path');
var webpack = require('webpack');
var I18nPlugin = require('i18n-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var languages = {
	'en_US': null,
	'zh_CN': require('./js/i18n/zh_CN.json'),
	'vi_VN': require('./js/i18n/vi_VN.json')
};

var config = require('./__config__.json');

module.exports = Object.keys(languages).map(function(language) {
	return {
		name: language,
		entry: './js/app.js',
		output: {
			path: path.join(__dirname, 'build'),
			filename: language + '.bundle.js',
			publicPath: '/build/'
		},
		module: {
			loaders: [{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader', {
					publicPath: './'
				})
			}, {
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?v=[\d.]+)?(\?[a-z0-9#-]+)?$/,
				loader: 'file-loader'
			}, {
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader?limit=8192'
			}, {
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				}
			}]
		},
		plugins: [
			new I18nPlugin(
				languages[language]
			),
			new ExtractTextPlugin('bundle.css'),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoErrorsPlugin(),
			new HtmlWebpackPlugin({
				inject: false,
				title: config.html_title,
				language: config.language,
				version: new Date().getTime(),
				template: 'index.ejs',
				filename: '../index.html'
			})
		]
	};
});