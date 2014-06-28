function DeckList() {
	this.decklist = [];
	$('#decklist-modal-open').on('click', function() {
		Builder.deckList.get();
	});
	$('#decklist-button-load').on('click', function() {
		Builder.deckList.load();
	});
}

DeckList.prototype.get = function() {
	$('#decklist-modal').modal();
};

DeckList.prototype.load = function() {
	//First remove everything from the board
	Builder.cards = null;
	Builder.cards = [];

	//Load the modified deck list as the deck
	var list = $('#decklist-modal textarea').val();
	list = list.split("\n");

	//Set the deckManager's deck size to the length of the list
	Builder.deckManager.deckSize = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].length > 1) {
			var amount = list[i].substr(0, list[i].indexOf('x '));
			var card = list[i].substr(list[i].indexOf(' ') + 1); //Get everything after the space
			if (isNaN(amount)) continue;
			for (var k = 0; k < amount; k++) {
				$.get("/api/cardSearch?name=" + card, function(data) {
					if (data.length > 0) {
						var cardData = data[0];
						Builder.deckManager.createCard(cardData, 0);
					}
				});
			}
		}
	}
	$('#decklist-modal').modal('hide');
};