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
		width: 1000,
		height: 750
	});

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
				x: 200,
				y: 100,
				opacity: 0,
				draggable: true,
				image: img,
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
		if (obj.x() < 700) {
			obj.moveTo(Builder.layers.mainBoard);
		} else if (obj.x() >= 700) {
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
	if (text.length < 1 || e.keyCode < 48 || e.keyCode > 90) return; //Ignore non-character input

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
			x: 0.5,
			y: 0.5
		});
		Builder.layers.search.add(obj);
		obj.tweens = cardTweens(obj);
		obj.hooks = cardHooks(obj);

		obj.timeCreated = new Date().getTime();
	};
};

SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	this.updateDisplay();
};

SearchManager.prototype.updateDisplay = function() {
	if (this.searchResults[0] === null) return;
	var img = new Image();
	img.src = "http://magicanalysis.com/cards/images/" + this.searchResults[0].set + "/" + this.searchResults[0].num + ".jpg";
	img.onload = function() {
		Builder.layers.search.getChildren().each(function(node, index) {
			node.setImage(img);
		});
	};
	Builder.layers.search.draw();
};
function Sorter() {

}

Sorter.prototype.applySort = function() {
	this.sortMainBoard();
	this.sortSideBoard();
};

Sorter.prototype.sortMainBoard = function() {
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.3,
			y: 0.3
		});
		var x = 200 + ((index % 7) * 70);
		var y = Math.floor(index / 7) * 100;
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

Sorter.prototype.sortSideBoard = function() {
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.3,
			y: 0.3
		});
		var x = 800;
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