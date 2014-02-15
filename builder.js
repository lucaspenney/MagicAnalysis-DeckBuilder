var Builder = null;

$(document).ready(function() {
	Builder = new DeckBuilder();
	Builder.layers.mainBoard.draw();

	loop();
});


function DeckBuilder() {
	this.lastSaved = null;
	this.deckManager = new DeckManager();
	this.deckManager.loadDeck(8);
	this.searchManager = new SearchManager();


	this.stage = new Kinetic.Stage({
		container: 'container',
		width: 600 * 2,
		height: 400 * 2
	});

	this.layers = {
		background: new Kinetic.Layer(),
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

DeckBuilder.prototype.onLoad = function() {
	this.searchManager.load();
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.3,
			y: 0.3
		});
		node.position({
			x: index * 20,
			y: index * 1 + 250
		});
		node.tweens.fadeIn.play();
	});
	Builder.layers.mainBoard.draw();
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
				x: 100,
				y: 100,
				opacity: 0,
				draggable: true,
				image: img,
			});
			obj.cardData = cardData;
			Builder.layers.mainBoard.add(obj);

			obj.tweens = getTweens(obj);

			obj.on('dragstart', function(e) {
				var isRightMB;
				e = e || window.event;
				if ("which" in e) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
					isRightMB = e.which == 3;
				else if ("button" in e) // IE, Opera 
					isRightMB = e.button == 2;

				if (isRightMB) obj.animateTap.play();
			});

			obj.on('dragstart', function() {
				this.setZIndex(1000);
			});

			_this.loadedCards++;
			if (_this.loadedCards >= _this.deckSize) {
				_this.loading = false;
				Builder.onLoad();
			}
		};
	});
};
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
};

SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	this.updateDisplay();
};

SearchManager.prototype.updateDisplay = function() {
	var img = new Image();
	img.src = "http://magicanalysis.com/cards/images/" + this.searchResults[0].set + "/" + this.searchResults[0].num + ".jpg";
	img.onload = function() {
		Builder.layers.search.getChildren().each(function(node, index) {
			node.setImage(img);
		});
	};
	Builder.layers.search.draw();
};
function getTweens(obj) {
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
		}),
		tapRotate: new Kinetic.Tween({
			node: obj,
			rotation: 90,
			easing: Kinetic.Easings.Linear,
			duration: 0.5
		})
	};
}