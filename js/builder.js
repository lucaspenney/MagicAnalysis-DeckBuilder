var Builder = null;
setTimeout(function() {
	Builder = new DeckBuilder();
	Builder.load();
	loop();
}, 1000);

function DeckBuilder() {
	this.lastSaved = null;
	this.deckManager = new DeckManager();
	this.searchManager = new SearchManager();
	this.sorter = new Sorter();
	this.grapher = new Grapher();
	this.deckList = new DeckList();

	this.canvas = document.getElementById('deckbuilder-canvas');
	this.ctx = this.canvas.getContext('2d');
	this.cards = [];
}

function loop() {
	if (Builder) {
		Builder.render();
	}
	setTimeout("requestAnimationFrame(loop)", 30);
	//requestAnimationFrame(loop);
}

DeckBuilder.prototype.render = function() {
	if (this.ctx === undefined) return;
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	this.cards.sort(function(a, b) {
		if (a.z < b.z)
			return -1;
		if (a.z > b.z)
			return 1;
		return 0;
	});

	for (var i = 0; i < this.cards.length; i++) {
		this.cards[i].render();
	}
};

DeckBuilder.prototype.load = function() {
	this.backgroundImg = new Image();
	this.backgroundImg.src = "/app/programs/deckbuilder/background.png";
	this.backgroundImg.onload = function() {

	};

	this.deckManager.loadDeck($('#deckid').val());
	this.searchManager.load();
	this.grapher.load();
	this.render();
};

DeckBuilder.prototype.onDeckLoad = function() {
	console.log("Deck Loaded");
	this.sorter.applySort();
	Builder.grapher.calculate();
};

$('#deckbuilder-canvas').on('contextmenu', function(e) {
	e.preventDefault();
});

String.prototype.contains = function(it) {
	return this.toLowerCase().indexOf(it) != -1;
};