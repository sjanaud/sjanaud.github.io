/**
 * Create ohlc stock view
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewStockOHLC(container, width, height) {

	//view
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		west : 80,
		south : 80,
	});


	//date range
	var startDate = new Date(2013, 09, 01);
	var endDate = new Date(2013, 11, 01);

	var proj1 = new JenScript.TimeXProjection({
		cornerRadius : 6,
		name : "proj1",
		minXDate : startDate,
		maxXDate : endDate,
		minY : 19,
		maxY : 24
	});
	view.registerProjection(proj1);
	
	//device outline
	var outline = new JenScript.DeviceOutlinePlugin({color : 'black'});
	proj1.registerPlugin(outline);

	minor = {
		tickMarkerSize : 2,
		tickMarkerColor : 'green',
		tickMarkerStroke : 1
	};
	median = {
		tickMarkerSize : 4,
		tickMarkerColor : 'yellow',
		tickMarkerStroke : 1.2,
		tickTextColor : 'orange',
		tickTextFontSize : 10
	};
	major = {
		tickMarkerSize : 8,
		tickMarkerColor : 'pink',
		tickMarkerStroke : 3,
		tickTextColor : 'pink',
		tickTextFontSize : 12,
		tickTextOffset : 16
	};
	var southMetrics1 = new JenScript.AxisMetricsTiming({
		axis : JenScript.Axis.AxisSouth,
		models : [new JenScript.HourModel({}),new JenScript.DayModel({}),new JenScript.MonthModel({})],
		minor : minor,
		median : median,
		major:major
	});
	proj1.registerPlugin(southMetrics1);
	
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor : minor,
		median : median,
		major:major
	});
	proj1.registerPlugin(westMetrics);

	

	var stockPlugin = new JenScript.StockPlugin({
		//not required in OHLC
		bearishColor : JenScript.RosePalette.CORALRED,
		bullishColor : JenScript.RosePalette.EMERALD,

	});
	proj1.registerPlugin(stockPlugin);

	stockPlugin.addLayer(new JenScript.OhlcLayer({
		markerColor : 'cyan',
		markerWidth : 1.5
	}));
	
	var tx1 = new JenScript.TranslatePlugin({
		slaves : [
		          	{plugin : stockPlugin, direction : 'xy'},
		          ]
	});
	proj1.registerPlugin(tx1);
	var tpad = new JenScript.TranslatePad();
	tx1.registerWidget(tpad);
	tx1.registerWidget(new JenScript.TranslateCompassWidget({
		ringFillColor : 'yellow'
	}));
	tx1.select();
	
	var legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'SLV Fixing',
		fontSize : 14,
		textColor : 'cyan',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj1.registerPlugin(legend);

	
	var loader = new StockLoader(proj1,[2013,2014],function(year,stocks){
		stockPlugin.setStocks(stocks);
	});

}