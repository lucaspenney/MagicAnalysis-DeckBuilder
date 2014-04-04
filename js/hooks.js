function cardHooks(obj) {
	obj.on('click', function() {

	});

	obj.on('dragstart', function(e) {
		var isRightMB;
		e = e || window.event;
		if ("which" in e) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			isRightMB = e.which == 3;
		else if ("button" in e) // IE, Opera 
			isRightMB = e.button == 2;

		if (isRightMB) { //Do something if right mouse click
			obj.fire('delete');
			obj.tweens.fadeDelete();
		}
		obj.tweens.scaleLarge(); //Scale up while we're selecting a card
	});

	obj.on('dragend', function(e) {
		if (this.x() < 1300 && this.x() > 200) {
			this.moveTo(Builder.layers.mainBoard);
			this.fire('enterMainBoard');
		} else if (this.x() >= 1400) {
			this.moveTo(Builder.layers.sideBoard);
			this.fire('enterSideBoard');
		} else if (this.name() == 'previewMain') {
			this.x(0);
			this.y(0);
		}
		Builder.sorter.applySort();
		Builder.deckManager.saveDeck();
	});

	obj.on('enterMainBoard', function() {
		//Card is placed on the main board
		this.tweens.scaleMedium();
		if (this.name() == 'previewMain') {
			this.name('');
			Builder.searchManager.createPreviewCard();
		}
	});

	obj.on('enterSideBoard', function() {
		//Card is placed on the side board
		this.tweens.scaleSmall();
		if (this.name() == 'previewMain') {
			this.name('');
			Builder.searchManager.createPreviewCard();
		}
	});

	obj.on('delete', function() {

	});


	obj.on('dragstart', function() {
		this.setZIndex(1000);
	});

	return true;
}