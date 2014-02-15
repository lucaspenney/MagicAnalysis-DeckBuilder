$('#search input').keyup(function(e) {
	var text = $('#search input').val();
	if (text.length < 1 || e.keyCode < 48 || e.keyCode > 90) return; //Ignore non-character input

	$.get("../MagicAnalysis-site/api/searchcards?name=" + text, function(data) {
		Builder.searchManager.setResults($.parseJSON(data));
	});
});

function SearchManager() {
	this.searchResults = [];
}

SearchManager.prototype.load = function() {
	var img = new Image();
	var obj = new Kinetic.Image({
		x: 0,
		y: 0,
		opacity: 1,
		image: img,
	});
	obj.scale({
		x: 0.5,
		y: 0.5
	});
	Builder.layers.search.add(obj);
};

SearchManager.prototype.setResults = function(data) {
	this.searchResults = data;
	this.updateDisplay();
};

SearchManager.prototype.updateDisplay = function() {
	var img = new Image();
	img.src = "http://magicanalysis.com/cards/images/" + this.searchResults[0].set + "/" + this.searchResults[0].num + ".jpg";
	img.onload = function() {
		Builder.layers.search.getChildren().each(function(node, index) {
			node.setImage(img);
		});
	};
	Builder.layers.search.draw();
};