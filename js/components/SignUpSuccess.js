require('../../less/sign-up.less');
var React = require('react');
var Link = require('react-router').Link;

var SignUpSuccess = React.createClass({
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<div className="sign-up-logo">
						<img src="images/logo_dark.png"/>
					</div>

					<div className="sign-up-success">
						<span className="sign-up-success-icon">
							<span className="icon-checked-o"></span>
						</span>
						
						<p>
							{__('congratulations, sign up succeeded')}
						</p>

						<Link to="signin" className="btn btn-primary btn-block btn-rect">
							{__('sign in now')}
						</Link>
					</div>
				</div>
			</div>
			);
	}
});

module.exports = SignUpSuccess;