var Builder = new DeckBuilder();

function DeckBuilder() {
	this.deckId = null;
	this.lastSaved = null;
	this.cards = [];
}

$(window).load(function() {
	Builder.stage = new Kinetic.Stage({
		container: 'container',
		width: 600 * 2,
		height: 400 * 2
	});

	Builder.mainBoard = new Kinetic.Layer();
	Builder.sideBoard = new Kinetic.Layer();

	Builder.stage.add(Builder.mainBoard);
	Builder.stage.add(Builder.sideBoard);

	createCard(4913);



	Builder.mainBoard.draw();

	loop();
});

function loop() {
	requestAnimationFrame(loop);
	Builder.mainBoard.draw();

	Builder.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.5,
			y: 0.5
		});
		node.animateTap.play();
	});
}