function cardTweens(obj) {
	return {
		fadeOut: function() {
			var tween = new Kinetic.Tween({
				node: obj,
				opacity: 0.0,
				easing: Kinetic.Easings.Linear,
				duration: 0.8
			});
			tween.play();
		},
		fadeIn: function() {
			var tween = new Kinetic.Tween({
				node: obj,
				opacity: 1.0,
				easing: Kinetic.Easings.Linear,
				duration: 0.8
			});
			tween.play();
		},
		fadeDelete: function() {
			var tween = new Kinetic.Tween({
				node: obj,
				opacity: 0.1,
				easing: Kinetic.Easings.Linear,
				duration: 0.8,
				onFinish: function() {
					obj.destroy();
					Builder.sorter.applySort();
					Builder.deckManager.saveDeck();
				}
			});
			tween.play();
		}
	};
}