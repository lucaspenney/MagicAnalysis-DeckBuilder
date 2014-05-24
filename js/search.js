$('body').keyup(function(e) {
	if (e.keyCode === 13) {
		Builder.searchManager.addResultToDeck();
	}
})
$('#search input').keyup(function(e) {
	var text = $('#search input').val();
	if (text.length < 1 || (e.keyCode !== 8 && e.keyCode < 48) || e.keyCode > 90) return; //Ignore non-character input

	$.get("/api/cardSearch?name=" + text, function(data) {
		Builder.searchManager.setResults(data);
	});
});

$('#search select').change(function(e) {
	Builder.searchManager.selectedResult = $(this).val();
	Builder.searchManager.updateDisplay();
});

function SearchManager() {
	this.searchResults = [];
	this.selectedResult = 0;
	this.previewCard = null;
	this.selectedIndex = null;
}

SearchManager.prototype.load = function() {
	//Card previews
};



SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	if (this.searchResults[0] !== undefined) {
		this.selectedResult = this.searchResults[0].id;
		this.updateDisplay();
	}
};

SearchManager.prototype.createPreviewCard = function() {
	//Create the draggable preview card (used for replacing it)
	this.previewCard = new Card(this.searchResults[this.selectedIndex], 0);
	this.previewCard.targetCardScale = 1.03;
	this.previewCard.board = 0;
	Builder.sorter.applySort();
	this.updateDisplay();
};

SearchManager.prototype.updateDisplay = function() {
	if (!Builder) return;
	if (this.searchResults[0] === undefined) {
		return;
	}
	if (this.searchResults[0].length < 2) {
		return;
	}

	if (this.previewCard) {
		if (this.previewCard.board !== 0) this.previewCard = null;
	}

	var resultsSelection = '';
	for (var i = 0; i < this.searchResults.length; i++) {
		if (this.searchResults[i].id === this.selectedResult) resultsSelection += "<option selected value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + " (" + this.searchResults[i].set + ")" + "</option>";
		else resultsSelection += "<option value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + " (" + this.searchResults[i].set + ")" + "</option>";
	}
	if ($('#search select').text() != $(' < div / > ').html(resultsSelection).text()) {
		$('#search select').html(resultsSelection);
	}

	var selectedIndex = 0;
	for (var i = 0; i < this.searchResults.length; i++) {
		if (this.searchResults[i].id === this.selectedResult) {
			selectedIndex = i;
			break;
		}
	}
	this.selectedIndex = selectedIndex;
	if (!this.previewCard) {
		this.createPreviewCard();
	} else {
		this.previewCard.cardData = this.searchResults[this.selectedIndex];
		this.previewCard.loadImage();
	}
};

SearchManager.prototype.addResultToDeck = debounce(function() {
	this.previewCard.board = 1;
	this.updateDisplay();
	Builder.sorter.applySort();
}, 50);