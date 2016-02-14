require('../../less/sequence-btn.less');

var Link = require('react-router').Link;
var React = require('react');
var assign = require('lodash/object/assign.js');
var History = require('react-router').History;

var SequenceBtn = React.createClass({
	mixins: [ History ],
	getDefaultProps: function() {
		return {
			activeBtn: 'default',
			btn: ['default', 'latest', 'price'],
			showType: 'line'
		};
	},

	_getWindowWidth: function() {
		return document.body.clientWidth;
	},

	_setSequenceItemWidth: function() {
		return (this._getWindowWidth() - 40 ) / 3 + 'px';	// 40 为最后一个按钮的宽度
	},

	render: function() {
		var _btnWidth = {
			width: this._setSequenceItemWidth()
		};

		var btn = this.props.btn;

		/**
		 * btn 种类
		 * `default`: 默认
		 * `latest`: 最新
		 * `priceDowm`: 价格从高到低
		 * `priceUp`: 价格从低到高
		 */

		var activeBtn = this.props.activeBtn;

		var location = this.props.location;

		var btnMap = {
			'default': __('default'),
			'latest': __('latest'),
			'price': __('price')
		};

		var _btns = btn.map(function(item, index){
			var isActiveBtn = (activeBtn.indexOf(item));
			var queryItem = {};

			queryItem.sequence = item;

			if (item === 'price') {
				var state = 'Up';
				if (isActiveBtn !== -1) {
					state = activeBtn.substr(5);
				}
				queryItem.sequence = item + state;

				return (
					<Link to={`/searchresult`} query={assign({}, location.query, queryItem)} key={index} className="sequence-btn" activeClassName="active" style={_btnWidth}>
							{btnMap[item]} {state === 'Up' ? <span className="sequence-btn-state icon-sort-desc"></span> : <span className="sequence-btn-state icon-sort-asce"></span>}
					</Link>
				);
			}

			return (
				<Link to={`/searchresult`} query={assign({}, location.query, queryItem)} key={index} className="sequence-btn" activeClassName="active" style={_btnWidth}>
						{btnMap[item]}
				</Link>
			);
		});

		return (
			<div className="sequence-btn-group">
				{_btns}
				{this.props.showType === 'grid'
					?
					<span onClick={this.props.showTypeBtnClick} className="sequence-btn sequence-btn-grid">
						<span className="icon-grid-sort"></span>
					</span>
					:
					<span onClick={this.props.showTypeBtnClick} className="sequence-btn sequence-btn-line">
						<span className="icon-line-sort"></span>
					</span>
				}
			</div>
		);
	}
});

module.exports = SequenceBtn;
