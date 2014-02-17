var Builder = null;

$(document).ready(function() {
	Builder = new DeckBuilder();
	Builder.load();
	Builder.layers.mainBoard.draw();

	loop();
});


function DeckBuilder() {
	this.lastSaved = null;
	this.deckManager = new DeckManager();
	this.searchManager = new SearchManager();
	this.sorter = new Sorter();


	this.stage = new Kinetic.Stage({
		container: 'container',
		width: 1000 * 1.5,
		height: 750 * 1.5
	});

	console.log(this.stage.getWidth());

	this.layers = {
		//background: new Kinetic.Layer(),
		mainBoard: new Kinetic.Layer(),
		sideBoard: new Kinetic.Layer(),
		search: new Kinetic.Layer()
	};

	this.stage.add(this.layers.mainBoard);
	this.stage.add(this.layers.sideBoard);
	this.stage.add(this.layers.search);
	this.layers.mainBoard.on('mouseover', function(evt) {

	});
}

DeckBuilder.prototype.load = function() {
	this.deckManager.loadDeck(8);
	this.searchManager.load();
};

DeckBuilder.prototype.onDeckLoad = function() {
	this.sorter.applySort();
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.tweens.fadeIn.play();
	});
	Builder.layers.mainBoard.draw();
};

DeckBuilder.prototype.draw = function() {
	Builder.layers.mainBoard.draw();
	Builder.layers.sideBoard.draw();
	Builder.layers.search.draw();
};

function loop() {
	requestAnimationFrame(loop);
}

window.oncontextmenu = function() {
	return false; //Disable right click context menu
};
function DeckManager() {
	this.loadedCards = 0;
	this.deckSize = null;
	this.deckId = null;
	this.loading = false;
}

DeckManager.prototype.loadDeck = function(id) {
	this.loading = true;
	this.deckId = id;
	var _this = this;
	$.get("http://localhost/MagicAnalysis-site/api/getdeck?id=" + id, function(data) {
		data = $.parseJSON(data);
		for (var i = 0; i < data.length; i++) {
			_this.deckSize = data.length;
			_this.createCard(data[i].cardid);
		}
	});
};

DeckManager.prototype.createCard = function(id) {
	var _this = this;
	$.get("http://localhost/MagicAnalysis-site/api/getcard?id=" + id, function(data) {
		var cardData = $.parseJSON(data);

		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
		img.onload = function() {
			var obj = new Kinetic.Image({
				x: 500,
				y: -100,
				opacity: 0,
				draggable: true,
				image: img,
				scale: 0.4
			});
			obj.cardData = cardData;
			Builder.layers.mainBoard.add(obj);

			obj.tweens = cardTweens(obj);
			obj.hooks = cardHooks(obj);

			_this.loadedCards++;
			if (_this.loadedCards >= _this.deckSize) {
				_this.loading = false;
				Builder.onDeckLoad();
			}
		};
	});
};
function cardHooks(obj) {
	obj.on('click', function() {

	});

	obj.on('dragstart', function(e) {
		var isRightMB;
		e = e || window.event;
		if ("which" in e) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			isRightMB = e.which == 3;
		else if ("button" in e) // IE, Opera 
			isRightMB = e.button == 2;

		if (isRightMB) { //Do something if right mouse click

		}
	});

	obj.on('dragend', function(e) {
		if (obj.x() < 1300) {
			obj.moveTo(Builder.layers.mainBoard);
		} else if (obj.x() >= 1300) {
			obj.moveTo(Builder.layers.sideBoard);
		}
		Builder.draw();
		Builder.sorter.applySort();
	});


	obj.on('dragstart', function() {
		this.setZIndex(1000);
	});

	return true;
}
$('#search input').keyup(function(e) {
	var text = $('#search input').val();
	if (text.length < 1 || (e.keyCode !== 8 && e.keyCode < 48) || e.keyCode > 90) return; //Ignore non-character input

	$.get("../MagicAnalysis-site/api/searchcards?name=" + text, function(data) {
		Builder.searchManager.setResults($.parseJSON(data));
	});
});

function SearchManager() {
	this.searchResults = [];
}

SearchManager.prototype.load = function() {
	var img = new Image();
	img.src = "http://magicanalysis.com/cards/images/back.jpg";
	img.onload = function() {
		var obj = new Kinetic.Image({
			x: 0,
			y: 0,
			opacity: 1,
			image: img,
		});
		obj.scale({
			x: 1.05,
			y: 1.05
		});
		Builder.layers.search.add(obj);
		obj.tweens = cardTweens(obj);
		obj.hooks = cardHooks(obj);

		obj.timeCreated = new Date().getTime();
	};

	var _this = this;
	setTimeout(function() {
		_this.updateDisplay();
	}, 500);
};

SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	this.updateDisplay();
};

SearchManager.prototype.updateDisplay = function() {
	if (this.searchResults[0] === undefined) return;
	var img = new Image();
	img.src = "http://magicanalysis.com/cards/images/" + this.searchResults[0].set + "/" + this.searchResults[0].num + ".jpg";
	img.onload = function() {
		Builder.layers.search.getChildren().each(function(node, index) {
			node.setImage(img);
		});
	};
	Builder.layers.search.draw();
	var _this = this;
	setTimeout(function() {
		_this.updateDisplay();
	}, 500);
};
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
		node.scale({
			x: 0.6,
			y: 0.6
		});
		nodes.push(node);
	});
	this.sortByConvertedCost(nodes);
};

Sorter.prototype.sortSideBoard = function() {
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		//Todo: tween these scales
		node.scale({
			x: 0.4,
			y: 0.4
		});
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
function cardTweens(obj) {
	return {
		fadeOut: new Kinetic.Tween({
			node: obj,
			opacity: 0.0,
			easing: Kinetic.Easings.Linear,
			duration: 0.8
		}),
		fadeIn: new Kinetic.Tween({
			node: obj,
			opacity: 1,
			easing: Kinetic.Easings.Linear,
			duration: 0.8
		})
	};
}