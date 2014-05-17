function Card(data, board, onload) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.targetx = 0;
	this.targety = 0;
	this.width = 312;
	this.height = 445;
	this.alpha = 1.0;
	this.targetCardScale = 0.42;
	this.cardScale = 0.42;
	this.cardData = data;
	this.board = board;
	this.loaded = false;
	var _this = this;
	this.img = new Image();
	this.img.src = "http://manastack.com/cards/images/" + this.cardData.set + "/" + this.cardData.num + ".jpg";
	this.img.onload = function() {
		if (onload !== undefined) onload();
		_this.loaded = true;
	}
	Builder.cards.push(this);
}

Card.prototype.render = function() {
	if (this.loaded) {
		Builder.ctx.globalAlpha = this.alpha;
		Builder.ctx.drawImage(this.img, this.x, this.y, Math.floor(this.width * this.cardScale), Math.floor(this.height * this.cardScale));
	}
	//Move the card
	//These are conditional with some rounding, as we don't want to have floating
	//point values if we can avoid them - in this way setting a scale or position
	//to an integer value will eventually arrive *exactly* at that value 
	if (Math.abs(this.cardScale - this.targetCardScale) > 0.01) {
		this.cardScale += (this.targetCardScale - this.cardScale) * 0.1;
	} else this.cardScale = this.targetCardScale;

	if (Math.abs(this.x - this.targetx) > 1) {
		this.x += (this.targetx - this.x) * 0.1;
	} else this.x = this.targetx;

	if (Math.abs(this.y - this.targety) > 1) {
		this.y += (this.targety - this.y) * 0.1;
	} else this.y = this.targety;
};

Card.prototype.remove = function() {

};

Card.prototype.loadImage = function() {
	var _this = this;
	this.loaded = false;
	this.img = new Image();
	this.img.src = "http://manastack.com/cards/images/" + this.cardData.set + "/" + this.cardData.num + ".jpg";
	this.img.onload = function() {
		_this.loaded = true;
	};
}

$('#deckbuilder canvas').mousemove(function(e) {
	if (!Builder) return;
	var x = (e.pageX - this.offsetLeft - 500) * 1.5;
	var y = (e.pageY - this.offsetTop - 60) * 1.5;
	if (Builder.selectedCard) {
		Builder.selectedCard.targetx = x;
		Builder.selectedCard.targety = y;
	}
});

$('#deckbuilder canvas').mousedown(function(e) {
	if (!Builder.selectedCard) {
		var x = (e.pageX - this.offsetLeft - 500) * 1.5;
		var y = (e.pageY - this.offsetTop - 60) * 1.5;
		for (var i = Builder.cards.length - 1; i >= 0; i--) {
			if (Builder.cards[i]) {
				if (Builder.cards[i].x < x && Builder.cards[i].x + (Builder.cards[i].width * Builder.cards[i].cardScale) > x) {
					if (Builder.cards[i].y < y && Builder.cards[i].y + (Builder.cards[i].height * Builder.cards[i].cardScale) > y) {
						Builder.selectedCard = Builder.cards[i];
						Builder.selectedCard.z = 999;
						Builder.selectedCard.targetCardScale = 1.1;
						break;
					}
				}
			}
		}
	}
});

$('body').mouseup(function(e) {
	if (!Builder.selectedCard) return;

	var recreate = false;
	var x = Builder.selectedCard.x;
	var y = Builder.selectedCard.y;

	if (x > 250 && x < 1300) {
		if (Builder.selectedCard.board === 0) recreate = true;
		Builder.selectedCard.board = 1;
	} else if (x >= 1300) {
		if (Builder.selectedCard.board === 0) recreate = true;
		Builder.selectedCard.board = 2;
	} else if (x <= 250) {
		if (Builder.selectedCard.board === 0) {
			Builder.selectedCard.targetx = 0;
			Builder.selectedCard.targety = 0;
			Builder.selectedCard.targetCardScale = 1.03;
			Builder.selectedCard = null;
		}
	}
	if (recreate) {
		Builder.searchManager.createPreviewCard();
	}
	Builder.selectedCard = null;
	Builder.sorter.applySort();
});

$('#deckbuilder canvas').bind("contextmenu", function(e) {
	//Right click delete card
	var x = (e.pageX - this.offsetLeft - 500) * 1.5;
	var y = (e.pageY - this.offsetTop - 60) * 1.5;
	for (var i = Builder.cards.length - 1; i >= 0; i--) {
		if (Builder.cards[i]) {
			if (Builder.cards[i].x < x && Builder.cards[i].x + (Builder.cards[i].width * Builder.cards[i].cardScale) > x) {
				if (Builder.cards[i].y < y && Builder.cards[i].y + (Builder.cards[i].height * Builder.cards[i].cardScale) > y) {
					Builder.cards.splice(i, 1);
					break;
				}
			}
		}
	}

	//Block the regular context menu
	e.preventDefault();
	return false;
});