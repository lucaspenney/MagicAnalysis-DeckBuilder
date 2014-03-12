function Grapher() {
	$.jqplot.config.enablePlugins = true;
	this.manaCostGraph = {
		plot: null,
		data: [
			[4, 5],
			[2, 3]
		],
		options: {
			title: 'Some Plot',
			seriesDefaults: {
				renderer: $.jqplot.BarRenderer,
				rendererOptions: {
					barPadding: 1,
					barMargin: 15,
					barDirection: 'vertical',
					barWidth: 50
				}
			},
			axes: {
				xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					ticks: 10
				},
				yaxis: {
					tickOptions: {
						formatString: '$%.2f'
					}
				}
			},
		}
	};
}

Grapher.prototype.load = function() {
	//Let's make some graphs. 
	//Graphs created by jqPlot
	this.manaCostGraph.plot = $.jqplot('graphs', [this.manaCostGraph.data], this.manaCostGraph.options);
};

Grapher.prototype.calculate = function() {
	//Recalculate the values of the graphs
	var arr = [];
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		arr.push(node);
	});

	var allValues = [];
	var values = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === undefined) continue;
		if (arr[i].cardData === undefined) continue;
		if (arr[i].cardData.cost === undefined) continue;

		//Todo: Clean up this ugly parsing of the converted cost (separate db field please)
		var costStr = arr[i].cardData.cost;
		var cost = costStr.substr(costStr.indexOf('('), costStr.indexOf(')'));
		cost = cost.replace("(", "");
		cost = cost.replace(")", "");
		cost = cost.replace(/ /g, '');
		cost = parseInt(cost);
		if (arr[i].cardData.cost === '') cost = 0; //Land
		arr[i].cardData.convertedCost = cost;
		allValues.push(cost);
	}
	values = allValues.filter(function(elem, pos) {
		return allValues.indexOf(elem) == pos;
	});
	values.sort(function(a, b) {
		return a - b;
	});

	//Create sorted 2d array
	var sorted = [];
	for (var i = 0; i < values.length; i++) {
		sorted[i] = [];
	}
	for (var i = 0; i < arr.length; i++) {
		var index = values.indexOf(arr[i].cardData.convertedCost);
		sorted[index]++;
	}

	console.log(sorted);
	if (sorted.length > 1) {
		//this.manaCostGraph = sorted;
	} else return;

	//Redraw them
	this.render();
}

Grapher.prototype.render = function() {
	if (this.manaCostGraph.plot) {
		//this.manaCostGraph.plot.destroy();
		//$.jqplot('graphs', [this.manaCostGraph.data], this.manaCostGraph.options);
	}
}