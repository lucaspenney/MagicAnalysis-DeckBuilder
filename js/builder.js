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