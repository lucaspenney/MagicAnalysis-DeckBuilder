var Builder = null;

$(document).ready(function() {
	Builder = new DeckBuilder();
	Builder.mainBoard.draw();

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

	this.mainBoard = new Kinetic.Layer();
	this.sideBoard = new Kinetic.Layer();
	this.searchLayer = new Kinetic.Layer();

	this.stage.add(this.mainBoard);
	this.stage.add(this.sideBoard);
	this.stage.add(this.searchLayer);

	this.mainBoard.on('mouseover', function(evt) {

	});
}

DeckBuilder.prototype.onLoad = function() {
	this.searchManager.load();
	Builder.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.3,
			y: 0.3
		});
		node.position({
			x: index * 20,
			y: index * 1 + 250
		});
		node.animateFadeIn.play();
	});
	Builder.mainBoard.draw();
};

function loop() {
	requestAnimationFrame(loop);
}

window.oncontextmenu = function() {
	return false; //Disable right click context menu
};