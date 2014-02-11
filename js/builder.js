var Builder = new Builder();

function Builder() {

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

	createCard();

	Builder.mainBoard.draw();
	loop();
});

function loop() {
	requestAnimationFrame(loop);
	Builder.mainBoard.draw();
}