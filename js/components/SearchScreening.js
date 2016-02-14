require('../../less/search-screening.less');

var keys = require('lodash/object/keys.js');
var Link = require('react-router').Link;
var React = require('react');
var assign = require('lodash/object/assign.js');
var History = require('react-router').History;
var RangeSlider = require('./RangeSlider.js');

var ScreeningBtn = React.createClass({
	render: function() {
		return (
			<div className="col-xs-3 trim-col">
				<div className="search-screening-btn" onClick={this.props.handleClick}>
					<span className="icon-filter search-screening-icon"></span>
					<span className="search-screening-btn-text">商品筛选</span>
				</div>
			</div>
			);
	}
});

var ScreeningResultText = React.createClass({
	render: function() {
		var resultAmount = this.props.resultAmount;
		var activeItems = this.props.activeItems;

		var selectedCondition = [];

		if (activeItems) {
			for (var key in activeItems) {
				var type = typeof activeItems[key];
				if (type === 'string') {
					selectedCondition.push(
						<span className="selected-condition-label" key={activeItems[key]}>{activeItems[key]}</span>
					);
				} else if (type === 'number') {
					var categories = this.props.searchCondition.categories.slice();
					categories.shift();
					var targetName = function(element) {
						if ((typeof element) === 'object') {
							if (element.categoryId === activeItems[key]) {
								return element;
							}
						} else {
							alert(__('unknown error'));
						}
					};
					var targetObj = categories.filter(targetName)[0];
					selectedCondition.push(
						<span className="selected-condition-label" key={activeItems[key]}>{targetObj.name}</span>
					);
				} else if (type === 'object' && activeItems[key]) {
					// 目前只使用该条件路径
					var icon = [];
					if (key === 'price') {
						icon.push(
							<span className="icon-coin" key={key}></span>
						);
					} else if (key === 'score') {
						icon.push(
							<span className="icon-star-solid" key={key}></span>
						);
					}
					var range = activeItems[key].slice();
					range.shift();
					selectedCondition.push(
						<span className="selected-condition-label" key={activeItems[key]}>{icon}{range.join('-')}</span>
					);
				}
			}
		} else {
			selectedCondition.push('loading');
		}
		return (
			<div className="col-xs-9">
				<h5 className="search-screening-result-text">{__('total found')} <span className="search-screening-amount">{resultAmount}</span> {__('relatived products')}</h5>
				<p className="search-screening-condition-text">{__('screening condition')}: {selectedCondition}</p>
			</div>
			);
	}
});

var LabelType = React.createClass({
	render: function() {
		var label = this.props.label;
		var linkQuery = this.props.linkQuery;
		var isCategory = false;
		var categoryId = null;
		var queryItem = {};

		var location = this.props.location.query;

		if (this.props.categoryId) {
			isCategory = true;
			categoryId = this.props.categoryId;
			queryItem[linkQuery] = categoryId;
		} else {
			isCategory = false;
			queryItem[linkQuery] = label;
		}
		return (
		isCategory ?
			<Link to={`/searchresult`} query={assign({}, location, queryItem)} className="search-screening-item-label" activeClassName="active" data-categoryid={categoryId}>{label}</Link> :
			<Link to={`/searchresult`} query={assign({}, location, queryItem)} className="search-screening-item-label" activeClassName="active">{label}</Link>
		);
	}
});

/**
 * ScreeningItem 返回一个筛选项组件
 * @param  {String} 	this.props.itemName		筛选项名称
 * @param  {Array}		this.props.itemContent	筛选器内容
 * @return {React.component}          返回一个React组件
 */
var ScreeningItem = React.createClass({
	getInitialState: function() {
		return {
			open: true
		};
	},
	handleClick: function() {
		this.setState({
			open: !this.state.open
		});
	},
	render: function() {
		var itemName = this.props.itemName;
		var itemContent = this.props.itemContent;
		return (
			<div className="col-xs-12 search-screening-item">
				<h5 className="search-screening-item-title" onClick={this.handleClick}>
					{itemName}
					{this.state.open ? <span className="glyphicon glyphicon-triangle-bottom"></span> : <span className="glyphicon glyphicon-triangle-right"></span>}
				</h5>
				{this.state.open ? itemContent : null}
			</div>
			);
	}
});

