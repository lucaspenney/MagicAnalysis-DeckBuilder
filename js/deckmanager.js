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