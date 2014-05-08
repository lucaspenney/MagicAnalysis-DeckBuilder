function DeckList() {
	this.decklist = [];
	$('#decklist-button-get').on('click', function() {
		Builder.deckList.get();
	});
	$('#decklist-button-load').on('click', function() {
		Builder.deckList.load();
	})
}

DeckList.prototype.get = function() {
	$('#decklist-modal').modal({
		backdrop: false
	});

	$.get("/api/deck/list?id=" + Builder.deckManager.deckId, function(data) {
		this.decklist = data;
		var html = '';
		for (var i = 0; i < data.length; i++) {
			console.log(data[i]);
			var line = '';
			line += data[i].count + ' ';
			line += data[i].cardname;
			line += "\n";
			html += line;
		}
		$("#decklist-modal .modal-body textarea").html(html);
	});
};

DeckList.prototype.load = function() {
	//First remove everything from the board
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.destroy();
	});
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		node.destroy();
	});
	Builder.sorter.applySort();

	//Load the modified deck list as the deck
	var list = $('#decklist-modal textarea').val();
	list = list.split("\n");

	//Set the deckManager's deck size to the length of the list
	Builder.deckManager.deckSize = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].length > 1) {
			var amount = list[i].substr(0, list[i].indexOf(' '));
			var card = list[i].substr(list[i].indexOf(' ') + 1); //Get everything after the space
			if (isNaN(amount)) continue;
			for (var k = 0; k < amount; k++) {
				$.get("/api/cardSearch?name=" + card, function(data) {
					if (data.length > 0) {
						var cardData = data[0];
						var img = new Image();
						img.src = "http://manastack.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
						img.onload = function() {
							var obj = new Kinetic.Image({
								x: 500,
								y: -100,
								draggable: true,
								image: img,
								scale: 0.4
							});
							obj.cardData = cardData;
							Builder.layers.mainBoard.add(obj);
							obj.tweens = cardTweens(obj);
							obj.hooks = cardHooks(obj);
							obj.tweens.scaleMedium();
						};
					}
				});
			}
		}
	}
};