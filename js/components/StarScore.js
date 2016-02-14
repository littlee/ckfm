require('../../less/star-score.less');
var React = require('react');

var StarScore = React.createClass({

	propTypes: {
		score: React.PropTypes.number
	},

	getDefaultProps: function() {
		return {
			score: 5.0
		};
	},

	render: function() {

		var s = {
			width: this._getLightWidth()
		};

		return (
			<div className="star-score">
				<div className="star-score-dark">
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
				</div>
				<div className="star-score-light" style={s}>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
					<span className="icon-star-solid"></span>
				</div>
			</div>
			);
	},

	_getLightWidth: function() {
		return this.props.score / 5 * 100 + '%';
	}
});

module.exports = StarScore;