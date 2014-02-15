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