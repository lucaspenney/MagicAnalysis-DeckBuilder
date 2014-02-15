function Sorter() {

}

Sorter.prototype.boardSort = function() {
	Builder.layers.mainBoard.getChildren().each(function(node, index) {
		node.scale({
			x: 0.3,
			y: 0.3
		});
		var x = 200 + ((index % 7) * 70);
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