var React = require('react');

var Header = require('./Header.js');

var NotFound = React.createClass({

	render: function() {
		var s = {
			marginTop: '50px',
			textAlign: 'center'
		};
		return (
			<div className="row">
				<div className="col-xs-12">
					<Header/>
				</div>
				<div style={s}>
					<h1>404 Not Found</h1>
				</div>
			</div>
			);
	}
});

module.exports = NotFound;