require('../../less/ck-radio.less');
var React = require('react');

var CkRadio = React.createClass({
	propTypes: {
		name: React.PropTypes.string,
		text: React.PropTypes.string,
		defaultChecked: React.PropTypes.bool,
		disabled: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		value: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			name: 'checkbox',
			text: '',
			defaultChecked: false
		};
	},

	render: function() {
		return (
			<div className="ck-radio">
				<label>
					<input
						type="radio"
						name={this.props.name}
						ref="r"
						defaultChecked={this.props.defaultChecked}
						onChange={this._checkboxChange}
						disabled={this.props.disabled}
						value={this.props.value}/>
					<span className="icons">
						<span className="icon-checked-o icon-true"></span>
						<span className="icon-circle-o icon-false"></span>
					</span>
					{this.props.text.length > 0 ?
					<span className="ck-radio-text">{this.props.text}</span> : null
					}
				</label>

			</div>
			);
	},

	_checkboxChange: function(e) {
		var cb = this.props.onChange;
		if (cb && typeof cb === 'function') {
			this.props.onChange(e, this.refs.r.checked);
		}
	}
});

module.exports = CkRadio;
