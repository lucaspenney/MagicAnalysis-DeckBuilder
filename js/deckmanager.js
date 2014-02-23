function DeckManager() {
	this.loadedCards = 0;
	this.deckSize = null;
	this.deckId = null;
	this.loading = false;
	this.deckName = 'Test deck';
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

DeckManager.prototype.saveDeck = function() {
	var cards = [];
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		cards.push({
			id: node.cardData.id,
			sideboard: 0
		});
	});
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		cards.push({
			id: node.cardData.id,
			sideboard: 1
		});
	});
	var data = {
		id: this.deckId,
		name: this.deckName,
		cards: cards
	};

	$.post("http://localhost/MagicAnalysis-site/api/savedeck", {
		deck: data
	}, function() {

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
				x: 500,
				y: -100,
				opacity: 0,
				draggable: true,
				image: img,
				scale: 0.4
			});
			obj.cardData = cardData;
			Builder.layers.mainBoard.add(obj);

			obj.tweens = cardTweens(obj);
			obj.hooks = cardHooks(obj);

			_this.loadedCards++;
			if (_this.loadedCards >= _this.deckSize) {
				_this.loading = false;
				Builder.onDeckLoad();
			}
		};
	});
};