/*
 * Copyright (c) 2017 abas Software AG (http://www.abas.de).
 */

(function () {

	c3.chart.internal.fn.additionalConfig = {
		data_zvalues: {},
		data_bubbleColor: {},
		bubbleradius: {}
	};

	c3.chart.internal.fn.beforeInit = function (config) {
		if (config.data.type !== 'bubble') {
			return;
		}
		var that = this;
		this.config.data_type = 'scatter';
		this.config.data_xSort = false;

		var setBubbleradius = function () {
			// find max of all data series
			var allvalues = [];
			for (var dataSeries in that.config.data_zvalues) {
				allvalues = allvalues.concat(that.config.data_zvalues[dataSeries]['data']);
			}
			var maxvalue = Math.max.apply(Math, allvalues);
			var scalefactor = maxvalue / 50;
			for (var dataSeries in that.config.data_zvalues) {
				var zvalues = that.config.data_zvalues[dataSeries]['data'];
				that.config.bubbleradius[dataSeries] = zvalues.map(function (value) {return value / scalefactor});
			}
		}
		setBubbleradius();

		// that.config.onresize = function ( ) {
		// 	console.log('--------------');
		// 	console.log(this.currentHeight);
		// 	console.log(this.currentWidth);
		// };

		// Set bubble radius callback
		this.config.point_r = function (item) {
			return that.config.bubbleradius[item.id][item.index];
		};

		// Color series handler
		this.config.data_color = function (defaultColor, item) {
			if (that.config.data_bubbleColor[item.id]) {
				var len = that.config.data_bubbleColor[item.id].length;
				return that.config.data_bubbleColor[item.id][item.index % len]
			}
			return defaultColor;
		};

		// Tooltip handler

		this.config.tooltip_contents = function (items, defaultTitleFormat, defaultValueFormat, color) {

			var item = items[0],
				zLabel = this.config.data_zvalues[item.id]['label'],
				zValue = this.config.data_zvalues[item.id]['data'][item.index];

			return "<table class='" + this.CLASS.tooltip + "'>" +
			"<tr><th colspan='2'></th></tr>" +
			"<tr>" +
				"<td class='name'>" +zLabel+"</td>" +
				"<td class='value'>" +zValue+"</td>" +
			"</tr>" +
			"<tr>" +
				"<td class='name'>" +(typeof this.config.axis_x_label === 'string' ? this.config.axis_x_label : 'x') +"</td>" +
				"<td class='value'>" +item.x+"</td>" +
			"</tr>" +
			"<tr>" +
				"<td class='name'>" +(typeof this.config.axis_y_label === 'string' ? this.config.axis_y_label : 'y') +"</td>" +
				"<td class='value'>" +item.value+"</td>" +
			"</tr>" +
			"</table>";
		};
	};

})(window);