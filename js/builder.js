var Builder = null;
setTimeout(function() {
	Builder = new DeckBuilder();
	Builder.load();
	Builder.layers.mainBoard.draw();
}, 1000);

function DeckBuilder() {
	this.lastSaved = null;
	this.deckManager = new DeckManager();
	this.searchManager = new SearchManager();
	this.sorter = new Sorter();
	this.grapher = new Grapher();
	this.deckList = new DeckList();


	this.stage = new Kinetic.Stage({
		container: 'kinetic-container',
		width: 1280 * 1.5,
		height: 800 * 1.5
	});

	this.layers = {
		back: new Kinetic.Layer(),
		mainBoard: new Kinetic.Layer(),
		sideBoard: new Kinetic.Layer(),
		search: new Kinetic.Layer()
	};

	this.stage.add(this.layers.back);
	this.stage.add(this.layers.mainBoard);
	this.stage.add(this.layers.sideBoard);
	this.stage.add(this.layers.search);
}

DeckBuilder.prototype.load = function() {
	var backgroundImg = new Image();
	backgroundImg.src = "/app/programs/deckbuilder/background.png";
	backgroundImg.onload = function() {
		var background = new Kinetic.Image({
			x: 0,
			y: 0,
			image: backgroundImg
		});
		Builder.layers.back.add(background);
		Builder.layers.back.draw();
	};

	this.deckManager.loadDeck($('#deckid').val());
	this.searchManager.load();
	this.grapher.load();
	this.draw();
};

DeckBuilder.prototype.onDeckLoad = function() {
	console.log("Deck Loaded");
	this.sorter.applySort();
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.tweens.fadeIn();
	});
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		node.tweens.fadeIn();
	});
	Builder.layers.mainBoard.draw();
	Builder.grapher.calculate();
};

DeckBuilder.prototype.draw = function() {
	Builder.layers.back.draw();
	Builder.layers.mainBoard.draw();
	Builder.layers.sideBoard.draw();
	Builder.layers.search.draw();
};

$('#deckbuilder').on('contextmenu', function(e) {
	e.preventDefault();
});

String.prototype.contains = function(it) {
	return this.toLowerCase().indexOf(it) != -1;
};