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
				draggable: true,
				image: img,
			});
			obj.cardData = cardData;
			Builder.layers.mainBoard.add(obj);

			obj.tweens = getTweens(obj);

			obj.on('dragstart', function(e) {
				var isRightMB;
				e = e || window.event;
				if ("which" in e) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
					isRightMB = e.which == 3;
				else if ("button" in e) // IE, Opera 
					isRightMB = e.button == 2;

				if (isRightMB) obj.animateTap.play();
			});

			obj.on('dragstart', function() {
				this.setZIndex(1000);
			});

			_this.loadedCards++;
			if (_this.loadedCards >= _this.deckSize) {
				_this.loading = false;
				Builder.onLoad();
			}
		};
	});
};