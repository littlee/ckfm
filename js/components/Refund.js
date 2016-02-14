var React = require('react');

var Refund = React.createClass({

	render: function() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Refund;