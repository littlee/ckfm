require('../../less/loading.less');
var React = require('react');

var Loading = React.createClass({
	render: function() {
		return (
			<div className="loading-overlay" id="ck-loading">
				<div className="loading-spinner">
					<div className="rect rect1"></div>
					<div className="rect rect2"></div>
					<div className="rect rect3"></div>
					<div className="rect rect4"></div>
					<div className="rect rect5"></div>
				</div>
			</div>
			);
	}
});

module.exports = Loading;