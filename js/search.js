$('#search input').keyup(function(e) {
	var text = $('#search input').val();
	if (text.length < 1 || (e.keyCode !== 8 && e.keyCode < 48) || e.keyCode > 90) return; //Ignore non-character input

	$.get("/api/cardsearch?name=" + text, function(data) {
		Builder.searchManager.setResults(data);
	});
});

$('#search select').change(function(e) {
	Builder.searchManager.selectedResult = $(this).val();
});

function SearchManager() {
	this.searchResults = [];
	this.selectedResult = 0;
	this.cardBackImg = new Image();
	this.cardBackImg.src = "http://manastack.com/cards/images/back.jpg";
}

SearchManager.prototype.load = function() {
	//Maintain focus on search box
	$('#search input').focus();
	$('#search input').on('blur', function(e) {
		if (e.relatedTarget) {
			if (e.relatedTarget.id !== 'deckname' && e.relatedTarget.id !== 'searchselect') {
				$(this).focus();
				$(this)[0].setSelectionRange($(this).val().length, ($(this).val().length));
			}
		} else {
			$(this).focus();
			$(this)[0].setSelectionRange($(this).val().length, ($(this).val().length));
		}
	});
	$('#deckname').on('blur', function(e) {
		$('#search input').focus();
	});
	$('canvas').click(function(e) {
		$('#search input').focus();
	});
	//Card previews
	var previewMain = new Kinetic.Image({
		x: 0,
		y: 0,
		opacity: 1,
		scale: 1.3,
		draggable: true,
		name: 'previewMain'
	});
	var previewSmall1 = new Kinetic.Image({
		x: 0,
		y: 474,
		scale: 0.6,
		name: 'previewSmall1'
	});
	var previewSmall2 = new Kinetic.Image({
		x: 166,
		y: 474,
		scale: 0.6,
		name: 'previewSmall2'
	});

	var _this = this;

	function onPreviewClick() {
		_this.selectedResult = this.cardData.id;
		$('#search select option').each(function() {
			if ($(this).val() === _this.selectedResult) {
				$(this).prop('selected', true);
			}
		});
	}
	previewSmall1.on('click', onPreviewClick);
	previewSmall2.on('click', onPreviewClick);

	Builder.layers.search.add(previewMain);
	Builder.layers.search.add(previewSmall1);
	Builder.layers.search.add(previewSmall2);
	previewMain.hooks = cardHooks(previewMain);
	previewMain.tweens = cardTweens(previewMain);
	Builder.draw();
	Builder.sorter.applySort();

	setTimeout(function() {
		_this.updateDisplay();
	}, 500);
};



SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	if (this.searchResults[0] !== undefined) {
		this.selectedResult = this.searchResults[0].id;
		this.updateDisplay();
	}
};

SearchManager.prototype.updateDisplay = function() {
	if (this.searchResults[0] === undefined) {
		Builder.layers.search.draw();
		return;
	}

	var resultsSelection = '';
	for (var i = 0; i < this.searchResults.length; i++) {
		if (this.searchResults[i].id === this.selectedResult) resultsSelection += "<option selected value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + " (" + this.searchResults[i].set + ")" + "</option>";
		else resultsSelection += "<option value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + " (" + this.searchResults[i].set + ")" + "</option>";
	}
	if ($('#search select').text() != $('<div/>').html(resultsSelection).text()) {
		$('#search select').html(resultsSelection);
	}

	var selectedIndex = 0;
	for (var i = 0; i < this.searchResults.length; i++) {
		if (this.searchResults[i].id === this.selectedResult) {
			selectedIndex = i;
			break;
		}
	}

	var previews = [];
	var k = 0;
	for (var i = selectedIndex; k < 3; i++) {
		if (i > this.searchResults.length - 1) i = 0;
		var img = new Image();
		img.src = "http://manastack.com/cards/images/" + this.searchResults[i].set + "/" + this.searchResults[i].num + ".jpg";
		previews.push({
			image: img,
			data: this.searchResults[i]
		});
		k++;
	}
	Builder.layers.search.getChildren().each(function(node, index) {
		var name = node.name();
		if (!name) return;

		if (name == 'previewMain') {
			node.setImage(previews[0].image); //Main preview image
			node.cardData = previews[0].data;
			node.scale({
				x: 1.05,
				y: 1.05
			});
		} else if (name == 'previewSmall1') {
			node.setImage(previews[1].image);
			node.cardData = previews[1].data;
		} else if (name == 'previewSmall2') {
			node.setImage(previews[2].image);
			node.cardData = previews[2].data;
		}
		if (name.indexOf('Small') !== -1) {
			node.scale({
				x: 0.525,
				y: 0.525
			});
		}
	});

	Builder.layers.search.draw();
	var _this = this;
	setTimeout(function() {
		_this.updateDisplay();
	}, 500);
};