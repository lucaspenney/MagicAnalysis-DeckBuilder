function createCard() {

	$.get("http://localhost/MagicAnalysis-site/api/getcard?id=4912", function(data) {
		var cardData = $.parseJSON(data);

		var img = new Image();
		img.src = "http://magicanalysis.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
		img.onload = function() {
			var obj = new Kinetic.Image({
				x: 20,
				y: 50,
				image: img,
			});
			obj.cardData = cardData;
			Builder.mainBoard.add(obj);
		};
	});


}