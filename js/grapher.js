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
		var cards = [];
		for (var i=0;i<Builder.cards.length;i++) {
			cards.push(Builder.cards[i].cardData);
		}
		createCardTypeGraph("#graph1", cards);
		createCardColorsGraph("#graph2", cards);
		createCardManaCostGraph("#graph3", cards);
	}
};

Grapher.prototype.calculateCardTypeData = function() {

}