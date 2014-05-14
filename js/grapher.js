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
	}, 1000);
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
	if (!google) return;
	if (!google.visualization) return;
	if (this.loaded && google.visualization.DataTable !== undefined) {
		this.calculateCardColorData();
		this.calculateManaCostData();
		this.calculateCardTypeData();
	}
};

Grapher.prototype.calculateCardTypeData = function() {
	var types = [];
	for (var i = 0; i < 7; i++) {
		types[i] = [];
		types[i][1] = 0;
	}
	types[0][0] = "Creature";
	types[1][0] = "Sorcery";
	types[2][0] = "Land";
	types[3][0] = "Enchant";
	types[4][0] = "Instant";
	types[5][0] = "Planeswalker";
	types[6][0] = "Artifact";
	for (var i = 0; i < Builder.cards.length; i++) {
		node = Builder.cards[i];
		if (node.cardData.type.contains("creature") || node.cardData.type.contains("summon")) types[0][1]++;
		else if (node.cardData.type.contains("sorcery")) types[1][1]++;
		else if (node.cardData.type.contains("land")) types[2][1]++;
		else if (node.cardData.type.contains("enchant")) types[3][1]++;
		else if (node.cardData.type.contains("instant")) types[4][1]++;
		else if (node.cardData.type.contains("planeswalker")) types[5][1]++;
		else if (node.cardData.type.contains("artifact")) types[6][1]++;
	}
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Color');
	data.addColumn('number', 'Amount');
	data.addRows(types);

	// Set chart options
	var options = {
		'title': 'Card Type',
		'width': 400,
		'height': 300
		//'colors': ['#faebd7', 'blue', 'black', 'red', 'green']
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('graph3'));
	chart.draw(data, options);
};

Grapher.prototype.calculateCardColorData = function() {
	var arr = [];
	for (var i = 0; i < 5; i++) {
		arr[i] = 0;
	}
	for (var i = 0; i < Builder.cards.length; i++) {
		node = Builder.cards[i];
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
	}
	this.cardColorData = arr;

	//Draw card color pie graph
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
	var chart = new google.visualization.PieChart(document.getElementById('graph1'));
	chart.draw(data, options);
};

Grapher.prototype.calculateManaCostData = function() {

	var arr = [];
	for (var i = 0; i < Builder.cards.length; i++) {
		node = Builder.cards[i];
		arr.push(node);
	}

	var values = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === undefined) continue;
		if (arr[i].cardData === undefined) continue;
		if (arr[i].cardData.cost === undefined) continue;

		var costStr = arr[i].cardData.cost;
		var cost = costStr.substr(costStr.indexOf('('), costStr.indexOf(')'));
		cost = cost.replace("(", "");
		cost = cost.replace(")", "");
		cost = cost.replace(/ /g, '');
		cost = parseInt(cost);
		if (arr[i].cardData.cost === '') cost = 0; //Land
		arr[i].cardData.convertedCost = cost;
		values.push(cost);
	}

	var costs = [];
	for (var i = 0; i < values.length; i++) {
		if (costs[values[i]] === undefined) costs[values[i]] = [];
		costs[values[i]][0] = '' + values[i];
		if (costs[values[i]][1] === undefined) costs[values[i]][1] = 0;
		costs[values[i]][1]++;
	}
	//Remove undefined array indexes
	costs = costs.filter(function(n) {
		return n != undefined
	});

	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Color');
	data.addColumn('number', 'Amount');
	data.addRows(costs);

	// Set chart options
	var options = {
		'title': 'Mana Cost Distribution',
		'vAxis': {
			'title': 'Cards'
		},
		'hAxis': {
			'title': 'Mana Cost'
		},
		'legend': {
			'position': "none"
		},
		'width': 400,
		'height': 300,
		'colors': ['#00CC35']
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('graph2'));
	chart.draw(data, options);
};