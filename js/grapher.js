function Grapher() {
	this.loaded = false;
}

Grapher.prototype.load = function() {
	//Let's make some graphs. 
	// Load the Visualization API and the piechart package.
	var _this = this;
	setTimeout(function() {
		google.load('visualization', '1', {
			'callback': 'Builder.grapher.onLoad()',
			'packages': ['corechart']
		});
		_this.loaded = true;
	}, 2000);
	// Callback that creates and populates a data table,
	// instantiates the pie chart, passes in the data and
	// draws it. 
};

Grapher.prototype.onLoad = function() {
	this.loaded = true;
	this.calculate();
};

Grapher.prototype.calculate = function() {
	//recalculate and render the values of the graphs

	if (this.loaded && $('#graphs').length > 0) {
		//Colors breakdown
		var arr = [];
		for (var i = 0; i < 5; i++) {
			arr[i] = 0;
		}
		Builder.layers.mainBoard.getChildren().each(function(node, index) {
			if (node.cardData.cost.indexOf("W") !== -1) {
				arr[0] += 1;
			}
			if (node.cardData.cost.indexOf("U") !== -1) {
				arr[1] += 1;
			}
			if (node.cardData.cost.indexOf("B") !== -1) {
				arr[2] += 1;
			}
			if (node.cardData.cost.indexOf("R") !== -1) {
				arr[3] += 1;
			}
			if (node.cardData.cost.indexOf("G") !== -1) {
				arr[4] += 1;
			}
		});

		// Create the data table.
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Color');
		data.addColumn('number', 'Amount');
		data.addRows([
			['White', arr[0]],
			['Blue', arr[1]],
			['Black', arr[2]],
			['Red', arr[3]],
			['Green', arr[4]]
		]);

		// Set chart options
		var options = {
			'title': 'Mana Colors',
			'width': 400,
			'height': 300,
			'colors': ['#faebd7', 'blue', 'black', 'red', 'green']
		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.PieChart(document.getElementById('graphs'));
		chart.draw(data, options);
	}
	// Load the Visualization API and the piechart package.



}

Grapher.prototype.render = function() {

}