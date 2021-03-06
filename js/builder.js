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
	this.fps = 0;
	this.showfps = false;
	this.lastFrame = 0;
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

	this.ctx.globalAlpha = 1;
	this.updateFPS();
	if (this.showfps) {
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillText("FPS: " + this.fps.toFixed(2), 1560, 10);
	}
	this.ctx.fillStyle = "#FFFFFF";
	Builder.ctx.textAlign = 'left';
	this.ctx.font = 'normal 16pt Lato';
	this.ctx.fillText("Sideboard", 1472, 70);
	this.sorter.render();
};

DeckBuilder.prototype.updateFPS = function() {
	var oldfps = this.fps;
	var now = new Date;
	var thisFrameFPS = 1000 / (now - this.lastFrame);
	var fpsFilter = 30;
	if (now != this.lastFrame) {
		this.fps += (thisFrameFPS - this.fps) / fpsFilter;
		this.lastFrame = now;
	}
	if (isNaN(this.fps) || this.fps === Infinity) this.fps = oldfps;
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