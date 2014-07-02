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
	this.targetAlpha = 1.0;
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
	var frames = Builder.fps;
	if (frames > 30) frames = 30;
	var animSpeed = (30 - Builder.fps) / 30;
	if (animSpeed < 0.1) animSpeed = 0.1;
	if (animSpeed > 0.8) animSpeed = 0.8;
	//Builder.ctx.fillStyle = "#FFF";
	//Builder.ctx.fillText(animSpeed, 50,50);
	if (Math.abs(this.cardScale - this.targetCardScale) > 0.01) {
		this.cardScale += (this.targetCardScale - this.cardScale) * animSpeed;
	} else this.cardScale = this.targetCardScale;

	if (Math.abs(this.x - this.targetx) > 1) {
		this.x += (this.targetx - this.x) * animSpeed;
	} else this.x = this.targetx;

	if (Math.abs(this.y - this.targety) > 1) {
		this.y += (this.targety - this.y) * animSpeed;
	} else this.y = this.targety;

	if (Math.abs(this.alpha - this.targetAlpha) > 0.01) {
		this.alpha += (this.targetAlpha - this.alpha) * animSpeed;
	} else this.alpha = this.targetAlpha;;
};

Card.prototype.destroy = function() {
	var _this = this;
	setTimeout(function() {
		for (var i = 0; i < Builder.cards.length; i++) {
			if (Builder.cards[i] === _this) {
				Builder.cards.splice(i, 1);
				Builder.sorter.applySort();
				break;
			}
		}
	}, 750);
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
	//Subtracting raw offsets based on the canvas's position on the page.
	//If the canvas moves, these need to be updated.
	//TODO: Fix this
	var rect = e.target.getBoundingClientRect();
	var x = e.offsetX || e.pageX - rect.left - window.scrollX,
		y = e.offsetY || e.pageY - rect.top - window.scrollY;
	if (x) x = x * 1.5;
	if (y) y = y * 1.5;

	if (Builder.selectedCard) {
		Builder.selectedCard.targetx = x;
		Builder.selectedCard.targety = y;
	}
});

$('#deckbuilder canvas').mousedown(function(e) {
	if (!Builder.selectedCard) {
		var rect = e.target.getBoundingClientRect();
		var x = e.offsetX || e.pageX - rect.left - window.scrollX,
			y = e.offsetY || e.pageY - rect.top - window.scrollY;
		if (x) x = x * 1.5;
		if (y) y = y * 1.5;
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

$('#deckbuilder canvas').mouseup(function(e) {
	if (!Builder.selectedCard) return;

	var recreate = false;
	var rect = e.target.getBoundingClientRect();
	var x = e.offsetX || e.pageX - rect.left - window.scrollX,
		y = e.offsetY || e.pageY - rect.top - window.scrollY;
	if (x) x = x * 1.5;
	if (y) y = y * 1.5;

	if (x > 250 && x < 1300) {
		if (Builder.selectedCard.board === 0) {
			if (!Builder.deckManager.addCardToDeck(Builder.selectedCard)) {
				Builder.selectedCard.targetx = 0;
				Builder.selectedCard.targety = 0;
				Builder.selectedCard.targetCardScale = 1.03;
				Builder.selectedCard = null;
				return;
			} else {
				recreate = true;
			}
		} else if (Builder.selectedCard.board === 2) {
			Builder.deckManager.addCardToDeck(Builder.selectedCard);
		}
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
	var rect = e.target.getBoundingClientRect();
	var x = e.offsetX || e.pageX - rect.left - window.scrollX,
		y = e.offsetY || e.pageY - rect.top - window.scrollY;
	if (x) x = x * 1.5;
	if (y) y = y * 1.5;
	for (var i = Builder.cards.length - 1; i >= 0; i--) {
		if (Builder.cards[i]) {
			if (Builder.cards[i].x < x && Builder.cards[i].x + (Builder.cards[i].width * Builder.cards[i].cardScale) > x) {
				if (Builder.cards[i].y < y && Builder.cards[i].y + (Builder.cards[i].height * Builder.cards[i].cardScale) > y) {
					Builder.cards[i].targetAlpha = 0;
					Builder.cards[i].destroy();
					break;
				}
			}
		}
	}

	//Block the regular context menu
	e.preventDefault();
	return false;
});