function Sorter() {
	this.sortType = 'cost';
	this.values = 0;
	this.cardScale = 0.65;
}

Sorter.prototype.applySort = function() {
	if (!Builder.deckManager.loaded) return;
	this.sortMainBoard();
	this.sortSideBoard();
	Builder.grapher.calculate();
};

Sorter.prototype.calculateCardScale = function() {
	if (this.values < 7) {
		this.cardScale = 0.65;
	} else {
		this.cardScale = 0.65 - ((this.values - 6) / (this.values * 1.65));
	}
};

Sorter.prototype.sortMainBoard = function() {
	var nodes = Builder.layers.mainBoard.getChildren().toArray();
	if (this.sortType === 'cost') this.sortByConvertedCost(nodes);
	else if (this.sortType === 'type') this.sortByCardType(nodes);
};

Sorter.prototype.sortSideBoard = function() {
	var nodes = Builder.layers.sideBoard.getChildren().toArray();
	for (var i = 0; i < nodes.length; i++) {
		var x = 1600;
		var y = Math.floor(i) * 100;
		nodes[i].moveTween = new Kinetic.Tween({
			node: nodes[i],
			x: x,
			y: y,
			easing: Kinetic.Easings.Linear,
			duration: 0.5
		});
		nodes[i].moveTween.play();
	}
};

Sorter.prototype.sortByCardType = function(arr) {
	var sorted = [];
	for (var i = 0; i < 7; i++) {
		sorted[i] = [];
	}
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].cardData.type.contains("land")) sorted[0].push(arr[i]);
		else if (arr[i].cardData.type.contains("creature") || arr[i].cardData.type.contains("summon")) sorted[1].push(arr[i]);
		else if (arr[i].cardData.type.contains("sorcery")) sorted[2].push(arr[i]);
		else if (arr[i].cardData.type.contains("enchant")) sorted[3].push(arr[i]);
		else if (arr[i].cardData.type.contains("instant")) sorted[4].push(arr[i]);
		else if (arr[i].cardData.type.contains("planeswalker")) sorted[5].push(arr[i]);
		else if (arr[i].cardData.type.contains("artifact")) sorted[6].push(arr[i]);
	}
	this.cardScale = 0.54;
	for (var i = 0; i < sorted.length; i++) {
		for (var k = 0; k < sorted[i].length; k++) {
			var x = i * (this.cardScale * 322);
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

Sorter.prototype.sortByConvertedCost = function(arr) {

	var allValues = [];
	var values = [];

	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === undefined) continue;
		if (arr[i].cardData === undefined) continue;
		if (arr[i].cardData.converted_cost === undefined) continue;

		if (arr[i].cardData.converted_cost === '') arr[i].cardData.converted_cost = 0; //Land
		arr[i].cardData.convertedCost = arr[i].cardData.converted_cost;
		allValues.push(arr[i].cardData.convertedCost);
	}
	values = allValues.filter(function(elem, pos) {
		return allValues.indexOf(elem) == pos;
	});
	values.sort(function(a, b) {
		return a - b;
	});
	this.values = values.length;
	this.calculateCardScale();

	//Create sorted 2d array
	var sorted = [];
	for (var i = 0; i < values.length; i++) {
		sorted[i] = [];
	}

	var sortFunc = function(a, b) {
		if (a.cardData.name < b.cardData.name) return -1;
		if (a.cardData.name > b.cardData.name) return 1;
		return 0;
	};
	for (var i = 0; i < arr.length; i++) {
		var index = values.indexOf(arr[i].cardData.convertedCost);
		sorted[index].push(arr[i]);
		//Sort the array by name, so cards don't get mixed in their column
		sorted[index].sort(sortFunc);
	}

	for (var i = 0; i < sorted.length; i++) {
		for (var k = 0; k < sorted[i].length; k++) {
			var x = 350 + (i * (this.cardScale * 322)); //Multiplier to width of 322
			var y = k * 100;
			sorted[i][k].x(x);
			sorted[i][k].y(y);
			/*
			sorted[i][k].moveTween = new Kinetic.Tween({
				node: sorted[i][k],
				x: x,
				y: y,
				easing: Kinetic.Easings.Linear,
				duration: 0.5
			});
			console.log(sorted[i][k].moveTween);
			sorted[i][k].moveTween.play();
			*/
			sorted[i][k].setZIndex(k);
		}
	}
};