function DeckList() {
	this.decklist = [];
	$('#decklist-button-get').on('click', function() {
		Builder.deckList.get();
	});
	$('#decklist-button-load')
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
	//Load the modified deck list as the deck
};