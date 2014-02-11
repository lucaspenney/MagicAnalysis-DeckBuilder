function createCard(id) {

	$.get("http://localhost/MagicAnalysis-site/api/getcard?id=" + id, function(data) {
		var cardData = $.parseJSON(data);

		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
		img.onload = function() {
			var obj = new Kinetic.Image({
				x: 100,
				y: 100,
				image: img,
			});
			obj.cardData = cardData;
			Builder.mainBoard.add(obj);

			obj.animateFade = new Kinetic.Tween({
				node: obj,
				opacity: 0.0,
				easing: Kinetic.Easings.Linear,
				duration: 0.8
			});
			obj.animateTap = new Kinetic.Tween({
				node: obj,
				rotation: 90,
				x: obj.getAttr('x') + obj.getAttr('width') / 2,
				easing: Kinetic.Easings.Linear,
				duration: 0.5
			});

			Builder.cards.push(obj);
		};
	});
}