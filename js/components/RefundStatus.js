require('../../less/refund-status.less');
var React = require('react');

var refundStatusMap = {
	'1':__('apply for refund'),
	'2':__('refund handling'),
	'last':__('refund success')
};

var returnStatusMap = {
	'1':__('apply for return refund'),
	'2':__('return handling'),
	'3':__('refund handling'),
	'last':__('return success')
};

var statusActiveMap = {
	'begin':'1',
	'apply': '2',
	'success':'last',
	'closed':'last',
	'reject':'2',
	'returnAgree':'2',
	'reception':'3'
};

var RefundStatus = React.createClass({

	propTypes: {
		type: React.PropTypes.string,
		status: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			type: 'refund',
			status:'begin'
		};
	},

	render: function() {
		var map = this.props.type === 'refund' ? refundStatusMap : returnStatusMap;
		var item = []; 
		var nowS =  statusActiveMap[this.props.status];
		var isPrev = true;

		Object.keys(map).forEach(function(s, i) {
			item.push(
				<div className={isPrev?"refund-status-item-active":"refund-status-item"} key={i} style = {{width: 100/Object.keys(map).length +'%'}}>
					<div className="refund-status-circle">{i+1}</div>
					<div className="refund-status-font">{map[s]}</div>
				</div>
			);
			if(nowS == s){
				isPrev = false;
			}
		});		

		return (
			<div className="refund-status">
				
				{item}
				<div className="refund-status-line" style = {{width: 100 - 100/Object.keys(map).length +'%'}}>
					<div className="refund-status-line-item"></div>
				</div>
			</div>
			);
	}
});

module.exports = RefundStatus;