var ScreeningItems = React.createClass({
	render: function() {
		var screeningItems = []; // 存储搜索项
		var searchCondition = this.props.searchCondition;
		var activeItems = this.props.searchCondition.activeItems;

		var location = this.props.location;

		// 所有筛选器名称
		var _screeningItemName = keys(searchCondition);
		// 删除 搜索结果数量，激活筛选项，筛选器开关
		for (var i = 0; i < 3; i++) {
			_screeningItemName.pop();
		}

		var content = []; // 存储所有筛选器的内容

		for (var key in searchCondition) {
			if (key !== 'resultAmount' && key !== 'activeItems' && key !== 'screeningState') {
				/**
				 * 数组的一个元素为渲染类型，并根据该类型进行渲染。
				 * 0 为 范围选择
				 * 1 为 标签
				 * @param  {Number} searchCondition[key][0] 渲染类型
				 * @return {Array}                          返回ReactElement
				 */
				switch (searchCondition[key][0]) {
					case 0:
						var min = searchCondition[key][1];
						var max = searchCondition[key][2];
						if (key === "price") {
							var activePrice = [];
							if (activeItems.hasOwnProperty(key)) {
								activePrice = activeItems[key];
								var range = activePrice.slice();
								range.shift();
							}
							content.push(
								<RangeSlider min={min} max={max} leftValue={range[0]} rightValue={range[1]} location={this.props.location}/>
							);
						} else if (key === 'score') {
							var step = 1;
							var valueType = "star";
							var activeScore = []
							if (activeItems.hasOwnProperty(key)) {
								activeScore = activeItems[key];
								var range = activeScore.slice();
								range.shift();
							}
							content.push(
								<RangeSlider min={min} max={max} leftValue={range[0]} rightValue={range[1]} step={step} valueType={valueType} location={this.props.location}/>
							);
						}
						break;
					case 1:
						var innerContent = [];
						var activeItem = activeItems[key];
						if (key !== 'categories') {
							searchCondition[key].forEach(function(label, index) {
								if (index !== 0) {
									var isActiveItem = false;
									if (activeItem === label) {
										isActiveItem = true;
									}
									innerContent.push(
										<LabelType key={index - 1} label={label} isActiveItem={isActiveItem} linkQuery={key} location={location}/>
									);
								}
							});
						} else {
							searchCondition[key].forEach(function(label, index) {
								if (index !== 0) {
									var name = searchCondition[key][index].name;
									var categoryId = searchCondition[key][index].categoryId;
									var isActiveItem = false;
									if (activeItem === name) {
										isActiveItem = true;
									}
									innerContent.push(
										<LabelType key={index - 1} label={name} categoryId={categoryId} isActiveItem={isActiveItem} linkQuery={key} location={location}/>
									);
								}
							});
						}
						content.push(
							<div className="search-screening-item-content" key={key}>
								{innerContent}
							</div>
						);
						break;
					default:
				}
			}
		}
		_screeningItemName.forEach(function(itemName, index) {
			screeningItems.push(
				<ScreeningItem key={index} itemName={itemName} itemContent={content[index]}/>
			);
		});

		return (
			<div>
					{screeningItems}
			</div>
			);
	}
});

var ScreeningItemBoxs = React.createClass({
	render: function() {
		var searchCondition = this.props.searchCondition;
		return (
			<div className="col-xs-12 search-screening-item-box">
				<ScreeningItems searchCondition={searchCondition} location={this.props.location}/>
				<div className="col-xs-12 search-screening-clear-condition">
					<Link to={`searchresult`} className="search-screening-clear-btn">{__('clear all items')}</Link>
				</div>
			</div>
			);
	}
});

var SearchScreening = React.createClass({
	mixins: [History],

	handleClick: function() {
		var newScreeningState;
		if (this.props.searchCondition.screeningState === false) {
			newScreeningState = true;
		} else {
			newScreeningState = false;
		}

		var queryItem = {
			screeningState: newScreeningState
		};

		var tempQuery = assign({}, this.props.location.query, queryItem);

		this.history.pushState(null, '/searchresult', tempQuery);
	},

	render: function() {
		return (
			<div className="search-screening-module">
				<div className="col-xs-12 trim-col">
					<ScreeningBtn handleClick={this.handleClick}/>
					<ScreeningResultText activeItems={this.props.searchCondition.activeItems} resultAmount={this.props.searchCondition.resultAmount}/>
				</div>
				{this.props.searchCondition.screeningState ? <ScreeningItemBoxs searchCondition={this.props.searchCondition} location={this.props.location}/> : null}
			</div>
			);
	}

});

module.exports = SearchScreening;
