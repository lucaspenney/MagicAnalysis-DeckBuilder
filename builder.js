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
function createCard(id) {

	$.get("http://localhost/MagicAnalysis-site/api/getcard?id=" + id, function(data) {
		var cardData = $.parseJSON(data);

		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
		img.onload = function() {
			var obj = new Kinetic.Image({
				x: 100,
				y: 100,
				image: img,
			});
			obj.cardData = cardData;
			Builder.mainBoard.add(obj);

			obj.animateFade = new Kinetic.Tween({
				node: obj,
				opacity: 0.0,
				easing: Kinetic.Easings.Linear,
				duration: 0.8
			});
			obj.animateTap = new Kinetic.Tween({
				node: obj,
				rotation: 90,
				x: obj.getAttr('x') + obj.getAttr('width') / 2,
				easing: Kinetic.Easings.Linear,
				duration: 0.5
			});

			Builder.cards.push(obj);
		};
	});
}