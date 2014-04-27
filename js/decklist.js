function DeckList() {
	this.decklist = [];
	$('#decklist-button').on('click', function() {
		Builder.deckList.load();
	});
}

DeckList.prototype.load = function() {
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