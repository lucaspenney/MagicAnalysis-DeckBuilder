function Sorter() {
	this.sortType = 'cost';
}

Sorter.prototype.applySort = function() {
	this.sortMainBoard();
	this.sortSideBoard();
};

Sorter.prototype.sortMainBoard = function() {
	var nodes = [];
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		nodes.push(node);
	});
	this.sortByConvertedCost(nodes);
};

Sorter.prototype.sortSideBoard = function() {
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		var x = 1350;
		var y = Math.floor(index) * 100;
		node.moveTween = new Kinetic.Tween({
			node: node,
			x: x,
			y: y,
			easing: Kinetic.Easings.Linear,
			duration: 0.5
		});
		node.moveTween.play();
	});
};

Sorter.prototype.sortByConvertedCost = function(arr) {

	var allValues = [];
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
		sorted[index].push(arr[i]);
		//Sort the array by name, so cards don't get mixed in their column
		sorted[index].sort(function(a, b) {
			if (a.cardData.name < b.cardData.name) return -1;
			if (a.cardData.name > b.cardData.name) return 1;
			return 0;
		});
	}

	for (var i = 0; i < sorted.length; i++) {
		for (var k = 0; k < sorted[i].length; k++) {
			var x = i * 200;
			var y = k * 100;
			sorted[i][k].moveTween = new Kinetic.Tween({
				node: sorted[i][k],
				x: 350 + x,
				y: y,
				easing: Kinetic.Easings.Linear,
				duration: 0.5
			});
			sorted[i][k].moveTween.play();
			sorted[i][k].setZIndex(k);
		}
	}
};