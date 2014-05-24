function Sorter() {
	this.sortType = 'cost';
	this.values = 0;
	this.cardScale = 0.65;
}

Sorter.prototype.applySort = function() {
	this.sortMainBoard();
	this.sortSideBoard();
	Builder.grapher.calculate();
	Builder.deckManager.saveDeck();
};

Sorter.prototype.calculateCardScale = function() {
	if (this.values < 6) {
		this.cardScale = 0.6;
	} else {
		//Scale cards down as they get closer to the side
		this.cardScale = 0.6 - ((this.values - 5) * 0.060);
	}
};

Sorter.prototype.sortMainBoard = function() {
	var c = [];
	for (var i = 0; i < Builder.cards.length; i++) {
		if (Builder.cards[i].board === 1) {
			c.push(Builder.cards[i]);
		}
	}
	if (this.sortType === 'cost') this.sortByConvertedCost(c);
	else if (this.sortType === 'type') this.sortByCardType(c);
};

Sorter.prototype.sortSideBoard = function() {
	var cards = [];
	for (var i = 0; i < Builder.cards.length; i++) {
		if (Builder.cards[i].board === 2) {
			cards.push(Builder.cards[i]);
		}
	}
	cards = stable(cards, lexCmp);
	for (var i = 0; i < cards.length; i++) {
		cards[i].targetx = 1450;
		cards[i].targety = 50 + i * 75;
		cards[i].z = i;
		cards[i].targetCardScale = 0.5;
	}
};

Sorter.prototype.sortByCardType = function(arr) {
	var sorted = [];
	for (var i = 0; i < 7; i++) {
		sorted[i] = [];
	}
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].cardData.type.contains("land")) sorted[0].push(arr[i]);
		else if (arr[i].cardData.type.contains("creature") || arr[i].cardData.type.contains("summon")) sorted[1].push(arr[i]);
		else if (arr[i].cardData.type.contains("sorcery")) sorted[2].push(arr[i]);
		else if (arr[i].cardData.type.contains("enchant")) sorted[3].push(arr[i]);
		else if (arr[i].cardData.type.contains("instant")) sorted[4].push(arr[i]);
		else if (arr[i].cardData.type.contains("planeswalker")) sorted[5].push(arr[i]);
		else if (arr[i].cardData.type.contains("artifact")) sorted[6].push(arr[i]);
	}
	this.cardScale = 0.54;
	for (var i = 0; i < sorted.length; i++) {
		for (var k = 0; k < sorted[i].length; k++) {
			var x = i * (this.cardScale * 322);
			var y = k * 100;
			sorted[i][k].moveTween = new Kinetic.Tween({
				node: sorted[i][k],
				x: 325 + x,
				y: y,
				easing: Kinetic.Easings.Linear,
				duration: 0.5
			});
			sorted[i][k].moveTween.play();
			sorted[i][k].setZIndex(k);
		}
	}
};

Sorter.prototype.sortByConvertedCost = function(arr) {

	var allValues = [];
	var values = [];

	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === undefined) continue;
		if (arr[i].cardData === undefined) continue;
		if (arr[i].cardData.converted_cost === undefined) continue;
		if (arr[i].cardData.converted_cost === '') arr[i].cardData.converted_cost = 0; //Land
		arr[i].cardData.convertedCost = parseInt(arr[i].cardData.converted_cost);
		allValues.push(arr[i].cardData.convertedCost);
	}
	values = allValues.filter(function(elem, pos) {
		return allValues.indexOf(elem) == pos;
	});
	values.sort(function(a, b) {
		return a - b;
	});
	this.values = values.length;
	this.calculateCardScale();

	//Create sorted 2d array
	var sorted = [];
	for (var i = 0; i < values.length; i++) {
		sorted[i] = [];
	}

	for (var i = 0; i < arr.length; i++) {
		var index = values.indexOf(arr[i].cardData.convertedCost);
		sorted[index].push(arr[i]);
		//Sort the array by name, so cards don't get mixed in their column
		sorted[index] = stable(sorted[index], lexCmp);
	}

	for (var i = 0; i < sorted.length; i++) {
		for (var k = 0; k < sorted[i].length; k++) {
			var x = 330 + (i * (this.cardScale * 322)); //Multiplier to width of 322
			var y = k * 70;
			if (sorted[i].length > 13) y = k * ((13 / sorted[i].length) * 70);
			sorted[i][k].targetx = x;
			sorted[i][k].targety = y;
			sorted[i][k].z = k;
			sorted[i][k].targetCardScale = this.cardScale;
		}
	}
};


function lexCmp(a, b) {
	if (a.cardData.name < b.cardData.name) return -1;
	if (a.cardData.name > b.cardData.name) return 1;
	return 0;
}

//Stable sort implementation
//! stable.js 0.1.5, https://github.com/Two-Screen/stable
//! © 2014 Angry Bytes and contributors. MIT licensed.
(function() {
	function t(e, t) {
		if (typeof t !== "function") {
			t = function(e, t) {
				return String(e).localeCompare(t)
			}
		}
		var r = e.length;
		if (r <= 1) {
			return e
		}
		var i = new Array(r);
		for (var s = 1; s < r; s *= 2) {
			n(e, t, s, i);
			var o = e;
			e = i;
			i = o
		}
		return e
	}
	var e = function(e, n) {
		return t(e.slice(), n)
	};
	e.inplace = function(e, r) {
		var i = t(e, r);
		if (i !== e) {
			n(i, null, e.length, e)
		}
		return e
	};
	var n = function(e, t, n, r) {
		var i = e.length;
		var s = 0;
		var o = n * 2;
		var u, a, f;
		var l, c;
		for (u = 0; u < i; u += o) {
			a = u + n;
			f = a + n;
			if (a > i) a = i;
			if (f > i) f = i;
			l = u;
			c = a;
			while (true) {
				if (l < a && c < f) {
					if (t(e[l], e[c]) <= 0) {
						r[s++] = e[l++]
					} else {
						r[s++] = e[c++]
					}
				} else if (l < a) {
					r[s++] = e[l++]
				} else if (c < f) {
					r[s++] = e[c++]
				} else {
					break
				}
			}
		}
	};
	if (typeof module !== "undefined") {
		module.exports = e
	} else {
		window.stable = e
	}
})()