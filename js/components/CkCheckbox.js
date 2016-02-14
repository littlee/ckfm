require('../../less/ck-checkbox.less');
var React = require('react');

var CkCheckbox = React.createClass({
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
			<div className="ck-checkbox">
				<label>
					<input 
						type="checkbox"
						name={this.props.name}
						ref="c" 
						defaultChecked={this.props.defaultChecked}
						onChange={this._checkboxChange}
						checked={this.props.checked}
						disabled={this.props.disabled}
						value={this.props.value}/>
					<span className="icons">
						<span className="icon-checked-o icon-true"></span>
						<span className="icon-circle-o icon-false"></span>
					</span>
					{this.props.text.length > 0 ?
					<span className="ck-checkbox-text">{this.props.text}</span> : null
					}
				</label>
			</div>
			);
	},

	_checkboxChange: function(e) {
		var cb = this.props.onChange;
		if (cb && typeof cb === 'function') {
			this.props.onChange(e, this.refs.c.checked);
		}
	}
});

module.exports = CkCheckbox;