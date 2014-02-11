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
function createCard() {

	$.get("http://localhost/MagicAnalysis-site/api/getcard?id=4912", function(data) {
		var cardData = $.parseJSON(data);

		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
		img.onload = function() {
			var obj = new Kinetic.Image({
				x: 20,
				y: 50,
				image: img,
			});
			obj.cardData = cardData;
			Builder.mainBoard.add(obj);
		};
	});


}