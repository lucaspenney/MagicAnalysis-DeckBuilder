$('#search input').keyup(function(e) {
	var text = $('#search input').val();
	if (text.length < 1 || (e.keyCode !== 8 && e.keyCode < 48) || e.keyCode > 90) return; //Ignore non-character input

	$.get("../MagicAnalysis-site/api/searchcards?name=" + text, function(data) {
		Builder.searchManager.setResults($.parseJSON(data));
	});
});

function SearchManager() {
	this.searchResults = [];
	this.selectedResult = null;
	this.cardBackImg = new Image();
	this.cardBackImg.src = "http://magicanalysis.com/cards/images/back.jpg";
}

SearchManager.prototype.load = function() {
	var cardBack = new Kinetic.Image({
		x: 0,
		y: 0,
		opacity: 1,
		scale: 1.05,
		image: this.cardBackImg,
		name: 'cardBack'
	});
	var previewMain = new Kinetic.Image({
		x: 0,
		y: 0,
		opacity: 1,
		scale: 1.05,
		draggable: true,
		name: 'previewMain'
	});
	var previewSmall1 = new Kinetic.Image({
		x: 0,
		y: 450,
		scale: 0.5,
		name: 'previewSmall1'
	});
	var previewSmall2 = new Kinetic.Image({
		x: 156,
		y: 450,
		scale: 0.5,
		name: 'previewSmall2'
	});
	previewSmall1.on('click', Builder.searchManager.onPreviewClick);
	previewSmall2.on('click', Builder.searchManager.onPreviewClick);

	Builder.layers.search.add(cardBack);
	Builder.layers.search.add(previewMain);
	Builder.layers.search.add(previewSmall1);
	Builder.layers.search.add(previewSmall2);
	previewMain.hooks = cardHooks(previewMain);
	previewMain.tweens = cardTweens(previewMain);

	var _this = this;
	setTimeout(function() {
		_this.updateDisplay();
	}, 500);
};



SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	this.updateDisplay();
};

SearchManager.prototype.updateDisplay = function() {
	if (this.searchResults[0] === undefined) {
		Builder.layers.search.getChildren().each(function(node, index) {
			if (node.name() == 'cardBack') {
				node.setImage(this.cardBackImg);
			}
		});
		return;
	}

	var resultsSelection = '';
	for (var i = 0; i < this.searchResults.length; i++) {
		if (i === 0) resultsSelection += "<option selected>" + this.searchResults[i].name + "</option>";
		else resultsSelection += "<option value=" + this.searchResults[i].id + ">" + this.searchResults[i].name + "</option>";
	}
	if ($('#search select').text() != $('<div/>').html(resultsSelection).text()) {
		$('#search select').html(resultsSelection);
	}

	var previews = [];
	for (var i = 0; i < 3; i++) {
		if (this.searchResults.length < i) continue;
		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + this.searchResults[i].set + "/" + this.searchResults[i].num + ".jpg";
		previews.push({
			image: img,
			data: this.searchResults[i]
		});
	}
	Builder.layers.search.getChildren().each(function(node, index) {
		var name = node.name();
		if (!name) return;

		if (name == 'previewMain') {
			node.setImage(previews[0].image); //Main preview image
			node.cardData = previews[0].data;
		} else if (name == 'previewSmall1') {
			node.setImage(previews[1].image);
			node.cardData = previews[1].data;
		} else if (name == 'previewSmall2') {
			node.setImage(previews[2].image);
			node.cardData = previews[2].data;
		}
		if (name.indexOf('Small') !== -1) {
			node.scale({
				x: 0.5,
				y: 0.5
			});
		}
	});

	Builder.layers.search.draw();
	var _this = this;
	setTimeout(function() {
		_this.updateDisplay();
	}, 500);
};

SearchManager.prototype.onPreviewClick = function(e) {
	this.selectedResult = this.cardData.id;
	console.log(this.selectedResult);
};