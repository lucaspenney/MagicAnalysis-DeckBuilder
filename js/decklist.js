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
	//Load the modified deck list as the deck
	var list = $('#decklist-modal textarea').val();
	$.post("/api/deck/import", {
		deck: Builder.deckManager.deckId,
		list: list
	}).done(function(data) {
		$('#decklist-modal').modal('hide');
		Builder.deckManager.loadDeck(Builder.deckManager.deckId); //Reload the deck
		Builder.deckManager.saveDeck();
	}).fail(function(data) {
		$('#import-errors').html(data.responseText.replace(/"/g, ""));
	});
};