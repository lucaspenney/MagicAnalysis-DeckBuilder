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

	this.stage = new Kinetic.Stage({
		container: 'container',
		width: 600 * 2,
		height: 400 * 2
	});

	this.mainBoard = new Kinetic.Layer();
	this.sideBoard = new Kinetic.Layer();

	this.stage.add(this.mainBoard);
	this.stage.add(this.sideBoard);

	this.mainBoard.on('mouseover', function(evt) {

	});
}

DeckBuilder.prototype.onLoad = function() {
	Builder.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.3,
			y: 0.3
		});
		node.position({
			x: index * 20,
			y: index * 1
		});
		node.animateFadeIn.play();
	});
};

function loop() {
	requestAnimationFrame(loop);
	Builder.mainBoard.draw();


}