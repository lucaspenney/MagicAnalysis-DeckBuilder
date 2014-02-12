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
				image: img,
			});
			obj.cardData = cardData;
			Builder.mainBoard.add(obj);

			obj.animateFadeOut = new Kinetic.Tween({
				node: obj,
				opacity: 0.0,
				easing: Kinetic.Easings.Linear,
				duration: 0.8
			});
			obj.animateFadeIn = new Kinetic.Tween({
				node: obj,
				opacity: 1,
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

			_this.loadedCards++;
			if (_this.loadedCards >= _this.deckSize) {
				_this.loading = false;
				Builder.onLoad();
			}
		};
	});
};