$('body').keyup(function(e) {
	if (e.keyCode === 16) {
		Builder.searchManager.shifted = false;
	}
	if (e.keyCode === 17) {
		Builder.searchManager.controlled = false;
	}
	if (e.keyCode === 13) {
		Builder.searchManager.addResultToDeck();
	}
});
$('body').keydown(function(e) {
	if (e.keyCode === 16) {
		Builder.searchManager.shifted = true;
	}
	if (e.keyCode === 17) {
		Builder.searchManager.controlled = true;
	}
	if (e.keyCode === 38 || e.keyCode === 40) {
		//Up down arrow presses (navigate through results
		if (!$(document.activeElement).is($(document.body))) {
			Builder.searchManager.navigateSearchResults(e.keyCode === 38);
			e.preventDefault();
		}

	}
});
$('#search input').keyup(function(e) {
	if ((e.keyCode !== 8 && e.keyCode < 48) || e.keyCode > 90) return; //Ignore non-character input

	Builder.searchManager.searchRequest();
});

$('#search input[type=checkbox]').click(function(e) {
	Builder.searchManager.searchRequest();
});

SearchManager.prototype.searchRequest = debounce(function() {
	var colors = '';
	$("#search input[type=checkbox]").each(function() {
		if ($(this).is(':checked')) {
			colors = colors + $(this).attr('class');
		}
	});
	var search = {
		name: $("#search .name").val(),
		sets: $("#search .sets").val(),
		text: $("#search .text").val(),
		type: $("#search .type").val(),
		colors: colors
	};

	function EncodeQueryData(data) {
		var ret = [];
		for (var d in data) {
			if (data[d].length > 0 && data[d] != 'undefined')
				ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
		}
		return ret.join("&");
	}

	var query = EncodeQueryData(search);

	$.get("/api/cardSearch?" + query, function(data) {
		if (data.length > 0)
			Builder.searchManager.setResults(data);
	});
}, 100);

$('#search select').change(function(e) {
	Builder.searchManager.selectedResult = $(this).val();
	Builder.searchManager.updateDisplay();
});
$('#search select').dblclick(function(e) {
	Builder.searchManager.addResultToDeck();
});

function SearchManager() {
	this.searchResults = [];
	this.selectedResult = 0;
	this.previewCard = null;
	this.selectedIndex = null;
	this.shifted = false;
	this.controlled = false;
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
		if (this.searchResults[i].id === this.selectedResult) resultsSelection += "<option selected value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + " (" + this.searchResults[i].set.toUpperCase() + ")" + "</option>";
		else resultsSelection += "<option value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + " (" + this.searchResults[i].set.toUpperCase() + ")" + "</option>";
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
	var zone = 1;
	if (this.shifted) zone = 2;
	if (this.controlled) {
		for (var i = 0; i < 4; i++) {
			Builder.deckManager.addCardToDeck(this.previewCard, zone);
			this.updateDisplay();
		}
	} else {
		Builder.deckManager.addCardToDeck(this.previewCard, zone);
	}
	this.updateDisplay();
}, 50);

SearchManager.prototype.navigateSearchResults = debounce(function(up) {
	if (!up) {
		var curIndex = $("#search select option:selected").index();
		curIndex += 1;
		var option = $($("#search select option").get(curIndex));
		option.prop('selected', 'selected');
		Builder.searchManager.selectedResult = option.val();
		Builder.searchManager.updateDisplay();
	} else {
		var curIndex = $("#search select option:selected").index();
		curIndex -= 1;
		var option = $($("#search select option").get(curIndex));
		option.prop('selected', 'selected');
		Builder.searchManager.selectedResult = option.val();
		Builder.searchManager.updateDisplay();
	}
}, 50);;