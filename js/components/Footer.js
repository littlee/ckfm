require('../../less/footer.less');
var React = require('react');

var Footer = React.createClass({

	getInitialState: function() {
		return {
			position: 'static'
		};
	},

	componentDidMount: function() {
		// if (window.innerHeight - document.body.clientHeight > 50) {
		// 	this.setState({
		// 		position: 'fixed'
		// 	});
		// }
	},

	render: function() {
		return (
			<div className="footer" id="footer" style={{
				position: this.state.position
			}}>
				&copy; 2015 Cookabuy All Rights Reserved.
			</div>
			);
	}
});

module.exports = Footer;