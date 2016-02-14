require('../../less/share-modal.less');
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
				backgroundColor: 'rgba(0, 0, 0, 0.75)',
				zIndex: 999
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
				padding: '10px'

			}
		};
		return (
			<Modal
				isOpen={this.props.isOpen}
				onRequestClose={this.props.onRequestClose}
				style={mStyle}>
					<div className="share-modal">
						<h3 className="share-modal-title">{__('share')}</h3>
						<div className="share-modal-links">
							<a target="_blank" href={'http://www.facebook.com/share.php?u=' + window.location.href} className="share-modal-link share-modal-facebook">
								<span className="icon-facebook" />
							</a>
							<a target="_blank" href={'https://plus.google.com/share?url=' + window.location.href} className="share-modal-link share-modal-google">
								<span className="icon-google-plus" />
							</a>
						</div>
					</div>
			</Modal>
			);
	}
});

module.exports = ShareModal;