function Sorter() {

}

Sorter.prototype.applySort = function() {
	this.sortMainBoard();
	this.sortSideBoard();
};

Sorter.prototype.sortMainBoard = function() {
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.75,
			y: 0.75
		});
		var x = 350 + ((index % 7) * 70);
		var y = Math.floor(index / 7) * 100;
		node.moveTween = new Kinetic.Tween({
			node: node,
			x: x,
			y: y,
			easing: Kinetic.Easings.Linear,
			duration: 0.5
		});
		node.moveTween.play();
	});
};

Sorter.prototype.sortSideBoard = function() {
	Builder.layers.sideBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.75,
			y: 0.75
		});
		var x = 1200;
		var y = Math.floor(index) * 100;
		node.moveTween = new Kinetic.Tween({
			node: node,
			x: x,
			y: y,
			easing: Kinetic.Easings.Linear,
			duration: 0.5
		});
		node.moveTween.play();
	});
};