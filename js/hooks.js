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
			obj.tweens.fadeDelete();
		}
		obj.tweens.scaleLarge();
	});

	obj.on('dragend', function(e) {
		if (obj.x() < 1300) {
			if (obj.x() > 200 && obj.x() < 1400) {
				obj.moveTo(Builder.layers.mainBoard);
				obj.tweens.scaleMedium();
			} else if (obj.name() == 'previewMain') {
				obj.x(0);
				obj.y(0);
				return;
			}
		} else if (obj.x() >= 1400) {
			obj.moveTo(Builder.layers.sideBoard);
			obj.tweens.scaleSmall();
		}
		//If this card was dragged from the search field, recreate the search preview card
		if (obj.name() == 'previewMain') {
			obj.name('');
			var previewMain = new Kinetic.Image({
				x: 0,
				y: 0,
				opacity: 0.0,
				scale: 1.05,
				draggable: true,
				name: 'previewMain'
			});

			Builder.layers.search.add(previewMain);
			previewMain.hooks = cardHooks(previewMain);
			previewMain.tweens = cardTweens(previewMain);
			previewMain.tweens.fadeIn();
			Builder.searchManager.updateDisplay();
		}
		Builder.draw();
		Builder.sortAndSave();

	});


	obj.on('dragstart', function() {
		this.setZIndex(1000);
	});

	return true;
}

//TODO: abstract this out?
DeckBuilder.prototype.sortAndSave = debounce(function() {
	Builder.sorter.applySort();
	Builder.deckManager.saveDeck();
	console.log("Deck saved");
}, 50);

function debounce(fn, delay) {
	var timer = null;
	return function() {
		var context = this,
			args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	};
};