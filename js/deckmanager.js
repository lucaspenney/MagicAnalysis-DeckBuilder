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
		this.deckName = data.name;
		$('#deckname').val(this.deckName);
		for (var i = 0; i < data.cards.length; i++) {
			_this.deckSize = data.cards.length;
			_this.createCard(data.cards[i].cardid, data.cards[i].sideboard);
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
		name: $('#deckname').val(),
		cards: cards
	};

	$.post("http://localhost/MagicAnalysis-site/api/savedeck", {
		deck: data
	}, function() {

	});
};

DeckManager.prototype.createCard = function(id, sideboard) {
	var _this = this;
	$.get("http://localhost/MagicAnalysis-site/api/getcard?id=" + id, function(data) {
		var cardData = $.parseJSON(data);

		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
		img.onload = function() {
			var obj = new Kinetic.Image({
				x: 500,
				y: -100,
				opacity: 0.0,
				draggable: true,
				image: img,
				scale: 0.4
			});
			obj.cardData = cardData;

			if (sideboard === '1') {
				Builder.layers.sideBoard.add(obj);
			} else {
				Builder.layers.mainBoard.add(obj);
			}

			obj.tweens = cardTweens(obj);
			obj.hooks = cardHooks(obj);
			if (sideboard === '1') {
				obj.tweens.scaleSmall();
			} else {
				obj.tweens.scaleMedium();
			}

			Builder.sorter.applySort();
			_this.loadedCards++;
			if (_this.loadedCards >= _this.deckSize) {
				_this.loading = false;
				Builder.onDeckLoad();
			}
		};
	});
};