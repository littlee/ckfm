var React = require('react');
var Footer = require('./Footer.js');
var Loading = require('./Loading.js');
var App = React.createClass({
	render: function() {
		return (
			<div>
				<div id="ck-container">
					<div className="container-fluid">
						{this.props.children}
					</div>
					<Footer />
				</div>
				<Loading />
			</div>
			);
	}
});
module.exports = App;