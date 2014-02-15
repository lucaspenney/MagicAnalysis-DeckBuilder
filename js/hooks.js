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

		if (isRightMB) obj.animateTap.play();
	});

	obj.on('dragend', function(e) {
		if (obj.x() < 600) {
			obj.moveTo(Builder.layers.mainBoard);
		} else if (obj.x() >= 600) {
			obj.moveTo(Builder.layers.sideBoard);
		}
		Builder.draw();
	});


	obj.on('dragstart', function() {
		this.setZIndex(1000);
	});

	return true;
}