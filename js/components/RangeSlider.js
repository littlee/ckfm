require('../../less/range-slider.less');

var React = require('react');
var assign = require('lodash/object/assign.js');
var History = require('react-router').History;
var ReactDOM = require('react-dom');
var StarScore = require('./StarScore.js');

var ValueBox = React.createClass({
	render: function() {
		var type = this.props.valueType;
		var valueShow = [];
		if (type === 'value') {
			valueShow = [];
			valueShow.push(
				<div key={type}>
					<span ref="leftValue" className="range-slider-left-value">{this.props.leftValue}</span>
					<span ref="rightValue" className="range-slider-right-value">{this.props.rightValue}</span>
				</div>
			);
		} else if (type === 'star') {
			var leftScore = this.props.leftValue;
			var rightScore = this.props.rightValue;
			valueShow = [];
			valueShow.push(
				<div key={type} className="range-slider-star">
					<span ref="leftValue" className="range-slider-left-star">
						<StarScore score={leftScore} />
					</span>
					<span ref="rightValue" className="range-slider-right-star">
						<StarScore score={rightScore} />
					</span>
				</div>
			);
		}
		return (
			<div className="range-slider-show-value">
				{valueShow}
			</div>
			);
	}
});

var RangeSlider = React.createClass({

	propTypes: {
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		step: React.PropTypes.number,
		leftValue: React.PropTypes.number,
		rightValue: React.PropTypes.number,
		showValue: React.PropTypes.bool,
		valueType: React.PropTypes.string
	},

	mixins: [History],

	getInitialState: function() {
		return {
			leftValue: this.props.leftValue,
			rightValue: this.props.rightValue
		};
	},

	getDefaultProps: function() {
		return {
			min: 0,
			max: 100,
			step: 1,
			leftValue: 10,
			rightValue: 60,
			showValue: true,
			valueType: "value",
			handleWidth: 24
		};
	},

	_hasClass: function(elem, cls) {
		cls = cls || '';
		if (cls.replace(/\s/g, '').length == 0) return false;
		return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
	},

	_getRangeSliderWidth: function() {
		var rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
		return rect.width;
	},

	_initFilledSliderPosition: function() {
		var positionLeft = this._getLeftPosition();
		var positionWidth = this._getRightPosition() - this._getLeftPosition();
		return {
			width: positionWidth,
			left: positionLeft
		}
	},

	_getLeftPosition: function() {
		return this.valueToPx(this.props.leftValue);
	},

	_getRightPosition: function() {
		return this.valueToPx(this.props.rightValue);
	},

	valueToPx: function(value) {
		return (value - this.props.min) * (this._getRangeSliderWidth() / (this.props.max - this.props.min));
	},

	pxToValue: function(px) {
		return px * (this.props.max - this.props.min) / this._getRangeSliderWidth() + this.props.min
	},

	componentDidMount: function() {
		var leftHandlePostion = this._getLeftPosition();
		var rightHandlePostion = this._getRightPosition() - this.props.handleWidth;
		ReactDOM.findDOMNode(this.refs.handlerLeft).style.left = leftHandlePostion + 'px';
		ReactDOM.findDOMNode(this.refs.handlerRight).style.left = rightHandlePostion + 'px';

		var filledPosition = this._initFilledSliderPosition();
		ReactDOM.findDOMNode(this.refs.filledRange).style.left = filledPosition.left + 'px';
		ReactDOM.findDOMNode(this.refs.filledRange).style.width = filledPosition.width + 'px';
	},

	change: function(pos) {
		var isRightHandle = this._hasClass(this.dom.dom, 'range-slider-handler-right');
		var isLeftHandle = this._hasClass(this.dom.dom, 'range-slider-handler-left');
		this.dom.dom.style.left = pos.left + 'px';


		var rightHandlePostion = parseFloat(ReactDOM.findDOMNode(this.refs.handlerRight).style.left);
		var leftHandlePostion = parseFloat(ReactDOM.findDOMNode(this.refs.handlerLeft).style.left);

		// 判断是否超过另一个handle
		if (isRightHandle) {
			if (pos.left < (leftHandlePostion + this.props.handleWidth)) {
				pos.left = leftHandlePostion + this.props.handleWidth;
				this.dom.dom.style.left = pos.left + 'px';
			}
			this.setState({
				rightValue: Math.round(this.pxToValue(pos.left + this.props.handleWidth) * this.props.step)
			});
			ReactDOM.findDOMNode(this.refs.filledRange).style.width = pos.left - leftHandlePostion + this.props.handleWidth + 'px';
		}
		if (isLeftHandle) {
			if (pos.left > (rightHandlePostion - this.props.handleWidth)) {
				pos.left = rightHandlePostion - this.props.handleWidth;
				this.dom.dom.style.left = pos.left + 'px';
			}
			this.setState({
				leftValue: Math.round(this.pxToValue(pos.left) * this.props.step)
			});
			ReactDOM.findDOMNode(this.refs.filledRange).style.left = pos.left + 'px';
			ReactDOM.findDOMNode(this.refs.filledRange).style.width = rightHandlePostion - pos.left + 'px';
		}
	},

	/**
	* 获取触摸点位置
	* @param  object e 事件集
	* @return object   返回一个触摸点位置对象
	*/
	getClientPosition: function(e) {
		var touches = e.touches;
		if (touches && touches.length) {
			var finger = touches[0];
			return {
				x: finger.clientX
			};
		}
		return {
			x: e.clientX
		};
	},

	getPos: function(e) {
		var clientPos = this.getClientPosition(e);
		var posX = clientPos.x + this.start.x - this.offset.x; // 修复后的左偏移值
		var rangeWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
		if (posX < 0) {
			posX = 0;
		} else if (posX > (rangeWidth - this.props.handleWidth)) {
			posX = rangeWidth - this.props.handleWidth; // 14为handle的宽度
		}

		return {
			left: posX
		};
	},

	handleDrag: function(e) {
		e.preventDefault();
		this.change(this.getPos(e));
	},

	/**
	 * 拖动结束处理函数，将监听列表清空
	 * @param  {object} e 事件对象
	 * @return {null}   无返回值
	 */
	handleDragEnd: function(e) {
		e.preventDefault();

		var queryItem;

		if (this.props.valueType === 'value') {
			var priceRange = this.state.leftValue + '-' + this.state.rightValue;
			queryItem = {
				price: priceRange
			};
		} else {
			var scoreRange = this.state.leftValue + '-' + this.state.rightValue;
			queryItem = {
				score: scoreRange
			};
		}

		var tempQuery = assign({}, this.props.location.query, queryItem);

		this.history.pushState(null, '/searchresult', tempQuery);

		e.target.removeEventListener('mousemove', this.handleDrag);
		e.target.removeEventListener('mouseup', this.handleDrag);

		e.target.removeEventListener('touchmove', this.handleDrag);
		e.target.removeEventListener('touchend', this.handleDragEnd);
		e.target.removeEventListener('touchcancel', this.handleDragEnd);

	},

	handleMouseDown: function(e) {
		e.preventDefault();
		this._getRangeSliderWidth();
		var dom = ReactDOM.findDOMNode(e.target);
		var clientPos = this.getClientPosition(e);

		this.start = {
			x: dom.offsetLeft,
		};

		this.offset = {
			x: clientPos.x
		};

		this.dom = {
			dom: dom
		};

		e.target.addEventListener('mousemove', this.handleDrag);
		e.target.addEventListener('mouseup', this.handleDragEnd);

		e.target.addEventListener('touchmove', this.handleDrag);
		e.target.addEventListener('touchend', this.handleDragEnd);
		e.target.addEventListener('touchcancel', this.handleDragEnd);
	},

	handleClick: function(e) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
	},

	render: function() {
		return (
			<div className="range-slider-module">
				<div className="range-slider-area">
					<div ref="filledRange" className="range-slider-filled"></div>
					<div onTouchStart={this.handleMouseDown}
						onMouseDown={this.handleMouseDown}
						onClick={this.handleClick}
						ref="handlerLeft"
						className="range-slider-handler-left"></div>
					<div onTouchStart={this.handleMouseDown}
						onMouseDown={this.handleMouseDown}
						onClick={this.handleClick}
						ref="handlerRight"
						className="range-slider-handler-right"></div>
				</div>
				{this.props.showValue ?
				<ValueBox leftValue={this.state.leftValue} rightValue={this.state.rightValue} valueType={this.props.valueType}/>
				: null}
			</div>
			);
	}
});

module.exports = RangeSlider;
