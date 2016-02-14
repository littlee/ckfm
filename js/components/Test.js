var React = require('react');
var Modal = require('react-modal');

var ShareModal = React.createClass({
	propTypes: {
		isOpen: React.PropTypes.bool,
		onRequestClose: React.PropTypes.func
	},

	render: function() {
		var mStyle = {
			overlay: {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.75)'
			},
			content: {
				position: 'absolute',
				top: '20px',
				left: '20px',
				right: '20px',
				bottom: 'auto',
				border: '1px solid #ccc',
				background: '#fff',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: 0,
				outline: 'none',
				padding: '20px'

			}
		};
		return (
			<Modal
				isOpen={this.props.isOpen}
				onRequestClose={this.props.onRequestClose}
				style={mStyle}>
				<h3>{__('share')}</h3>
				<div className="share-modal">
					<a target="_blank" href={'http://www.facebook.com/share.php?u=' + window.location.href}>
						<span className="icon-facebook" />
					</a>
					<a target="_blank" href={'https://plus.google.com/share?url=' + window.location.href}>
						<span className="icon-google-plus" />
					</a>
				</div>
			</Modal>
			);
	}
});

var Test = React.createClass({
	getInitialState: function() {
		return {
			modalIsOpen: false
		};
	},

	render: function() {
		return (
			<div>
				<button type="button" onClick={this._openModal}>
					share
				</button>

				<ShareModal
			isOpen={this.state.modalIsOpen}
			onRequestClose={this._closeModal}/>
			</div>
			);
	},

	_openModal: function() {
		this.setState({
			modalIsOpen: true
		});
	},

	_closeModal: function() {
		this.setState({
			modalIsOpen: false
		});
	}
});

module.exports = Test;