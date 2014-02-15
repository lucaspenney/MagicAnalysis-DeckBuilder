function cardTweens(obj) {
	return {
		fadeOut: new Kinetic.Tween({
			node: obj,
			opacity: 0.0,
			easing: Kinetic.Easings.Linear,
			duration: 0.8
		}),
		fadeIn: new Kinetic.Tween({
			node: obj,
			opacity: 1,
			easing: Kinetic.Easings.Linear,
			duration: 0.8
		}),
		tapRotate: new Kinetic.Tween({
			node: obj,
			rotation: 90,
			easing: Kinetic.Easings.Linear,
			duration: 0.5
		})
	};
}