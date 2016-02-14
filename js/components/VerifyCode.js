var React = require('react');

var VerifyCode = React.createClass({
	propTypes: {
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			t: this.props.t || 0
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			t: nextProps.t
		});
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		if ((nextProps.t && parseInt(nextProps.t) < 0) || (parseInt(nextState.t) < 0)) {
			return false;
		}
		return true;
	},

	render: function() {
		var vStyle = {
			'WebkitAppearance': 'none',
			'MozAppearance': 'none'
		};

		return (
			<div className="form-group">
				<div className="col-xs-7 trim-col">
					<div className="input-group">
						<span className="input-group-addon">
							<span className="icon-vertify-code-o"></span>
						</span>
						<input type="number" className="form-control" placeholder={__('verify code')} name="captcha" required style={vStyle} onChange={this._handleChange}/>
					</div>
				</div>
				<div className="col-xs-5">
					<img src={'/cooka-user-web/captchaImage.do?' + this.state.t} onClick={this._refreshCaptcha}/>
				</div>
			</div>
			);
	},

	_refreshCaptcha: function() {
		this.setState({
			t: new Date().getTime()
		});
	},

	_handleChange: function(e) {
		if (this.props.onChange){
			this.props.onChange(e);
		}
	}
});


module.exports = VerifyCode;